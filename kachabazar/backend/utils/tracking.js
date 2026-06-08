const crypto = require("crypto");

/**
 * Generate a unique tracking ID for orders
 * Format: KB-YYYYMMDD-XXXXXX (e.g., KB-20260221-A3F8K2)
 */
const generateTrackingId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Generate 6 random alphanumeric characters (uppercase)
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .substring(0, 6)
    .toUpperCase();

  return `KB-${dateStr}-${randomPart}`;
};

/**
 * Get human-readable status message for tracking
 */
const getTrackingStatusMessage = (status) => {
  const messages = {
    "order-placed": "Your order has been placed successfully",
    confirmed: "Your order has been confirmed",
    preparing: "Your order is being prepared",
    "ready-for-pickup": "Your order is ready for pickup by delivery partner",
    "picked-up": "Your order has been picked up by delivery partner",
    "on-the-way": "Your order is on the way",
    nearby: "Your delivery partner is nearby",
    delivered: "Your order has been delivered successfully",
    cancelled: "Your order has been cancelled",
    returned: "Your order has been returned",
  };
  return messages[status] || "Order status updated";
};

/**
 * Get notification title for customer
 */
const getNotificationTitle = (status) => {
  const titles = {
    "order-placed": "Order Placed! 🎉",
    confirmed: "Order Confirmed ✅",
    preparing: "Preparing Your Order 🍳",
    "ready-for-pickup": "Ready for Pickup 📦",
    "picked-up": "Order Picked Up 🚀",
    "on-the-way": "On The Way! 🛵",
    nearby: "Almost There! 📍",
    delivered: "Delivered! 🎊",
    cancelled: "Order Cancelled ❌",
    returned: "Order Returned ↩️",
  };
  return titles[status] || "Order Update";
};

/**
 * Map tracking status to order status
 */
const mapTrackingToOrderStatus = (trackingStatus) => {
  const mapping = {
    "order-placed": "pending",
    confirmed: "processing",
    preparing: "processing",
    "ready-for-pickup": "processing",
    "picked-up": "out-for-delivery",
    "on-the-way": "out-for-delivery",
    nearby: "out-for-delivery",
    delivered: "delivered",
    cancelled: "cancel",
    returned: "cancel",
  };
  return mapping[trackingStatus] || "pending";
};

/**
 * Get notification type from tracking status
 */
const getNotificationType = (trackingStatus) => {
  const mapping = {
    "order-placed": "order-placed",
    confirmed: "order-confirmed",
    preparing: "order-preparing",
    "ready-for-pickup": "order-ready",
    "picked-up": "order-picked-up",
    "on-the-way": "order-on-the-way",
    nearby: "order-nearby",
    delivered: "order-delivered",
    cancelled: "order-cancelled",
    returned: "order-cancelled",
  };
  return mapping[trackingStatus] || "general";
};

module.exports = {
  generateTrackingId,
  getTrackingStatusMessage,
  getNotificationTitle,
  mapTrackingToOrderStatus,
  getNotificationType,
};
