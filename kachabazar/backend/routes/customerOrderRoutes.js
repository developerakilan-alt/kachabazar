const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  addOrder,
  addGuestOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  addRazorpayOrder,
  createOrderByRazorPay,
  sendEmailInvoiceToCustomer,
  razorpayWebhook,
} = require("../controller/customerOrderController");

const { emailVerificationLimit } = require("../lib/email-sender/sender");
const {
  validateAddOrder,
  validateMongoId,
  validatePaymentIntent,
} = require("../middleware/validators");

// Public routes (no auth required)
const { validateGuestOrder } = require("../middleware/validators");
router.post("/add/guest", validateGuestOrder, addGuestOrder);
router.post("/add/razorpay", addRazorpayOrder);
router.post("/create/razorpay", (req, res, next) => {
  console.log("HIT create/razorpay PUBLIC ROUTE");
  createOrderByRazorPay(req, res, next);
});

// Authenticated routes
router.post("/add", isAuth, validateAddOrder, addOrder);
router.post("/create-payment-intent", isAuth, validatePaymentIntent, createPaymentIntent);
router.get("/", isAuth, getOrderCustomer);
router.post("/customer/invoice", isAuth, emailVerificationLimit, sendEmailInvoiceToCustomer);
router.get("/:id", isAuth, validateMongoId, getOrderById);

// Razorpay webhook (raw body needed, no express json)
router.post("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayWebhook);

module.exports = router;
