const Order = require("../models/Order");
const OrderTracking = require("../models/OrderTracking");
const CustomerNotification = require("../models/CustomerNotification");
const shiprocket = require("../lib/shiprocket");
const {
  getTrackingStatusMessage,
  getNotificationType,
  getNotificationTitle,
} = require("../utils/tracking");
const { generateTrackingId } = require("../utils/tracking");

const createShiprocketOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).send({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });

    if (order.shiprocket?.orderId) {
      return res.status(400).send({ message: "Order already pushed to ShipRocket" });
    }

    const result = await shiprocket.createOrder(order);

    if (!order.trackingId) {
      order.trackingId = generateTrackingId();
    }

    order.shiprocket = {
      orderId: result.order_id,
      shipmentId: result.shipment_id,
      awb: result.awb || "",
      status: result.status || "NEW",
    };
    order.status = "processing";
    await order.save();

    const trackingStatus = "confirmed";
    const trackingMessage = getTrackingStatusMessage(trackingStatus);

    await OrderTracking.updateOne(
      { orderId: order._id },
      { $pull: { history: { status: trackingStatus } } },
    );
    await OrderTracking.findOneAndUpdate(
      { orderId: order._id },
      {
        $set: {
          trackingId: order.trackingId,
          status: trackingStatus,
          customerName: order.user_info?.name,
          customerPhone: order.user_info?.contact,
          deliveryAddress: order.user_info?.address,
        },
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

    await CustomerNotification.create({
      customerId: order.user,
      orderId: order._id,
      trackingId: order.trackingId,
      type: getNotificationType(trackingStatus),
      title: getNotificationTitle(trackingStatus),
      message: `Your order #${order.invoice} ${trackingMessage.toLowerCase()}. Track with ID: ${order.trackingId}`,
    });

    res.status(201).send({ success: true, shiprocket: order.shiprocket, raw: result });
  } catch (err) {
    console.error("ShipRocket create order error:", err.message);
    res.status(500).send({ message: err.message });
  }
};

const getShippingRates = async (req, res) => {
  try {
    const { deliveryPostcode, cod, weight } = req.query;
    if (!deliveryPostcode) {
      return res.status(400).send({ message: "deliveryPostcode is required" });
    }

    const storeSetting = require("../models/Setting");
    const setting = await storeSetting.findOne({ name: "storeSetting" });
    const pickupPostcode = setting?.setting?.shiprocket_pickup_pincode || process.env.SHIPROCKET_PICKUP_PINCODE || "600001";

    const result = await shiprocket.checkServiceability({
      pickupPostcode,
      deliveryPostcode,
      cod: cod === "true" || cod === "1",
      weight: Number(weight) || 0.5,
    });

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const trackShipmentByAWB = async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) return res.status(400).send({ message: "AWB is required" });

    const result = await shiprocket.trackShipment(awb);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getOrderShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).send({ message: "Order not found" });

    let tracking = null;
    if (order.shiprocket?.awb) {
      try {
        tracking = await shiprocket.trackShipment(order.shiprocket.awb);
      } catch {
        // ShipRocket tracking may fail silently
      }
    }

    res.send({
      shiprocket: order.shiprocket || null,
      tracking,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const refreshShiprocketStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).send({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });
    if (!order.shiprocket?.awb && !order.shiprocket?.orderId) {
      return res.status(400).send({ message: "Order has not been pushed to ShipRocket yet" });
    }

    const srStatus = await shiprocket.refreshOrderStatus(order);

    if (srStatus.updated || srStatus.awb !== order.shiprocket.awb) {
      order.shiprocket.status = srStatus.status || order.shiprocket.status;
      if (srStatus.awb) order.shiprocket.awb = srStatus.awb;
      if (srStatus.shipmentId) order.shiprocket.shipmentId = srStatus.shipmentId;
      const mappedOrderStatus = shiprocket.mapShiprocketToOrderStatus(order.shiprocket.status);
      if (mappedOrderStatus && order.status !== mappedOrderStatus) {
        order.status = mappedOrderStatus;
      }
      await order.save();
    }

    const mappedOrderStatus = shiprocket.mapShiprocketToOrderStatus(
      order.shiprocket.status
    );

    res.send({
      shiprocket: order.shiprocket,
      orderStatus: order.status,
      tracking: {
        status: order.shiprocket.status,
        currentStatus: srStatus.currentStatus,
        courierName: srStatus.courierName,
      },
      mappedOrderStatus,
    });
  } catch (err) {
    console.error("ShipRocket refresh status error:", err.message);
    res.status(500).send({ message: err.message });
  }
};

const customerRefreshStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).send({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });

    if (order.user?.toString() !== req.user._id?.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    if (!order.shiprocket?.awb && !order.shiprocket?.orderId) {
      return res.status(400).send({ message: "Order not pushed to ShipRocket yet" });
    }

    const srStatus = await shiprocket.refreshOrderStatus(order);

    if (srStatus.updated || srStatus.awb !== order.shiprocket.awb) {
      order.shiprocket.status = srStatus.status || order.shiprocket.status;
      if (srStatus.awb) order.shiprocket.awb = srStatus.awb;
      if (srStatus.shipmentId) order.shiprocket.shipmentId = srStatus.shipmentId;
      const mapped = shiprocket.mapShiprocketToOrderStatus(order.shiprocket.status);
      if (mapped && order.status !== mapped) {
        order.status = mapped;
      }
      await order.save();
    }

    res.send({
      shiprocket: order.shiprocket,
      orderStatus: order.status,
      tracking: {
        status: order.shiprocket.status,
        currentStatus: srStatus.currentStatus,
        courierName: srStatus.courierName,
      },
    });
  } catch (err) {
    console.error("Customer refresh error:", err.message);
    res.status(500).send({ message: err.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const token = req.headers["x-api-key"];
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    if (expectedToken && token !== expectedToken) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    const payload = req.body || {};

    const shiprocketOrderId = payload.order_id;
    const awb = payload.awb || payload.awb_code;
    const srStatus = payload.status || payload.shipment_status || payload.current_status;

    // Accept test/empty pings — ShipRocket validates connectivity
    if (!shiprocketOrderId && !awb) {
      return res.json({ received: true });
    }

    if (!srStatus) {
      return res.json({ received: true, warning: "No status in payload" });
    }

    const order = await Order.findOne({
      $or: [
        { "shiprocket.orderId": shiprocketOrderId },
        ...(awb ? [{ "shiprocket.awb": awb }] : []),
      ],
    });

    if (!order) {
      return res.json({ received: true, warning: "Order not found" });
    }

    const prevOrderStatus = order.status;
    const prevSrStatus = order.shiprocket?.status;

    if (!order.shiprocket) order.shiprocket = {};
    if (shiprocketOrderId) order.shiprocket.orderId = shiprocketOrderId;
    if (payload.shipment_id) order.shiprocket.shipmentId = payload.shipment_id;
    if (awb) order.shiprocket.awb = awb;
    order.shiprocket.status = srStatus;
    order.shiprocket.lastWebhookUpdate = new Date();
    order.markModified("shiprocket");

    const mappedOrderStatus = shiprocket.mapShiprocketToOrderStatus(srStatus);
    if (mappedOrderStatus && order.status !== mappedOrderStatus) {
      order.status = mappedOrderStatus;
    }
    await order.save();

    if (order.status !== prevOrderStatus || srStatus !== prevSrStatus) {
      const trackingStatus = shiprocket.mapShiprocketToTrackingStatus(srStatus);
      const trackingMsg = getTrackingStatusMessage(trackingStatus);

      if (trackingMsg !== "Order status updated") {
        await OrderTracking.updateOne(
          { orderId: order._id },
          { $pull: { history: { status: trackingStatus } } },
        );
        await OrderTracking.findOneAndUpdate(
          { orderId: order._id },
          {
            $push: {
              history: {
                status: trackingStatus,
                message: `ShipRocket: ${trackingMsg}`,
                updatedBy: "system",
                timestamp: new Date(),
              },
            },
            $set: {
              status: trackingStatus,
              trackingId: order.trackingId,
              customerName: order.user_info?.name,
              customerPhone: order.user_info?.contact,
              deliveryAddress: order.user_info?.address,
            },
          },
          { upsert: true },
        );

        if (order.user) {
          await CustomerNotification.create({
            customerId: order.user,
            orderId: order._id,
            trackingId: order.trackingId,
            type: getNotificationType(trackingStatus),
            title: getNotificationTitle(trackingStatus),
            message: `Your order #${order.invoice} ${trackingMsg.toLowerCase()}. Track with ID: ${order.trackingId}`,
          });
        }
      }
    }

    res.json({ received: true, orderId: shiprocketOrderId, status: srStatus, mappedStatus: order.status });
  } catch (err) {
    console.error("ShipRocket webhook error:", err.message);
    res.json({ received: true, error: err.message });
  }
};

const clearShiprocketData = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).send({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });

    order.shiprocket = undefined;
    await order.save();

    res.send({ success: true, message: "ShipRocket data cleared" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createShiprocketOrder,
  getShippingRates,
  trackShipmentByAWB,
  getOrderShippingStatus,
  refreshShiprocketStatus,
  customerRefreshStatus,
  clearShiprocketData,
  handleWebhook,
};
