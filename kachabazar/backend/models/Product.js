const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    barcode: {
      type: String,
      required: false,
    },
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
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Array,
      required: false,
    },
    stock: {
      type: Number,
      required: false,
    },

    sales: {
      type: Number,
      required: false,
    },

    tag: [String],
    prices: {
      originalPrice: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: false,
      },
    },
    variants: [{}],
    isCombination: {
      type: Boolean,
      required: true,
    },
    average_rating: {
      type: Number,
      default: 0,
    },
    total_reviews: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "show",
      enum: ["show", "hide"],
    },

    seo: {
      meta_title: {
        type: Object,
        required: false,
      },
      meta_description: {
        type: Object,
        required: false,
      },
      meta_keywords: {
        type: [String],
        required: false,
      },
      og_image: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
productSchema.index({ status: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ category: 1 });
productSchema.index({ "prices.price": 1 });
productSchema.index({ sales: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "title.en": "text", "description.en": "text" });

// Virtual for checking if product is on sale
productSchema.virtual("isOnSale").get(function () {
  if (this.isCombination && this.variants?.length > 0) {
    return this.variants.some((v) => v.discount > 0);
  }
  return this.prices?.discount > 0;
});

// Method to check stock availability
productSchema.methods.isInStock = function () {
  return this.stock > 0;
};

// module.exports = productSchema;

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
