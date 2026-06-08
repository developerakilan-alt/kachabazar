const mongoose = require("mongoose");

// Each color token stores both the Tailwind key (e.g. "emerald-500")
// and the resolved HSL value (e.g. "160.1 84.1% 39.4%")
const colorTokenSchema = {
  key: { type: String, default: "" }, // Tailwind color key
  hsl: { type: String, default: "" }, // Resolved HSL value
};

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
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

    // Light mode color tokens (Tailwind key + HSL)
    colors: {
      primary: {
        type: colorTokenSchema,
        default: { key: "emerald-500", hsl: "160.1 84.1% 39.4%" },
      },
      primaryForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      secondary: {
        type: colorTokenSchema,
        default: { key: "slate-100", hsl: "210 40% 96.1%" },
      },
      secondaryForeground: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "222.2 84% 4.9%" },
      },
      background: {
        type: colorTokenSchema,
        default: { key: "white", hsl: "0 0% 100%" },
      },
      foreground: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "222.2 84% 4.9%" },
      },
      card: {
        type: colorTokenSchema,
        default: { key: "white", hsl: "0 0% 100%" },
      },
      cardForeground: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "222.2 84% 4.9%" },
      },
      muted: {
        type: colorTokenSchema,
        default: { key: "slate-100", hsl: "210 40% 96.1%" },
      },
      mutedForeground: {
        type: colorTokenSchema,
        default: { key: "slate-500", hsl: "215.4 16.3% 46.9%" },
      },
      accent: {
        type: colorTokenSchema,
        default: { key: "slate-100", hsl: "210 40% 96.1%" },
      },
      accentForeground: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "222.2 84% 4.9%" },
      },
      destructive: {
        type: colorTokenSchema,
        default: { key: "red-500", hsl: "0 84.2% 60.2%" },
      },
      destructiveForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      border: {
        type: colorTokenSchema,
        default: { key: "slate-200", hsl: "214.3 31.8% 91.4%" },
      },
      input: {
        type: colorTokenSchema,
        default: { key: "slate-200", hsl: "214.3 31.8% 91.4%" },
      },
      ring: {
        type: colorTokenSchema,
        default: { key: "emerald-500", hsl: "160.1 84.1% 39.4%" },
      },
      popover: {
        type: colorTokenSchema,
        default: { key: "white", hsl: "0 0% 100%" },
      },
      popoverForeground: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "222.2 84% 4.9%" },
      },
    },

    // Dark mode color tokens (defaults match market-nest oklch→HSL)
    darkColors: {
      primary: {
        type: colorTokenSchema,
        default: { key: "emerald-500", hsl: "160.1 84.1% 39.4%" },
      },
      primaryForeground: {
        type: colorTokenSchema,
        default: { key: "white", hsl: "0 0% 100%" },
      },
      secondary: {
        type: colorTokenSchema,
        default: { key: "slate-700", hsl: "218 35% 18%" },
      },
      secondaryForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      background: {
        type: colorTokenSchema,
        default: { key: "slate-950", hsl: "228 87% 5%" },
      },
      foreground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      card: {
        type: colorTokenSchema,
        default: { key: "slate-900", hsl: "225 87% 6%" },
      },
      cardForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      muted: {
        type: colorTokenSchema,
        default: { key: "slate-700", hsl: "218 35% 18%" },
      },
      mutedForeground: {
        type: colorTokenSchema,
        default: { key: "slate-400", hsl: "214 23% 65%" },
      },
      accent: {
        type: colorTokenSchema,
        default: { key: "slate-700", hsl: "218 35% 18%" },
      },
      accentForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      destructive: {
        type: colorTokenSchema,
        default: { key: "red-400", hsl: "359 100% 70%" },
      },
      destructiveForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
      border: {
        type: colorTokenSchema,
        default: { key: "dark-border", hsl: "228 27% 15%" },
      },
      input: {
        type: colorTokenSchema,
        default: { key: "dark-input", hsl: "231 19% 20%" },
      },
      ring: {
        type: colorTokenSchema,
        default: { key: "slate-600", hsl: "220 10% 46%" },
      },
      popover: {
        type: colorTokenSchema,
        default: { key: "slate-800", hsl: "224 50% 11%" },
      },
      popoverForeground: {
        type: colorTokenSchema,
        default: { key: "slate-50", hsl: "210 40% 98%" },
      },
    },

    // Typography (all stored as select values)
    typography: {
      fontFamily: { type: String, default: "Inter, sans-serif" },
      fontSizeBase: { type: String, default: "14px" },
      fontSizeSm: { type: String, default: "12px" },
      fontSizeLg: { type: String, default: "16px" },
      fontSizeXl: { type: String, default: "20px" },
      fontWeightNormal: { type: String, default: "400" },
      fontWeightMedium: { type: String, default: "500" },
      fontWeightBold: { type: String, default: "700" },
      lineHeight: { type: String, default: "1.5" },
    },

    // Border radius
    sizing: {
      radius: { type: String, default: "0.5rem" },
      radiusSm: { type: String, default: "0.25rem" },
      radiusMd: { type: String, default: "0.375rem" },
      radiusLg: { type: String, default: "0.5rem" },
      radiusXl: { type: String, default: "0.75rem" },
    },

    // Borders
    borders: {
      borderWidth: { type: String, default: "1px" },
      borderStyle: { type: String, default: "solid" },
    },

    // Sidebar layout
    sidebar: {
      width: { type: String, default: "256px" },
      bgColor: {
        type: colorTokenSchema,
        default: { key: "gray-800", hsl: "215 27.9% 16.9%" },
      },
      textColor: {
        type: colorTokenSchema,
        default: { key: "gray-200", hsl: "220 13% 91%" },
      },
      activeColor: {
        type: colorTokenSchema,
        default: { key: "emerald-500", hsl: "160.1 84.1% 39.4%" },
      },
    },

    // Header layout
    header: {
      height: { type: String, default: "64px" },
      bgColor: {
        type: colorTokenSchema,
        default: { key: "white", hsl: "0 0% 100%" },
      },
      textColor: {
        type: colorTokenSchema,
        default: { key: "gray-800", hsl: "215 27.9% 16.9%" },
      },
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save: ensure only one default theme
themeSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false },
    );
  }
  next();
});

const Theme = mongoose.model("Theme", themeSchema);
module.exports = Theme;
