const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    setting: {},
  },
  {
    timestamps: true,
  },
);

// ── Indexes for query performance ──
settingSchema.index({ name: 1 }, { unique: true });

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
