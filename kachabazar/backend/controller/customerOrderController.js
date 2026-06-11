require("dotenv").config();
const stripe = require("stripe");
const Razorpay = require("razorpay");
const MailChecker = require("mailchecker");
// const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work

const mongoose = require("mongoose");

const Order = require("../models/Order");
const OrderTracking = require("../models/OrderTracking");
const CustomerNotification = require("../models/CustomerNotification");
const Setting = require("../models/Setting");
const { sendEmail } = require("../lib/email-sender/sender");
const { formatAmountForStripe } = require("../lib/stripe/stripe");
const { handleCreateInvoice } = require("../lib/email-sender/create");
const { handleProductQuantity } = require("../lib/stock-controller/others");
const customerInvoiceEmailBody = require("../lib/email-sender/templates/order-to-customer");
const { generateTrackingId } = require("../utils/tracking");

const getRazorpayCredentials = async () => {
  const storeSetting = await Setting.findOne({ name: "storeSetting" });
  const envKeyId =
    process.env.Razorpay_API_Key ||
    process.env.RAZORPAY_API_KEY ||
    process.env.RAZORPAY_KEY_ID;
  const envKeySecret =
    process.env.Razorpay_Secret_Key ||
    process.env.RAZORPAY_SECRET_KEY ||
    process.env.RAZORPAY_KEY_SECRET;
  const dbKeyId = storeSetting?.setting?.razorpay_id;
  const dbKeySecret = storeSetting?.setting?.razorpay_secret;
  const isPlaceholder = (value = "") =>
    value.includes("YourTestKeyHere") || value.includes("YourTestSecretHere");

  const keyId =
    envKeyId || (!isPlaceholder(dbKeyId) ? dbKeyId : undefined);
  const keySecret =
    envKeySecret || (!isPlaceholder(dbKeySecret) ? dbKeySecret : undefined);

  return { keyId, keySecret };
};

const addOrder = async (req, res) => {
  try {
    // 1️⃣ Atomically increment invoice counter to prevent race conditions
    const counterDoc = await Setting.findOneAndUpdate(
      { name: "invoiceCounter" },
      { $inc: { "setting.counter": 1 } },
      { new: true, upsert: true },
    );

    const nextInvoice = counterDoc?.setting?.counter || 10000;

    // Generate tracking ID
    const trackingId = generateTrackingId();

    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
      invoice: nextInvoice,
      trackingId,
    });

    const order = await newOrder.save();

    // Create tracking record
    await OrderTracking.create({
      orderId: order._id,
      trackingId,
      status: "order-placed",
      customerName: order.user_info?.name,
      customerPhone: order.user_info?.contact,
      deliveryAddress: order.user_info?.address,
      history: [
        {
          status: "order-placed",
          message: "Your order has been placed successfully",
          updatedBy: "system",
          timestamp: new Date(),
        },
      ],
    });

    // Send customer notification
    await CustomerNotification.create({
      customerId: req.user._id,
      orderId: order._id,
      trackingId,
      type: "order-placed",
      title: "Order Placed! 🎉",
      message: `Your order #${nextInvoice} has been placed successfully. Track your order with ID: ${trackingId}`,
    });

    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    // console.log("error", err);

    res.status(500).send({
      message: err.message,
    });
  }
};

//create payment intent for stripe
const createPaymentIntent = async (req, res) => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;
  // console.log("req.body", req.body);
  // Validate the amount that was passed from the client.
  if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
    return res.status(500).json({ message: "Invalid amount." });
  }
  const storeSetting = await Setting.findOne({ name: "storeSetting" });
  const stripeSecret = storeSetting?.setting?.stripe_secret;
  const stripeInstance = stripe(stripeSecret);
  if (payment_intent.id) {
    try {
      const current_intent = await stripeInstance.paymentIntents.retrieve(
        payment_intent.id,
      );
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripeInstance.paymentIntents.update(
          payment_intent.id,
          {
            amount: formatAmountForStripe(amount, "usd"),
          },
        );
        // console.log("updated_intent", updated_intent);
        return res.send(updated_intent);
      }
    } catch (err) {
      // console.log("error", err);

      if (err.code !== "resource_missing") {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        return res.status(500).send({ message: errorMessage });
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, "usd"),
      currency: "usd",
      description: process.env.STRIPE_PAYMENT_DESCRIPTION || "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent = await stripeInstance.paymentIntents.create(params);
    // console.log("payment_intent", payment_intent);

    res.send(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

const createOrderByRazorPay = async (req, res) => {
  try {
    const { keyId, keySecret } = await getRazorpayCredentials();

    if (!keyId || !keySecret) {
      return res.status(500).send({
        message: "Razorpay test keys are not configured.",
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    if (!order)
      return res.status(500).send({
        message: "Error occurred when creating order!",
      });
    res.send({ ...order, keyId });
  } catch (err) {
    const message =
      err?.error?.description || err?.error?.reason || err?.message;
    res.status(500).send({
      message,
    });
  }
};

const addRazorpayOrder = async (req, res) => {
  try {
    // Verify Razorpay payment signature server-side
    const { razorpay } = req.body;
    if (razorpay?.razorpayPaymentId && razorpay?.razorpayOrderId && razorpay?.razorpaySignature) {
      const { keySecret } = await getRazorpayCredentials();
      const crypto = require("crypto");
      const generatedSignature = crypto
        .createHmac("sha256", keySecret || "")
        .update(`${razorpay.razorpayOrderId}|${razorpay.razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpay.razorpaySignature) {
        return res.status(400).send({ message: "Invalid payment signature!" });
      }
    }

    const counterDoc = await Setting.findOneAndUpdate(
      { name: "invoiceCounter" },
      { $inc: { "setting.counter": 1 } },
      { new: true, upsert: true },
    );
    const nextInvoice = counterDoc?.setting?.counter || 10000;
    const trackingId = generateTrackingId();

    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
      invoice: nextInvoice,
      trackingId,
      paymentStatus: "captured",
    });
    const order = await newOrder.save();

    await OrderTracking.create({
      orderId: order._id,
      trackingId,
      status: "order-placed",
      customerName: order.user_info?.name,
      customerPhone: order.user_info?.contact,
      deliveryAddress: order.user_info?.address,
      history: [
        {
          status: "order-placed",
          message: "Your order has been placed successfully",
          updatedBy: "system",
          timestamp: new Date(),
        },
      ],
    });

    await CustomerNotification.create({
      customerId: req.user._id,
      orderId: order._id,
      trackingId,
      type: "order-placed",
      title: "Order Placed! 🎉",
      message: `Your order #${nextInvoice} has been placed successfully. Track your order with ID: ${trackingId}`,
    });

    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ── Razorpay Webhook ──
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const actualSignature = req.headers["x-razorpay-signature"];

    if (expectedSignature !== actualSignature) {
      return res.status(400).send({ message: "Invalid webhook signature" });
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (event === "payment.captured" && payment) {
      await Order.findOneAndUpdate(
        { "razorpay.razorpayPaymentId": payment.id },
        { paymentStatus: "captured" },
      );
    }

    if (event === "payment.failed" && payment) {
      await Order.findOneAndUpdate(
        { "razorpay.razorpayPaymentId": payment.id },
        { paymentStatus: "failed" },
      );
    }

    res.status(200).send({ status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// get all orders user
const getOrderCustomer = async (req, res) => {
  try {
    // console.log("getOrderCustomer", req.user);
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const totalDoc = await Order.countDocuments({ user: userId });

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: { $regex: `pending`, $options: "i" },
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: { $regex: `processing`, $options: "i" },
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: { $regex: `delivered`, $options: "i" },
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount

    // query for orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits)
      .lean();

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,

      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    // console.log("getOrderById");
    const order = await Order.findById(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const sendEmailInvoiceToCustomer = async (req, res) => {
  try {
    const user = req.body.user_info;
    // Validate email using MailChecker
    // Validate email using MailChecker
    if (!MailChecker.isValid(user?.email)) {
      // Return a response indicating invalid email instead of using process.exit
      return res.status(400).send({
        message:
          "Invalid or disposable email address. Please provide a valid email.",
      });
    }
    // console.log("sendEmailInvoiceToCustomer");
    const pdf = await handleCreateInvoice(req.body, `${req.body.invoice}.pdf`);

    const option = {
      date: req.body.date,
      invoice: req.body.invoice,
      status: req.body.status,
      method: req.body.paymentMethod,
      subTotal: req.body.subTotal,
      total: req.body.total,
      discount: req.body.discount,
      shipping: req.body.shippingCost,
      currency: req.body.company_info.currency,
      company_name: req.body.company_info.company,
      company_address: req.body.company_info.address,
      company_phone: req.body.company_info.phone,
      company_email: req.body.company_info.email,
      company_website: req.body.company_info.website,
      vat_number: req.body?.company_info?.vat_number,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      cart: req.body.cart,
    };

    const body = {
      from: req.body.company_info?.from_email || "sales@hautecouturejewellery.com",
      to: user.email,
      subject: `Your Order - ${req.body.invoice} at ${req.body.company_info.company}`,
      html: customerInvoiceEmailBody(option),
      attachments: [
        {
          filename: `${req.body.invoice}.pdf`,
          content: pdf,
        },
      ],
    };
    const message = `Invoice successfully sent to the customer ${user.name}`;
    sendEmail(body, res, message);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Add Guest Order — allows checkout without authentication
 * Requires guest checkout to be enabled in global settings
 */
const addGuestOrder = async (req, res) => {
  try {
    // Validate required guest info
    const { user_info, cart } = req.body;
    if (!user_info?.name || !user_info?.contact || !user_info?.address) {
      return res.status(400).send({
        message:
          "Name, phone number, and address are required for guest checkout.",
      });
    }

    // Require at least email or contact
    if (!user_info?.email && !user_info?.contact) {
      return res.status(400).send({
        message: "Email or phone number is required for guest checkout.",
      });
    }

    if (!cart || cart.length === 0) {
      return res.status(400).send({
        message: "Cart cannot be empty.",
      });
    }

    // Auto-create or find existing customer account for the guest
    const Customer = require("../models/Customer");
    const bcrypt = require("bcryptjs");
    let customer = null;

    // Try to find existing customer by email first, then by phone
    if (user_info.email) {
      customer = await Customer.findOne({
        email: user_info.email.toLowerCase(),
      });
    }
    if (!customer && user_info.contact) {
      customer = await Customer.findOne({ phone: user_info.contact });
    }

    // If no existing customer found, create a new one
    if (!customer) {
      const randomPassword = Math.random().toString(36).slice(-10);
      customer = new Customer({
        name: user_info.name,
        email: user_info.email
          ? user_info.email.toLowerCase()
          : `guest_${Date.now()}@guest.local`,
        phone: user_info.contact || "",
        address: user_info.address || "",
        city: user_info.city || "",
        country: user_info.country || "",
        password: bcrypt.hashSync(randomPassword),
        shippingAddress: {
          name: user_info.name,
          contact: user_info.contact,
          email: user_info.email,
          address: user_info.address,
          city: user_info.city,
          country: user_info.country,
          zipCode: user_info.zipCode,
        },
      });
      await customer.save();
    }

    // Get the next invoice number atomically
    const counterDoc = await Setting.findOneAndUpdate(
      { name: "invoiceCounter" },
      { $inc: { "setting.counter": 1 } },
      { new: true, upsert: true },
    );

    const nextInvoice = counterDoc?.setting?.counter || 10000;
    const trackingId = generateTrackingId();

    const newOrder = new Order({
      ...req.body,
      user: customer._id, // Link to auto-created/existing customer
      invoice: nextInvoice,
      trackingId,
    });

    const order = await newOrder.save();

    // Create tracking record
    await OrderTracking.create({
      orderId: order._id,
      trackingId,
      status: "order-placed",
      customerName: order.user_info?.name,
      customerPhone: order.user_info?.contact,
      deliveryAddress: order.user_info?.address,
      history: [
        {
          status: "order-placed",
          message: "Guest order has been placed successfully",
          updatedBy: "system",
          timestamp: new Date(),
        },
      ],
    });

    // Create customer notification for the guest user
    await CustomerNotification.create({
      customerId: customer._id,
      orderId: order._id,
      trackingId,
      type: "order-placed",
      title: "Order Placed! 🎉",
      message: `Your order #${nextInvoice} has been placed successfully. Track your order with ID: ${trackingId}`,
    });

    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  addGuestOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  createOrderByRazorPay,
  addRazorpayOrder,
  sendEmailInvoiceToCustomer,
  razorpayWebhook,
};
