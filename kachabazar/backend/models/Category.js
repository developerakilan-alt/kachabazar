const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    parentId: {
      type: String,
      required: false,
    },
    parentName: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
categorySchema.index({ status: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

// module.exports = categorySchema;

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
