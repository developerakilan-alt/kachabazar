const express = require("express");
const router = express.Router();
const {
  // Admin operations
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
  loginDeliveryBoy,
  getOrderTrackingHistory,
} = require("../controller/deliveryBoyController");

// ==================== PUBLIC ROUTES ====================

// Delivery boy login
router.post("/login", loginDeliveryBoy);

// ==================== ADMIN ROUTES ====================

// Dashboard stats
router.get("/dashboard", getDeliveryBoyDashboard);

// Assign delivery boy to order
router.post("/assign", assignDeliveryBoy);

// Unassign delivery boy from order
router.post("/unassign", unassignDeliveryBoy);

// Get order tracking history
router.get("/tracking-history/:id", getOrderTrackingHistory);

// Delete many delivery boys
router.patch("/delete/many", deleteManyDeliveryBoys);

// Get all delivery boys
router.get("/", getAllDeliveryBoys);

// Add a delivery boy
router.post("/add", addDeliveryBoy);

// Get orders for a delivery boy
router.get("/:id/orders", getDeliveryBoyOrders);

// Get a delivery boy by ID
router.get("/:id", getDeliveryBoyById);

// Update a delivery boy
router.put("/:id", updateDeliveryBoy);

// Update delivery boy status
router.put("/update-status/:id", updateDeliveryBoyStatus);

// Delete a delivery boy
router.delete("/:id", deleteDeliveryBoy);

module.exports = router;
