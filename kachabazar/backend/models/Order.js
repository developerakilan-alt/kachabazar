const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{}], // <-- Use Mixed for nested objects
    user_info: {
      name: String,
      email: String,
      contact: String,
      address: String,
      city: String,
      country: String,
      zipCode: String,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },

    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    razorpay: {
      type: Object,
      required: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "captured", "failed", "refunded", "partial-refund"],
      default: "pending",
    },
    refundInfo: {
      razorpayRefundId: String,
      amount: Number,
      reason: String,
      initiatedBy: String,
      initiatedAt: Date,
      completedAt: Date,
      status: { type: String, enum: ["pending", "processed", "failed"] },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "out-for-delivery",
        "delivered",
        "cancel",
        "refund-processing",
        "refunded",
      ],
    },

    // ShipRocket integration fields
    shiprocket: {
      orderId: { type: String },
      shipmentId: { type: String },
      awb: { type: String },
      status: { type: String },
      labelUrl: { type: String },
      manifestUrl: { type: String },
    },

    // Delivery & Tracking Fields
    trackingId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: false,
    },
    deliveryRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes for enterprise-level query performance ──
orderSchema.index({ status: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ invoice: -1 }, { unique: true });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ updatedAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ status: 1, updatedAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ deliveryBoy: 1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
