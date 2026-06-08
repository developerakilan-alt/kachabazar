const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
notificationSchema.index({ status: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ orderId: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
