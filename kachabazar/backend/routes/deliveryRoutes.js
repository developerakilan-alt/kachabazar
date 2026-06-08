const express = require("express");
const router = express.Router();
const {
  // Delivery Boy self-service operations
  loginDeliveryBoy,
  getMyOrders,
  getCurrentOrder,
  updateTrackingStatus,
  updateLocation,
  getMyStats,
  updateAvailability,
  getOrderTrackingHistory,
  getMyProfile,
  updateMyProfile,
} = require("../controller/deliveryBoyController");
const { isAuth } = require("../config/auth");

// ==================== DELIVERY BOY SELF-SERVICE ROUTES ====================

// Login (no auth needed)
router.post("/login", loginDeliveryBoy);

// Protected routes (need auth)
// Get my assigned orders
router.get("/my-orders", isAuth, getMyOrders);

// Get current active order
router.get("/current-order", isAuth, getCurrentOrder);

// Get my stats & dashboard
router.get("/my-stats", isAuth, getMyStats);

// Update tracking status for an order
router.put("/update-tracking/:id", isAuth, updateTrackingStatus);

// Update my location
router.put("/update-location", isAuth, updateLocation);

// Update my availability
router.put("/update-availability", isAuth, updateAvailability);

// Get my profile
router.get("/my-profile", isAuth, getMyProfile);

// Update my profile (limited fields)
router.put("/update-profile", isAuth, updateMyProfile);

// Get order tracking history
router.get("/tracking-history/:id", isAuth, getOrderTrackingHistory);

module.exports = router;
