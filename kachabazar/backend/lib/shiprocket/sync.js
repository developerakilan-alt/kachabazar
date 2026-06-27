const Order = require("../../models/Order");
const shiprocket = require("./index");

const SYNC_INTERVAL = 30 * 60 * 1000;

const syncShiprocketStatuses = async () => {
  try {
    const orders = await Order.find({
      "shiprocket.awb": { $exists: true, $ne: "" },
      status: { $nin: ["delivered", "cancel", "refunded"] },
    }).select("_id shiprocket");

    if (orders.length === 0) return;

    let updated = 0;
    for (const order of orders) {
      try {
        const result = await shiprocket.trackShipment(order.shiprocket.awb);
        const latestStatus = result?.tracking_data?.shipment_status;
        if (latestStatus && order.shiprocket.status !== latestStatus) {
          order.shiprocket.status = latestStatus;
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
