const mongoose = require("mongoose");

const orderTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "order-placed",
        "confirmed",
        "preparing",
        "ready-for-pickup",
        "picked-up",
        "on-the-way",
        "nearby",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "order-placed",
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: false,
    },
    // Tracking history
    history: [
      {
        status: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        location: {
          lat: Number,
          lng: Number,
          address: String,
        },
        updatedBy: {
          type: String,
          enum: ["system", "admin", "delivery-boy"],
          default: "system",
        },
        updatedById: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "history.updatedByModel",
        },
        updatedByModel: {
          type: String,
          enum: ["Admin", "DeliveryBoy"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Estimated delivery
    estimatedDeliveryTime: {
      type: Date,
      required: false,
    },
    actualDeliveryTime: {
      type: Date,
      required: false,
    },
    // Delivery proof
    deliveryProof: {
      image: String,
      signature: String,
      note: String,
    },
    // Customer info for quick access
    customerName: String,
    customerPhone: String,
    deliveryAddress: String,
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
orderTrackingSchema.index({ orderId: 1 });
orderTrackingSchema.index({ deliveryBoy: 1 });
orderTrackingSchema.index({ status: 1 });

const OrderTracking = mongoose.model("OrderTracking", orderTrackingSchema);

module.exports = OrderTracking;
