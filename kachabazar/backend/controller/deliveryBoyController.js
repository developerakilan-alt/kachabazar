const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy");
const Order = require("../models/Order");
const OrderTracking = require("../models/OrderTracking");
const CustomerNotification = require("../models/CustomerNotification");
const { signInToken, handleEncryptData } = require("../config/auth");
const {
  generateTrackingId,
  getTrackingStatusMessage,
  getNotificationTitle,
  mapTrackingToOrderStatus,
  getNotificationType,
} = require("../utils/tracking");

// ==================== ADMIN OPERATIONS ====================

/**
 * Add a new delivery boy (Admin)
 */
const addDeliveryBoy = async (req, res) => {
  try {
    const isAdded = await DeliveryBoy.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    }

    const newDeliveryBoy = new DeliveryBoy({
      name: { ...req.body.name },
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password || "12345678"),
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      zipCode: req.body.zipCode,
      vehicleType: req.body.vehicleType,
      vehicleNumber: req.body.vehicleNumber,
      licenseNumber: req.body.licenseNumber,
      image: req.body.image,
      joiningDate: req.body.joiningDate || new Date(),
    });

    await newDeliveryBoy.save();
    res.status(200).send({
      message: "Delivery Boy Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get all delivery boys with pagination, search, filters (Admin)
 */
const getAllDeliveryBoys = async (req, res) => {
  try {
    const { page, limit, search, status, availability, sortBy, sortOrder } =
      req.query;

    // If no page/limit, return all (legacy behavior)
    if (!page && !limit) {
      const deliveryBoys = await DeliveryBoy.find({})
        .select("-password")
        .sort({ _id: -1 });
      return res.send(deliveryBoys);
    }

    const queryObject = {};

    if (search) {
      queryObject.$or = [
        { "name.en": { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      queryObject.status = status;
    }

    if (availability) {
      queryObject.availability = availability;
    }

    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await DeliveryBoy.countDocuments(queryObject);
    const deliveryBoys = await DeliveryBoy.find(queryObject)
      .select("-password -ratings")
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      deliveryBoys,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy by ID (Admin)
 */
const getDeliveryBoyById = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.params.id).select(
      "-password",
    );
    if (!deliveryBoy) {
      return res.status(404).send({ message: "Delivery Boy not found!" });
    }
    res.send(deliveryBoy);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update delivery boy (Admin)
 */
const updateDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findOne({ _id: req.params.id });

    if (deliveryBoy) {
      deliveryBoy.name = { ...deliveryBoy.name, ...req.body.name };
      deliveryBoy.email = req.body.email || deliveryBoy.email;
      deliveryBoy.phone = req.body.phone || deliveryBoy.phone;
      deliveryBoy.address = req.body.address || deliveryBoy.address;
      deliveryBoy.city = req.body.city || deliveryBoy.city;
      deliveryBoy.country = req.body.country || deliveryBoy.country;
      deliveryBoy.zipCode = req.body.zipCode || deliveryBoy.zipCode;
      deliveryBoy.vehicleType = req.body.vehicleType || deliveryBoy.vehicleType;
      deliveryBoy.vehicleNumber =
        req.body.vehicleNumber || deliveryBoy.vehicleNumber;
      deliveryBoy.licenseNumber =
        req.body.licenseNumber || deliveryBoy.licenseNumber;
      deliveryBoy.image = req.body.image || deliveryBoy.image;

      await deliveryBoy.save();
      res.send({
        message: "Delivery Boy Updated Successfully!",
      });
    } else {
      res.status(404).send({
        message: "Delivery Boy not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update delivery boy status (Admin)
 */
const updateDeliveryBoyStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await DeliveryBoy.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } },
    );

    res.send({
      message: `Delivery Boy ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Delete delivery boy (Admin)
 */
const deleteDeliveryBoy = async (req, res) => {
  try {
    // Check if delivery boy has any active orders
    const activeOrders = await Order.countDocuments({
      deliveryBoy: req.params.id,
      status: { $in: ["processing", "out-for-delivery"] },
    });

    if (activeOrders > 0) {
      return res.status(400).send({
        message: `Cannot delete! This delivery boy has ${activeOrders} active order(s).`,
      });
    }

    await DeliveryBoy.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Delivery Boy Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Delete many delivery boys (Admin)
 */
const deleteManyDeliveryBoys = async (req, res) => {
  try {
    await DeliveryBoy.deleteMany({ _id: { $in: req.body.ids } });
    res.status(200).send({
      message: "Delivery Boys deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get all orders assigned to a specific delivery boy (Admin view)
 */
const getDeliveryBoyOrders = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const deliveryBoyId = req.params.id;

    const queryObject = { deliveryBoy: deliveryBoyId };

    if (status) {
      queryObject.status = { $regex: status, $options: "i" };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice trackingId paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt",
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits)
      .lean();

    // Enrich with tracking status from OrderTracking
    const orderIds = orders.map((o) => o._id);
    const trackingRecords = await OrderTracking.find({
      orderId: { $in: orderIds },
    })
      .select("orderId status")
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
      };
    });

    res.send({
      orders: enrichedOrders,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Assign delivery boy to an order (Admin)
 */
const assignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, orderIds, deliveryBoyId } = req.body;

    // Support both single orderId and multiple orderIds
    const ids = orderIds || (orderId ? [orderId] : []);
    if (!ids.length) {
      return res.status(400).send({ message: "Order ID(s) required!" });
    }

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).send({ message: "Delivery Boy not found!" });
    }

    if (deliveryBoy.status !== "active") {
      return res.status(400).send({ message: "Delivery Boy is not active!" });
    }

    let assignedCount = 0;
    const trackingIds = [];
    const skippedOrders = [];

    for (const oid of ids) {
      const order = await Order.findById(oid);
      if (!order) continue;

      // Skip delivered or cancelled orders
      const lowerStatus = order.status?.toLowerCase();
      if (lowerStatus === "delivered" || lowerStatus === "cancel") {
        skippedOrders.push(order.invoice);
        continue;
      }

      // If order already has a delivery boy assigned, check if that delivery boy has acted
      if (order.deliveryBoy) {
        const existingTracking = await OrderTracking.findOne({ orderId: oid });
        const deliveryBoyActed = existingTracking?.history?.some(
          (h) => h.updatedBy === "delivery-boy",
        );
        if (deliveryBoyActed) {
          skippedOrders.push(order.invoice);
          continue; // Skip — delivery boy already acted on this order
        }
      }

      // Generate tracking ID if not exists
      let trackingId = order.trackingId;
      if (!trackingId) {
        trackingId = generateTrackingId();
      }

      // Update order
      order.deliveryBoy = deliveryBoyId;
      order.trackingId = trackingId;
      if (order.status === "pending") {
        order.status = "processing";
      }
      await order.save();

      trackingIds.push(trackingId);
      assignedCount++;

      // Create/update tracking record
      await OrderTracking.findOneAndUpdate(
        { orderId: oid },
        {
          $set: {
            trackingId,
            deliveryBoy: deliveryBoyId,
            status: "confirmed",
            customerName: order.user_info?.name,
            customerPhone: order.user_info?.contact,
            deliveryAddress: order.user_info?.address,
          },
          $push: {
            history: {
              status: "confirmed",
              message: `Delivery partner ${deliveryBoy.name?.en || "assigned"} has been assigned to your order`,
              updatedBy: "admin",
              timestamp: new Date(),
            },
          },
        },
        { upsert: true, new: true },
      );

      // Send notification to customer
      if (order.user) {
        await CustomerNotification.create({
          customerId: order.user,
          orderId: order._id,
          trackingId,
          type: "delivery-assigned",
          title: "Delivery Partner Assigned 🚀",
          message: `${deliveryBoy.name?.en || "A delivery partner"} has been assigned to deliver your order #${order.invoice}. Track your order with ID: ${trackingId}`,
          metadata: {
            deliveryBoyName: deliveryBoy.name?.en,
            deliveryBoyPhone: deliveryBoy.phone,
            deliveryBoyImage: deliveryBoy.image,
          },
        });
      }
    }

    // Update delivery boy availability & stats
    deliveryBoy.availability = "on-delivery";
    deliveryBoy.totalDeliveries += assignedCount;
    await deliveryBoy.save();

    let message = `Delivery Boy assigned to ${assignedCount} order(s) successfully!`;
    if (skippedOrders.length > 0) {
      message += ` ${skippedOrders.length} order(s) skipped (delivery boy already acted on them: #${skippedOrders.join(", #")}).`;
    }

    res.send({
      message,
      trackingIds,
      assignedCount,
      skippedOrders,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Unassign delivery boy from order(s) (Admin)
 * Only allowed if the delivery boy has NOT made any status changes
 */
const unassignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, orderIds } = req.body;

    // Support both single orderId and multiple orderIds
    const ids = orderIds || (orderId ? [orderId] : []);
    if (!ids.length) {
      return res.status(400).send({ message: "Order ID(s) required!" });
    }

    let unassignedCount = 0;
    const skippedOrders = [];

    for (const oid of ids) {
      const order = await Order.findById(oid);
      if (!order) continue;

      // Skip delivered or cancelled orders
      const lowerStatus = order.status?.toLowerCase();
      if (lowerStatus === "delivered" || lowerStatus === "cancel") {
        skippedOrders.push(order.invoice);
        continue;
      }

      // Skip if no delivery boy assigned
      if (!order.deliveryBoy) continue;

      // Check if delivery boy has acted on this order
      const tracking = await OrderTracking.findOne({ orderId: oid });
      const deliveryBoyActed = tracking?.history?.some(
        (h) => h.updatedBy === "delivery-boy",
      );

      if (deliveryBoyActed) {
        skippedOrders.push(order.invoice);
        continue; // Cannot unassign — delivery boy already acted
      }

      const previousDeliveryBoyId = order.deliveryBoy;

      // Remove delivery boy from order
      order.deliveryBoy = null;
      // Revert status back to pending if it was auto-set to processing on assign
      if (order.status === "processing" || order.status === "Processing") {
        order.status = "pending";
      }
      await order.save();

      // Update tracking record
      if (tracking) {
        tracking.deliveryBoy = null;
        tracking.status = "order-placed";
        tracking.history.push({
          status: "order-placed",
          message: "Delivery partner has been unassigned from this order",
          updatedBy: "admin",
          timestamp: new Date(),
        });
        await tracking.save();
      }

      // Send notification to customer
      if (order.user) {
        await CustomerNotification.create({
          customerId: order.user,
          orderId: order._id,
          trackingId: order.trackingId,
          type: "delivery-unassigned",
          title: "Delivery Update",
          message: `The delivery partner for your order #${order.invoice} has been changed. A new partner will be assigned shortly.`,
        });
      }

      // Update previous delivery boy's availability back
      if (previousDeliveryBoyId) {
        const prevBoy = await DeliveryBoy.findById(previousDeliveryBoyId);
        if (prevBoy) {
          // Check if this delivery boy has other active deliveries
          const otherActiveOrders = await Order.countDocuments({
            deliveryBoy: previousDeliveryBoyId,
            status: { $nin: ["Delivered", "Cancel", "cancelled", "delivered"] },
          });
          if (otherActiveOrders === 0) {
            prevBoy.availability = "available";
            await prevBoy.save();
          }
        }
      }

      unassignedCount++;
    }

    if (unassignedCount === 0 && skippedOrders.length > 0) {
      return res.status(400).send({
        message: `Cannot unassign: delivery boy has already acted on order(s) #${skippedOrders.join(", #")}. Status changes have been made.`,
        skippedOrders,
      });
    }

    let message = `Delivery Boy unassigned from ${unassignedCount} order(s) successfully!`;
    if (skippedOrders.length > 0) {
      message += ` ${skippedOrders.length} order(s) skipped (delivery boy already acted: #${skippedOrders.join(", #")}).`;
    }

    res.send({
      message,
      unassignedCount,
      skippedOrders,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy dashboard stats (Admin)
 */
const getDeliveryBoyDashboard = async (req, res) => {
  try {
    const totalDeliveryBoys = await DeliveryBoy.countDocuments();
    const activeDeliveryBoys = await DeliveryBoy.countDocuments({
      status: "active",
    });
    const availableDeliveryBoys = await DeliveryBoy.countDocuments({
      status: "active",
      availability: "available",
    });
    const onDeliveryBoys = await DeliveryBoy.countDocuments({
      availability: "on-delivery",
    });

    // Top rated delivery boys
    const topRated = await DeliveryBoy.find({ totalRatings: { $gt: 0 } })
      .select("name image averageRating totalRatings completedDeliveries")
      .sort({ averageRating: -1 })
      .limit(5);

    res.send({
      totalDeliveryBoys,
      activeDeliveryBoys,
      availableDeliveryBoys,
      onDeliveryBoys,
      topRated,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ==================== DELIVERY BOY OPERATIONS ====================

/**
 * Delivery boy login
 */
const loginDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findOne({ email: req.body.email });
    if (
      deliveryBoy &&
      bcrypt.compareSync(req.body.password, deliveryBoy.password)
    ) {
      if (deliveryBoy.status !== "active") {
        return res.status(403).send({
          message:
            "Your account is not active. Please contact the administrator.",
        });
      }

      const token = signInToken(deliveryBoy);

      // Delivery boy gets limited access to their own pages
      const deliveryBoyAccessList = [
        "my-dashboard",
        "order",
        "edit-profile",
        "notifications",
      ];

      const { data, iv } = handleEncryptData([
        ...deliveryBoyAccessList,
        "delivery-boy", // role as last element
      ]);

      res.send({
        token,
        _id: deliveryBoy._id,
        name: deliveryBoy.name,
        email: deliveryBoy.email,
        phone: deliveryBoy.phone,
        image: deliveryBoy.image,
        role: "delivery-boy",
        iv,
        data,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy's own assigned orders
 */
const getMyOrders = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const deliveryBoyId = req.user._id;

    const queryObject = { deliveryBoy: deliveryBoyId };

    if (status) {
      queryObject.status = { $regex: status, $options: "i" };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments(queryObject);

    const currentOrders = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: { $in: ["processing", "out-for-delivery"] },
    });

    const orders = await Order.find(queryObject)
      .select(
        "_id invoice trackingId paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt",
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits)
      .lean();

    // Enrich orders with tracking data from OrderTracking
    const orderIds = orders.map((o) => o._id);
    const trackingRecords = await OrderTracking.find({
      orderId: { $in: orderIds },
    })
      .select(
        "orderId status estimatedDeliveryTime actualDeliveryTime deliveryBoy",
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

    res.send({
      orders: enrichedOrders,
      totalDoc,
      currentOrders,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy's current active order
 */
const getCurrentOrder = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;

    const order = await Order.findOne({
      deliveryBoy: deliveryBoyId,
      status: { $in: ["processing", "out-for-delivery"] },
    }).sort({ updatedAt: -1 });

    if (!order) {
      return res.send({ order: null, message: "No active delivery" });
    }

    const tracking = await OrderTracking.findOne({ orderId: order._id });

    res.send({
      order,
      tracking,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update order tracking status (Delivery Boy)
 */
const updateTrackingStatus = async (req, res) => {
  try {
    const { trackingStatus, message: statusMessage, location } = req.body;
    const orderId = req.params.id;
    const deliveryBoyId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    if (order.deliveryBoy?.toString() !== deliveryBoyId) {
      return res.status(403).send({
        message: "You are not assigned to this order!",
      });
    }

    // Update order status (only the main status, tracking details stay in OrderTracking)
    const orderStatus = mapTrackingToOrderStatus(trackingStatus);
    order.status = orderStatus;

    if (trackingStatus === "delivered") {
      // Update delivery boy stats
      const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
      if (deliveryBoy) {
        deliveryBoy.completedDeliveries += 1;
        deliveryBoy.totalEarnings += order.shippingCost || 0;
        deliveryBoy.availability = "available";
        await deliveryBoy.save();
      }
    }

    if (trackingStatus === "cancelled") {
      const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
      if (deliveryBoy) {
        deliveryBoy.cancelledDeliveries += 1;
        deliveryBoy.availability = "available";
        await deliveryBoy.save();
      }
    }

    await order.save();

    // Update tracking record
    const trackingMessage =
      statusMessage || getTrackingStatusMessage(trackingStatus);

    // Build the $set object for tracking update
    const trackingSet = { status: trackingStatus };
    if (trackingStatus === "delivered") {
      trackingSet.actualDeliveryTime = new Date();
    }

    await OrderTracking.findOneAndUpdate(
      { orderId },
      {
        $set: trackingSet,
        $push: {
          history: {
            status: trackingStatus,
            message: trackingMessage,
            location: location || {},
            updatedBy: "delivery-boy",
            updatedById: deliveryBoyId,
            updatedByModel: "DeliveryBoy",
            timestamp: new Date(),
          },
        },
      },
    );

    // Update delivery boy location if provided
    if (location?.lat && location?.lng) {
      await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
        $set: {
          currentLocation: {
            lat: location.lat,
            lng: location.lng,
            updatedAt: new Date(),
          },
        },
      });
    }

    // Send customer notification
    await CustomerNotification.create({
      customerId: order.user,
      orderId: order._id,
      trackingId: order.trackingId,
      type: getNotificationType(trackingStatus),
      title: getNotificationTitle(trackingStatus),
      message: trackingMessage,
      metadata: { trackingStatus, location },
    });

    res.send({
      message: "Tracking status updated successfully!",
      trackingStatus,
      orderStatus,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update delivery boy location (Delivery Boy)
 */
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const deliveryBoyId = req.user._id;

    await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
      $set: {
        currentLocation: {
          lat,
          lng,
          updatedAt: new Date(),
        },
      },
    });

    res.send({ message: "Location updated!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy stats (Delivery Boy's own)
 */
const getMyStats = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;

    const deliveryBoy =
      await DeliveryBoy.findById(deliveryBoyId).select("-password");

    if (!deliveryBoy) {
      return res.status(404).send({ message: "Delivery boy not found!" });
    }

    // Get this month's deliveries
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthDeliveries = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: "delivered",
      updatedAt: { $gte: startOfMonth },
    });

    // Get today's deliveries
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayDeliveries = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: "delivered",
      updatedAt: { $gte: startOfDay },
    });

    // Get current active orders
    const activeOrders = await Order.countDocuments({
      deliveryBoy: deliveryBoyId,
      status: { $in: ["processing", "out-for-delivery"] },
    });

    // Get this month's earnings
    const thisMonthEarnings = await Order.aggregate([
      {
        $match: {
          deliveryBoy: deliveryBoy._id,
          status: "delivered",
          updatedAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$shippingCost" },
        },
      },
    ]);

    // Recent ratings
    const recentRatings = deliveryBoy.ratings
      ? deliveryBoy.ratings.slice(-5).reverse()
      : [];

    res.send({
      totalDeliveries: deliveryBoy.totalDeliveries,
      completedDeliveries: deliveryBoy.completedDeliveries,
      cancelledDeliveries: deliveryBoy.cancelledDeliveries,
      totalEarnings: deliveryBoy.totalEarnings,
      averageRating: deliveryBoy.averageRating,
      totalRatings: deliveryBoy.totalRatings,
      thisMonthDeliveries,
      todayDeliveries,
      activeOrders,
      thisMonthEarnings: thisMonthEarnings[0]?.total || 0,
      recentRatings,
      availability: deliveryBoy.availability,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update delivery boy availability (Delivery Boy)
 */
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const deliveryBoyId = req.user._id;

    await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
      $set: { availability },
    });

    res.send({
      message: `Availability updated to ${availability}!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get delivery boy's own profile (Delivery Boy)
 */
const getMyProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId).select(
      "-password -ratings -currentLocation",
    );

    if (!deliveryBoy) {
      return res.status(404).send({ message: "Profile not found!" });
    }

    res.send(deliveryBoy);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Update delivery boy's own profile (Delivery Boy)
 * Limited to: name, phone, image, password
 */
const updateMyProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { name, phone, image, password } = req.body;

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).send({ message: "Profile not found!" });
    }

    // Only allow updating limited fields
    if (name) deliveryBoy.name = name;
    if (phone) deliveryBoy.phone = phone;
    if (image !== undefined) deliveryBoy.image = image;
    if (password) {
      deliveryBoy.password = bcrypt.hashSync(password);
    }

    await deliveryBoy.save();

    // Return updated info for cookie refresh
    const { data, iv } = handleEncryptData([
      "my-dashboard",
      "order",
      "edit-profile",
      "notifications",
      "delivery-boy",
    ]);

    res.send({
      _id: deliveryBoy._id,
      name: deliveryBoy.name,
      email: deliveryBoy.email,
      phone: deliveryBoy.phone,
      image: deliveryBoy.image,
      role: "delivery-boy",
      iv,
      data,
      message: "Profile updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ==================== SHARED OPERATIONS ====================

/**
 * Get order tracking history (Admin & Delivery Boy)
 */
const getOrderTrackingHistory = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).select(
      "_id invoice trackingId status deliveryBoy createdAt updatedAt",
    );

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    const tracking = await OrderTracking.findOne({ orderId })
      .select(
        "status history estimatedDeliveryTime actualDeliveryTime deliveryProof deliveryBoy",
      )
      .populate("deliveryBoy", "name phone")
      .lean();

    res.send({
      order: {
        _id: order._id,
        invoice: order.invoice,
        trackingId: order.trackingId,
        status: order.status,
        trackingStatus: tracking?.status || "order-placed",
        deliveryBoyName:
          tracking?.deliveryBoy?.name?.en ||
          tracking?.deliveryBoy?.name ||
          null,
        createdAt: order.createdAt,
      },
      tracking: tracking || {
        status: "order-placed",
        history: [],
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// ==================== CUSTOMER OPERATIONS ====================

/**
 * Track order by tracking ID (Customer/Public)
 */
const trackOrder = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const order = await Order.findOne({ trackingId }).select(
      "_id invoice trackingId status user_info cart total deliveryBoy deliveryRating createdAt updatedAt shiprocket courierTracking",
    );

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    const tracking = await OrderTracking.findOne({ orderId: order._id })
      .select("status history estimatedDeliveryTime actualDeliveryTime")
      .lean();

    // Get delivery boy info if assigned
    let deliveryBoy = null;
    if (order.deliveryBoy) {
      deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy).select(
        "name phone image vehicleType vehicleNumber averageRating totalRatings currentLocation",
      );
    }

    // Fetch ShipRocket tracking if AWB is available and write back status
    let shiprocketTracking = null;
    if (order.shiprocket?.awb) {
      try {
        const shiprocket = require("../lib/shiprocket");
        shiprocketTracking = await shiprocket.trackShipment(order.shiprocket.awb);

        // Write back latest status to order for admin visibility
        if (shiprocketTracking?.tracking_data?.shipment_status) {
          const latestStatus = shiprocketTracking.tracking_data.shipment_status;
          if (order.shiprocket.status !== latestStatus) {
            order.shiprocket.status = latestStatus;
            const mapped = shiprocket.mapShiprocketToOrderStatus(latestStatus);
            if (mapped && order.status !== mapped) {
              order.status = mapped;
            }
            await order.save();
          }
        }
      } catch {
        // ShipRocket tracking may fail silently
      }
    }

    res.send({
      order,
      tracking,
      deliveryBoy,
      shiprocketTracking,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Rate delivery boy (Customer)
 */
const rateDeliveryBoy = async (req, res) => {
  try {
    const { orderId, rating, review } = req.body;
    const customerId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    if (order.user.toString() !== customerId) {
      return res
        .status(403)
        .send({ message: "You can only rate your own orders!" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .send({ message: "You can only rate delivered orders!" });
    }

    if (order.deliveryRating?.rating) {
      return res
        .status(400)
        .send({ message: "You have already rated this delivery!" });
    }

    if (!order.deliveryBoy) {
      return res
        .status(400)
        .send({ message: "No delivery boy assigned to this order!" });
    }

    // Update order with rating
    order.deliveryRating = {
      rating,
      review,
      ratedAt: new Date(),
    };
    await order.save();

    // Update delivery boy rating
    const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy);
    if (deliveryBoy) {
      deliveryBoy.ratings.push({
        orderId,
        customerId,
        rating,
        review,
      });
      deliveryBoy.totalRatings += 1;

      // Calculate new average
      const totalRatingSum = deliveryBoy.ratings.reduce(
        (sum, r) => sum + r.rating,
        0,
      );
      deliveryBoy.averageRating = (
        totalRatingSum / deliveryBoy.totalRatings
      ).toFixed(1);

      await deliveryBoy.save();
    }

    res.send({
      message: "Thank you for your rating!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Get customer notifications
 */
const getCustomerNotifications = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page, limit, status } = req.query;

    const queryObject = { customerId };
    if (status) {
      queryObject.status = status;
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await CustomerNotification.countDocuments(queryObject);
    const unreadCount = await CustomerNotification.countDocuments({
      customerId,
      status: "unread",
    });

    const notifications = await CustomerNotification.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      notifications,
      totalDoc,
      unreadCount,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Mark customer notification as read
 */
const markNotificationRead = async (req, res) => {
  try {
    const customerId = req.user._id;

    await CustomerNotification.findOneAndUpdate(
      { _id: req.params.id, customerId },
      { $set: { status: "read" } },
    );

    const unreadCount = await CustomerNotification.countDocuments({
      customerId,
      status: "unread",
    });

    res.send({
      message: "Notification marked as read!",
      unreadCount,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Mark all customer notifications as read
 */
const markAllNotificationsRead = async (req, res) => {
  try {
    const customerId = req.user._id;

    await CustomerNotification.updateMany(
      { customerId, status: "unread" },
      { $set: { status: "read" } },
    );

    res.send({
      message: "All notifications marked as read!",
      unreadCount: 0,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  // Admin
  addDeliveryBoy,
  getAllDeliveryBoys,
  getDeliveryBoyById,
  updateDeliveryBoy,
  updateDeliveryBoyStatus,
  deleteDeliveryBoy,
  deleteManyDeliveryBoys,
  getDeliveryBoyOrders,
  assignDeliveryBoy,
  unassignDeliveryBoy,
  getDeliveryBoyDashboard,
  // Delivery Boy
  loginDeliveryBoy,
  getMyOrders,
  getCurrentOrder,
  updateTrackingStatus,
  updateLocation,
  getMyStats,
  updateAvailability,
  getMyProfile,
  updateMyProfile,
  // Shared
  getOrderTrackingHistory,
  // Customer
  trackOrder,
  rateDeliveryBoy,
  getCustomerNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
