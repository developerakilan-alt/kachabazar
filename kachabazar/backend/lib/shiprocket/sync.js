const Order = require("../../models/Order");
const OrderTracking = require("../../models/OrderTracking");
const CustomerNotification = require("../../models/CustomerNotification");
const shiprocket = require("./index");
const {
  getTrackingStatusMessage,
  getNotificationType,
  getNotificationTitle,
} = require("../../utils/tracking");

const SYNC_INTERVAL = 5 * 60 * 1000;

const syncShiprocketStatuses = async () => {
  try {
    const orders = await Order.find({
      $or: [
        { "shiprocket.awb": { $exists: true, $ne: "" } },
        { "shiprocket.orderId": { $exists: true, $ne: "" } },
      ],
      status: { $nin: ["delivered", "cancel", "refunded"] },
    }).select("_id shiprocket status trackingId user invoice");

    if (orders.length === 0) return;

    let updated = 0;
    for (const order of orders) {
      try {
        const result = await shiprocket.refreshOrderStatus(order);
        if (result.updated || result.awb !== order.shiprocket.awb) {
          const prevStatus = order.shiprocket.status;
          order.shiprocket.status = result.status || order.shiprocket.status;
          if (result.awb) order.shiprocket.awb = result.awb;
          if (result.shipmentId) order.shiprocket.shipmentId = result.shipmentId;
          const mapped = shiprocket.mapShiprocketToOrderStatus(order.shiprocket.status);
          if (mapped && order.status !== mapped) {
            order.status = mapped;
          }
          await order.save();
          updated++;

          const trackingStatus = shiprocket.mapShiprocketToTrackingStatus(order.shiprocket.status);
          const trackingMsg = getTrackingStatusMessage(trackingStatus);

          if (trackingMsg !== "Order status updated") {
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
                $set: { status: trackingStatus },
              },
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
      } catch {
        // Individual tracking failures are non-fatal
      }
    }
  } catch (err) {
    console.error("Shiprocket sync error:", err.message);
  }
};

let intervalHandle = null;

const startSync = () => {
  if (intervalHandle) return;
  intervalHandle = setInterval(syncShiprocketStatuses, SYNC_INTERVAL);
  syncShiprocketStatuses();
};

const stopSync = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
};

module.exports = { startSync, stopSync };
