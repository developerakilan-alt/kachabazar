const express = require("express");
const router = express.Router();
const {
  trackOrder,
  rateDeliveryBoy,
  getCustomerNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controller/deliveryBoyController");

// ==================== CUSTOMER TRACKING & NOTIFICATION ROUTES ====================

// Track order by tracking ID (public - no auth needed)
router.get("/track/:trackingId", trackOrder);

// Rate delivery boy (auth needed - handled via isAuth in index.js)
router.post("/rate-delivery", rateDeliveryBoy);

// Get customer notifications
router.get("/notifications", getCustomerNotifications);

// Mark notification as read
router.put("/notifications/:id/read", markNotificationRead);

// Mark all notifications as read
router.put("/notifications/read-all", markAllNotificationsRead);

module.exports = router;
