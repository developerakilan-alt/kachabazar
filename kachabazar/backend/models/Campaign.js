const mongoose = require("mongoose");

const campaignProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    campaignPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "fixed",
    },
    discountValue: {
      type: Number,
      required: true,
    },
    stockLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

// Virtual: remaining stock
campaignProductSchema.virtual("remainingStock").get(function () {
  return Math.max(0, this.stockLimit - this.soldCount);
});

// Virtual: sold percentage
campaignProductSchema.virtual("soldPercentage").get(function () {
  if (this.stockLimit === 0) return 100;
  return Math.min(100, Math.round((this.soldCount / this.stockLimit) * 100));
});

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    banner: {
      type: String,
      required: false,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    showSection: {
      type: String,
      enum: ["home_top", "home_middle", "home_bottom", "sidebar", "none"],
      default: "home_middle",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    products: [campaignProductSchema],
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: campaign live status
campaignSchema.virtual("campaignStatus").get(function () {
  const now = new Date();
  if (now < this.startTime) return "upcoming";
  if (now > this.endTime) return "expired";
  return "active";
});

// Virtual: active products count
campaignSchema.virtual("activeProductsCount").get(function () {
  return this.products
    ? this.products.filter((p) => p.isActive && p.soldCount < p.stockLimit)
        .length
    : 0;
});

// Indexes
campaignSchema.index({ status: 1 });
campaignSchema.index({ startTime: 1, endTime: 1 });
campaignSchema.index({ isFeatured: 1, status: 1 });
campaignSchema.index({ "products.product": 1 });
campaignSchema.index({ showSection: 1, status: 1 });

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
