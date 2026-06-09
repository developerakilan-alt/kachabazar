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

//add a order
router.post("/add", validateAddOrder, addOrder);

//add a guest order (no auth required)
router.post("/add/guest", addGuestOrder);

// create stripe payment intent
router.post(
  "/create-payment-intent",
  validatePaymentIntent,
  createPaymentIntent,
);

//add razorpay order
router.post("/add/razorpay", addRazorpayOrder);

//add a order by razorpay
router.post("/create/razorpay", createOrderByRazorPay);

//get all order by a user
router.get("/", getOrderCustomer);

//#send email invoice to customer
router.post(
  "/customer/invoice",
  emailVerificationLimit,
  sendEmailInvoiceToCustomer,
);

// Razorpay webhook (raw body needed, no express json)
router.post("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayWebhook);

//get a order by id
router.get("/:id", validateMongoId, getOrderById);

module.exports = router;
