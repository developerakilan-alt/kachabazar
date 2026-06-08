const mongoose = require("mongoose");

const customerNotificationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    trackingId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: [
        "order-placed",
        "order-confirmed",
        "order-preparing",
        "order-ready",
        "order-picked-up",
        "order-on-the-way",
        "order-nearby",
        "order-delivered",
        "order-cancelled",
        "delivery-assigned",
        "delivery-unassigned",
        "rating-request",
        "general",
      ],
      default: "general",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    metadata: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
customerNotificationSchema.index({ customerId: 1, status: 1 });
customerNotificationSchema.index({ customerId: 1, createdAt: -1 });
customerNotificationSchema.index({ orderId: 1 });

const CustomerNotification = mongoose.model(
  "CustomerNotification",
  customerNotificationSchema,
);

module.exports = CustomerNotification;
