const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
      default: bcrypt.hashSync("12345678"),
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "bicycle", "car", "van", "scooter", "other"],
      default: "bike",
    },
    vehicleNumber: {
      type: String,
      required: false,
    },
    licenseNumber: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      lowercase: true,
    },
    availability: {
      type: String,
      enum: ["available", "on-delivery", "offline"],
      default: "available",
    },
    // Stats
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    cancelledDeliveries: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    // Rating
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Current location (for live tracking)
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      updatedAt: { type: Date, default: Date.now },
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

module.exports = DeliveryBoy;
