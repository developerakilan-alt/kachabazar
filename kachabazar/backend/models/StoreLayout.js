const mongoose = require("mongoose");

const storeLayoutSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["show", "hide"],
      default: "show",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

storeLayoutSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false },
    );
  }
  next();
});

const StoreLayout = mongoose.model("StoreLayout", storeLayoutSchema);
module.exports = StoreLayout;
