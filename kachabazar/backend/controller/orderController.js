const Order = require("../models/Order");
const Campaign = require("../models/Campaign");
const OrderTracking = require("../models/OrderTracking");
const CustomerNotification = require("../models/CustomerNotification");
const {
  generateTrackingId,
  getTrackingStatusMessage,
  getNotificationTitle,
  mapTrackingToOrderStatus,
  getNotificationType,
} = require("../utils/tracking");

const getAllOrders = async (req, res) => {
  const {
    day,
    status,
    page,
    limit,
    method,
    endDate,
    // download,
    // sellFrom,
    startDate,
    customerName,
  } = req.query;

  // console.log("called");

  //  day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  const beforeToday = new Date();
  beforeToday.setDate(beforeToday.getDate() - 1);
  // const before_today = beforeToday.toString();

  const startDateData = new Date(startDate);
  startDateData.setDate(startDateData.getDate());
  const start_date = startDateData.toString();

  // console.log(" start_date", start_date, endDate);

  const queryObject = {};

  if (!status) {
    queryObject.status = {
      $in: ["pending", "processing", "out-for-delivery", "delivered", "cancel", "refund-processing", "refunded"],
    };
  }

  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: `${customerName}`, $options: "i" } },
      { invoice: { $regex: `${customerName}`, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if (status) {
    queryObject.status = status;
  }

  if (startDate && endDate) {
    queryObject.updatedAt = {
      $gt: start_date,
      $lt: endDate,
    };
  }
  if (method) {
    queryObject.paymentMethod = { $regex: `${method}`, $options: "i" };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice trackingId paymentMethod subTotal total user_info discount shippingCost status deliveryBoy createdAt updatedAt",
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits)
      .maxTimeMS(15000)
      .lean();

    // Enrich orders with tracking data (deliveryBoyName, trackingStatus)
    const orderIdsWithDelivery = orders
      .filter((o) => o.deliveryBoy)
      .map((o) => o._id);

    let trackingMap = {};
    if (orderIdsWithDelivery.length > 0) {
      const trackingRecords = await OrderTracking.find({
        orderId: { $in: orderIdsWithDelivery },
      })
        .select("orderId status deliveryBoy history")
        .populate("deliveryBoy", "name phone")
        .lean();

      for (const t of trackingRecords) {
        trackingMap[t.orderId.toString()] = t;
      }
    }

    const enrichedOrders = orders.map((order) => {
      const tracking = trackingMap[order._id.toString()];
      // Check if delivery boy has made any status changes
      const deliveryBoyHasActed =
        tracking?.history?.some((h) => h.updatedBy === "delivery-boy") || false;
      return {
        ...order,
        trackingStatus: tracking?.status || "order-placed",
        deliveryBoyName:
          tracking?.deliveryBoy?.name?.en ||
          tracking?.deliveryBoy?.name ||
          null,
        deliveryBoyPhone: tracking?.deliveryBoy?.phone || null,
        deliveryBoyHasActed,
      };
    });

    let methodTotals = [];
    if (startDate && endDate) {
      // console.log("filter method total");
      const filteredOrders = await Order.find(queryObject, {
        _id: 1,
        // subTotal: 1,
        total: 1,

        paymentMethod: 1,
        // createdAt: 1,
        updatedAt: 1,
      }).sort({ updatedAt: -1 });
      for (const order of filteredOrders) {
        const { paymentMethod, total } = order;
        const existPayment = methodTotals.find(
          (item) => item.method === paymentMethod,
        );

        if (existPayment) {
          existPayment.total += total;
        } else {
          methodTotals.push({
            method: paymentMethod,
            total: total,
          });
        }
      }
    }

    res.send({
      orders: enrichedOrders,
      limits,
      pages,
      totalDoc,
      methodTotals,
      // orderOverview,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .sort({ _id: -1 })
      .lean();

    // Enrich with tracking data
    const orderIds = orders.map((o) => o._id);
    const trackingRecords = await OrderTracking.find({
      orderId: { $in: orderIds },
    })
      .select(
        "orderId status deliveryBoy estimatedDeliveryTime actualDeliveryTime",
      )
      .populate("deliveryBoy", "name phone")
      .lean();

    const trackingMap = {};
    for (const t of trackingRecords) {
      trackingMap[t.orderId.toString()] = t;
    }

    const enrichedOrders = orders.map((order) => {
      const tracking = trackingMap[order._id.toString()];
      return {
        ...order,
        trackingStatus: tracking?.status || "order-placed",
        deliveryBoyName:
          tracking?.deliveryBoy?.name?.en ||
          tracking?.deliveryBoy?.name ||
          null,
        deliveryBoyPhone: tracking?.deliveryBoy?.phone || null,
        estimatedDeliveryTime: tracking?.estimatedDeliveryTime || null,
        deliveredAt: tracking?.actualDeliveryTime || null,
      };
    });

    res.send(enrichedOrders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    // Enrich with tracking data from OrderTracking (source of truth)
    const tracking = await OrderTracking.findOne({ orderId: order._id })
      .select("status estimatedDeliveryTime actualDeliveryTime deliveryBoy")
      .populate("deliveryBoy", "name phone")
      .lean();

    order.trackingStatus = tracking?.status || "order-placed";
    order.deliveryBoyName =
      tracking?.deliveryBoy?.name?.en || tracking?.deliveryBoy?.name || null;
    order.deliveryBoyPhone = tracking?.deliveryBoy?.phone || null;
    order.estimatedDeliveryTime = tracking?.estimatedDeliveryTime || null;
    order.deliveredAt = tracking?.actualDeliveryTime || null;

    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const newStatus = req.body.status;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    // Generate tracking ID if not exists
    if (!order.trackingId) {
      order.trackingId = generateTrackingId();
    }

    // Map order status to tracking status
    let trackingStatus = "order-placed";
    if (newStatus === "processing") trackingStatus = "confirmed";
    if (newStatus === "out-for-delivery") trackingStatus = "on-the-way";
    if (newStatus === "delivered") trackingStatus = "delivered";
    if (newStatus === "cancel") trackingStatus = "cancelled";
    if (newStatus === "refund-processing") trackingStatus = "refund-processing";
    if (newStatus === "refunded") trackingStatus = "refunded";

    const previousStatus = order.status;
    order.status = newStatus;

    await order.save();

    // +++ Campaign Update Logic +++
    if (newStatus === "delivered" && previousStatus !== "delivered") {
      try {
        console.log("CRITICAL DEBUG: Order marked as delivered! Processing Campaign updates...");
        const now = new Date();
        for (const item of order.cart) {
          const productId = item.id || item._id;
          console.log(`CRITICAL DEBUG: Checking cart item - productId: ${productId}, quantity: ${item.quantity}`);
          if (!productId) continue;

          const campaign = await Campaign.findOne({
            status: "show",
            endTime: { $gte: now },
            "products.product": productId,
          });

          if (campaign) {
            console.log(`CRITICAL DEBUG: Found associated campaign: ${campaign.title?.en || campaign.slug}`);
            const campaignProduct = campaign.products.find(
              (p) => p.product.toString() === productId.toString()
            );
            if (campaignProduct) {
              console.log(`CRITICAL DEBUG: Updating product ${productId} soldCount from ${campaignProduct.soldCount} to ${campaignProduct.soldCount + (item.quantity || 1)}`);
              campaignProduct.soldCount += (item.quantity || 1);
              if (campaignProduct.soldCount >= campaignProduct.stockLimit) {
                console.log(`CRITICAL DEBUG: Product has reached stock limit. Marked inactive.`);
                campaignProduct.isActive = false;
              }
              await campaign.save();
              console.log(`CRITICAL DEBUG: Successfully saved campaign ${campaign.slug}`);
            }
          } else {
            console.log(`CRITICAL DEBUG: No active campaign found for productId: ${productId}`);
          }
        }
      } catch (err) {
        console.error("Error updating campaign soldCount:", err);
      }
    }
    // +++ End Campaign Update Logic +++

    // Create/Update tracking record (source of truth for tracking data)
    const trackingMessage = getTrackingStatusMessage(trackingStatus);
    const trackingSet = {
      trackingId: order.trackingId,
      status: trackingStatus,
      customerName: order.user_info?.name,
      customerPhone: order.user_info?.contact,
      deliveryAddress: order.user_info?.address,
    };
    if (newStatus === "delivered") {
      trackingSet.actualDeliveryTime = new Date();
    }

    await OrderTracking.findOneAndUpdate(
      { orderId: order._id },
      {
        $set: trackingSet,
        $push: {
          history: {
            status: trackingStatus,
            message: trackingMessage,
            updatedBy: "admin",
            timestamp: new Date(),
          },
        },
      },
      { upsert: true, new: true },
    );

    // Send customer notification
    await CustomerNotification.create({
      customerId: order.user,
      orderId: order._id,
      trackingId: order.trackingId,
      type: getNotificationType(trackingStatus),
      title: getNotificationTitle(trackingStatus),
      message: `Your order #${order.invoice} ${trackingMessage.toLowerCase()}. Track with ID: ${order.trackingId}`,
    });

    res.status(200).send({
      message: "Order Updated Successfully!",
      trackingId: order.trackingId,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating order",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.id });

    res.status(200).send({
      message: "Order Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error deleting order",
    });
  }
};

// get dashboard recent order
const getDashboardRecentOrder = async (req, res) => {
  try {
    // console.log("getDashboardRecentOrder");

    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject = {};

    queryObject.status = {
      $in: ["pending", "processing", "delivered", "cancel", "refund-processing", "refunded"],
    };

    const totalDoc = await Order.countDocuments(queryObject);

    // query for orders
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice trackingId paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt",
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits)
      .lean();

    res.send({
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get dashboard count
const getDashboardCount = async (req, res) => {
  try {
    // Run all aggregations in parallel for performance
    const [totalDoc, statusCounts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$total" },
          },
        },
      ]),
    ]);

    const statusMap = {};
    for (const s of statusCounts) {
      statusMap[s._id] = { count: s.count, total: s.total };
    }

    res.send({
      totalOrder: totalDoc,
      totalPendingOrder: statusMap.pending || { count: 0, total: 0 },
      totalProcessingOrder: statusMap.processing?.count || 0,
      totalDeliveredOrder: statusMap.delivered?.count || 0,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardAmount = async (req, res) => {
  // console.log('total')
  let week = new Date();
  week.setDate(week.getDate() - 10);

  // console.log('getDashboardAmount');

  const currentDate = new Date();
  currentDate.setDate(1); // Set the date to the first day of the current month
  currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

  const lastMonthStartDate = new Date(currentDate); // Copy the current date
  lastMonthStartDate.setMonth(currentDate.getMonth() - 1); // Subtract one month

  let lastMonthEndDate = new Date(currentDate); // Copy the current date
  lastMonthEndDate.setDate(0); // Set the date to the last day of the previous month
  lastMonthEndDate.setHours(23, 59, 59, 999); // Set the time to the end of the day

  try {
    // total order amount
    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);
    // console.log('totalAmount',totalAmount)
    const thisMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "delivered", $options: "i" } }],
          year: { $eq: new Date().getFullYear() },
          month: { $eq: new Date().getMonth() + 1 },
          // $expr: {
          //   $eq: [{ $month: "$updatedAt" }, { $month: new Date() }],
          // },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const lastMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "delivered", $options: "i" } }],

          updatedAt: { $gt: lastMonthStartDate, $lt: lastMonthEndDate },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // console.log("thisMonthlyOrderAmount ===>", thisMonthlyOrderAmount);

    // order list last 10 days
    const orderFilteringData = await Order.find(
      {
        $or: [{ status: { $regex: `delivered`, $options: "i" } }],
        updatedAt: {
          $gte: week,
        },
      },

      {
        paymentMethod: 1,
        paymentDetails: 1,
        total: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    );

    res.send({
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      thisMonthlyOrderAmount: thisMonthOrderAmount[0]?.total,
      lastMonthOrderAmount: lastMonthOrderAmount[0]?.total,
      ordersData: orderFilteringData,
    });
  } catch (err) {
    // console.log('err',err)
    res.status(500).send({
      message: err.message,
    });
  }
};

const getBestSellerProductChart = async (req, res) => {
  try {
    // console.log("getBestSellerProductChart");

    const totalDoc = await Order.countDocuments({});
    const bestSellingProduct = await Order.aggregate([
      {
        $unwind: "$cart",
      },
      {
        $group: {
          _id: "$cart.title",

          count: {
            $sum: "$cart.quantity",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  //   (endDate = '23:59'),
  // console.log("page, limit", page, limit);

  try {
    const totalDoc = await Order.countDocuments({});

    // query for orders
    const orders = await Order.find({})
      .select(
        "_id invoice trackingId paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt",
      )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits)
      .lean();

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);

    // total order amount
    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    // this month order amount
    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "pending",
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

    // total delivered order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "processing",
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

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "delivered",
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

    //weekly sale report
    // filter order data
    const weeklySaleReport = await Order.find({
      $or: [{ status: { $regex: `delivered`, $options: "i" } }],
      createdAt: {
        $gte: week,
      },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth:
        totalAmountOfThisMonth.length === 0
          ? 0
          : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder:
        totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// delete many orders
const deleteManyOrders = async (req, res) => {
  try {
    await Order.deleteMany({ _id: { $in: req.body.ids } });
    res.status(200).send({
      message: "Orders deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// update many orders status
const updateManyOrders = async (req, res) => {
  try {
    const { ids, status } = req.body;

    // +++ Campaign Update Logic +++
    if (status === "delivered") {
      try {
        const ordersToUpdate = await Order.find({ _id: { $in: ids }, status: { $ne: "delivered" } });
        const now = new Date();
        for (const order of ordersToUpdate) {
          for (const item of order.cart) {
            const productId = item.id || item._id;
            if (!productId) continue;
            
            const campaign = await Campaign.findOne({
              status: "show",
              endTime: { $gte: now },
              "products.product": productId,
            });

            if (campaign) {
              const campaignProduct = campaign.products.find(
                (p) => p.product.toString() === productId.toString()
              );
              if (campaignProduct) {
                campaignProduct.soldCount += (item.quantity || 1);
                if (campaignProduct.soldCount >= campaignProduct.stockLimit) {
                  campaignProduct.isActive = false;
                }
                await campaign.save();
              }
            }
          }
        }
      } catch (err) {
        console.error("Error updating campaign soldCount in bulk update:", err);
      }
    }
    // +++ End Campaign Update Logic +++

    await Order.updateMany({ _id: { $in: ids } }, { $set: { status } });
    res.status(200).send({
      message: `Orders status updated to "${status}" successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ── Admin Refund Order via Razorpay ──
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    if (order.paymentMethod !== "RazorPay" || !order.razorpay?.razorpayPaymentId) {
      return res.status(400).send({ message: "This order is not eligible for Razorpay refund." });
    }

    if (order.paymentStatus === "refunded") {
      return res.status(400).send({ message: "Order already refunded." });
    }

    const Setting = require("../models/Setting");
    const storeSetting = await Setting.findOne({ name: "storeSetting" });
    const Razorpay = require("razorpay");
    const keyId =
      storeSetting?.setting?.razorpay_id ||
      process.env.Razor_API_KEY ||
      process.env.Razorpay_API_Key ||
      process.env.RAZORPAY_API_KEY ||
      process.env.RAZORPAY_KEY_ID;
    const keySecret =
      storeSetting?.setting?.razorpay_secret ||
      process.env.Razor_API_SECRET ||
      process.env.Razorpay_Secret_Key ||
      process.env.RAZORPAY_SECRET_KEY ||
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).send({
        message: "Razorpay keys are not configured.",
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const refund = await instance.payments.refund(order.razorpay.razorpayPaymentId, {
      amount: Math.round(order.total * 100),
    });

    order.paymentStatus = "refunded";
    order.status = "refunded";
    order.refundInfo = {
      razorpayRefundId: refund.id,
      amount: order.total,
      reason: reason || "Customer requested refund",
      initiatedBy: req.user?.name || "Admin",
      initiatedAt: new Date(),
      completedAt: new Date(),
      status: "processed",
    };
    await order.save();

    res.status(200).send({
      message: "Refund processed successfully!",
      refundId: refund.id,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error processing refund",
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  deleteManyOrders,
  updateManyOrders,
  getBestSellerProductChart,
  getDashboardOrders,
  getDashboardRecentOrder,
  getDashboardCount,
  getDashboardAmount,
  processRefund,
};
