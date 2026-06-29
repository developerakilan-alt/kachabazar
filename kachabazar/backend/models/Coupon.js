const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: Object,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    couponCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: true,
    },
    discountType: {
      type: Object,
      required: false,
    },
    minimumAmount: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
    textColor: {
      type: String,
      default: "#FFFFFF",
    },
    fontFamily: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
couponSchema.index({ couponCode: 1 }, { unique: true });
couponSchema.index({ status: 1 });
couponSchema.index({ endTime: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
