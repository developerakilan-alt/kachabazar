const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  deleteManyOrders,
  updateManyOrders,
  getDashboardOrders,
  getDashboardRecentOrder,
  getBestSellerProductChart,
  getDashboardCount,
  getDashboardAmount,
  processRefund,
} = require("../controller/orderController");
const {
  validateMongoId,
  validateUpdateOrder,
  validateDeleteMany,
} = require("../middleware/validators");

//get all orders
router.get("/", getAllOrders);

// get dashboard orders data
router.get("/dashboard", getDashboardOrders);

// dashboard recent-order
router.get("/dashboard-recent-order", getDashboardRecentOrder);

// dashboard order count
router.get("/dashboard-count", getDashboardCount);

// dashboard order amount
router.get("/dashboard-amount", getDashboardAmount);

// chart data for product
router.get("/best-seller/chart", getBestSellerProductChart);

//delete many orders
router.patch("/delete/many", validateDeleteMany, deleteManyOrders);

//update many orders status
router.patch("/update/many", updateManyOrders);

//get all order by a user
router.get("/customer/:id", getOrderCustomer);

// Refund a Razorpay order (admin only)
router.post("/refund/:id", validateMongoId, processRefund);

//get a order by id
router.get("/:id", validateMongoId, getOrderById);

//update a order
router.put("/:id", validateUpdateOrder, updateOrder);

//delete a order
router.delete("/:id", deleteOrder);

module.exports = router;
