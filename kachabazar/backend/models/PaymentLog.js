const mongoose = require("mongoose");

const paymentLogSchema = new mongoose.Schema(
  {
    gateway: {
      type: String,
      enum: ["razorpay", "stripe"],
      default: "razorpay",
    },
    event: {
      type: String,
      enum: [
        "order.created",
        "payment.captured",
        "payment.failed",
        "payment.refunded",
        "webhook.received",
        "webhook.ignored",
      ],
      required: true,
    },
    razorpayPaymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    invoice: { type: Number, default: null },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    customerEmail: { type: String, default: null },
    amount: { type: Number, default: null },
    currency: { type: String, default: "INR" },
    status: { type: String, default: null },
    errorMessage: { type: String, default: null },
    payload: { type: Object, default: null },
    rawResponse: { type: Object, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true },
);

paymentLogSchema.index({ razorpayPaymentId: 1 });
paymentLogSchema.index({ razorpayOrderId: 1 });
paymentLogSchema.index({ orderId: 1 });
paymentLogSchema.index({ event: 1, createdAt: -1 });
paymentLogSchema.index({ createdAt: -1 });

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);
module.exports = PaymentLog;
