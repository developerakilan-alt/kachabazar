const Order = require("../../models/Order");
const shiprocket = require("./index");

const SYNC_INTERVAL = 30 * 60 * 1000;

const syncShiprocketStatuses = async () => {
  try {
    const orders = await Order.find({
      $or: [
        { "shiprocket.awb": { $exists: true, $ne: "" } },
        { "shiprocket.orderId": { $exists: true, $ne: "" } },
      ],
      status: { $nin: ["delivered", "cancel", "refunded"] },
    }).select("_id shiprocket status");

    if (orders.length === 0) return;

    let updated = 0;
    for (const order of orders) {
      try {
        const result = await shiprocket.refreshOrderStatus(order);
        if (result.updated || result.awb !== order.shiprocket.awb) {
          order.shiprocket.status = result.status || order.shiprocket.status;
          if (result.awb) order.shiprocket.awb = result.awb;
          if (result.shipmentId) order.shiprocket.shipmentId = result.shipmentId;
          const mapped = shiprocket.mapShiprocketToOrderStatus(order.shiprocket.status);
          if (mapped && order.status !== mapped) {
            order.status = mapped;
          }
          await order.save();
          updated++;
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
