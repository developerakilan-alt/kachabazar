// Color token helper
const ct = (key, hsl) => ({ key, hsl });

const themes = [
  {
    name: "Emerald Default",
    slug: "emerald-default",
    description:
      "The signature KachaBazar theme with a fresh emerald green accent",
    status: "show",
    isDefault: true,
    colors: {
      primary: {
        key: "emerald-600",
        hsl: "160.1 84.1% 39.4%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      secondaryForeground: {
        key: "slate-900",
        hsl: "222.2 47.4% 11.2%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      muted: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      mutedForeground: {
        key: "slate-500",
        hsl: "215.4 16.3% 46.9%",
      },
      accent: {
        key: "emerald-50",
        hsl: "151.8 81% 95.9%",
      },
      accentForeground: {
        key: "emerald-900",
        hsl: "161.4 93.5% 15.3%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      input: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      ring: {
        key: "emerald-600",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
    },
    darkColors: {
      primary: {
        key: "emerald-500",
        hsl: "160.1 84.1% 39.4%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "emerald-500",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.6",
    },
    sizing: {
      radius: "0.5rem",
      radiusSm: "0.25rem",
      radiusMd: "0.375rem",
      radiusLg: "0.5rem",
      radiusXl: "0.75rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "slate-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "slate-700",
        hsl: "240 5.3% 26.1%",
      },
      activeColor: {
        key: "emerald-500",
        hsl: "160.1 84.1% 39.4%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "slate-800",
        hsl: "217.2 32.6% 17.5%",
      },
    },
  },
  {
    name: "Ocean Blue",
    slug: "ocean-blue",
    description:
      "A professional blue palette with crisp lines and clear contrast",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "blue-600",
        hsl: "221.2 83.2% 53.3%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "blue-50",
        hsl: "213.8 100% 96.9%",
      },
      secondaryForeground: {
        key: "blue-900",
        hsl: "224.4 64.3% 32.9%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      muted: {
        key: "gray-100",
        hsl: "220 14.3% 95.9%",
      },
      mutedForeground: {
        key: "gray-500",
        hsl: "220 8.9% 46.1%",
      },
      accent: {
        key: "blue-50",
        hsl: "213.8 100% 96.9%",
      },
      accentForeground: {
        key: "blue-700",
        hsl: "224.3 76.3% 48%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "gray-200",
        hsl: "220 13% 91%",
      },
      input: {
        key: "gray-200",
        hsl: "220 13% 91%",
      },
      ring: {
        key: "blue-600",
        hsl: "221.2 83.2% 53.3%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
    },
    darkColors: {
      primary: {
        key: "blue-500",
        hsl: "217.2 91.2% 59.8%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "blue-500",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.5",
    },
    sizing: {
      radius: "0.625rem",
      radiusSm: "0.3125rem",
      radiusMd: "0.4375rem",
      radiusLg: "0.625rem",
      radiusXl: "0.875rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "gray-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "gray-700",
        hsl: "220 8.9% 26.1%",
      },
      activeColor: {
        key: "blue-500",
        hsl: "217.2 91.2% 59.8%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "gray-800",
        hsl: "215 20% 15%",
      },
    },
  },
  {
    name: "Sunset Amber",
    slug: "sunset-amber",
    description: "Warm amber and orange tones that feel friendly and energetic",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "amber-600",
        hsl: "32.1 94.6% 43.7%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "orange-50",
        hsl: "33.3 100% 96.5%",
      },
      secondaryForeground: {
        key: "orange-900",
        hsl: "15.3 74.6% 27.8%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "neutral-950",
        hsl: "0 0% 3.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "neutral-950",
        hsl: "0 0% 3.9%",
      },
      muted: {
        key: "neutral-100",
        hsl: "0 0% 96.1%",
      },
      mutedForeground: {
        key: "neutral-500",
        hsl: "0 0% 45.1%",
      },
      accent: {
        key: "amber-50",
        hsl: "48 100% 96.1%",
      },
      accentForeground: {
        key: "amber-900",
        hsl: "21.7 77.8% 26.5%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "neutral-200",
        hsl: "0 0% 89.8%",
      },
      input: {
        key: "neutral-200",
        hsl: "0 0% 89.8%",
      },
      ring: {
        key: "amber-600",
        hsl: "32.1 94.6% 43.7%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "neutral-950",
        hsl: "0 0% 3.9%",
      },
    },
    darkColors: {
      primary: {
        key: "amber-500",
        hsl: "37.7 92.1% 50.2%",
      },
      primaryForeground: {
        key: "neutral-950",
        hsl: "0 0% 3.9%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "amber-500",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'DM Sans', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.6",
    },
    sizing: {
      radius: "0.75rem",
      radiusSm: "0.375rem",
      radiusMd: "0.5rem",
      radiusLg: "0.75rem",
      radiusXl: "1rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "neutral-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "neutral-700",
        hsl: "0 0% 26.1%",
      },
      activeColor: {
        key: "amber-500",
        hsl: "37.7 92.1% 50.2%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "neutral-900",
        hsl: "0 0% 9%",
      },
    },
  },
  {
    name: "Royal Violet",
    slug: "royal-violet",
    description:
      "A luxurious purple palette that conveys elegance and creativity",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "violet-600",
        hsl: "262.1 83.3% 57.8%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "violet-50",
        hsl: "270 100% 98%",
      },
      secondaryForeground: {
        key: "violet-900",
        hsl: "263.5 45.2% 24.5%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
      muted: {
        key: "zinc-100",
        hsl: "240 4.8% 95.9%",
      },
      mutedForeground: {
        key: "zinc-500",
        hsl: "240 3.8% 46.1%",
      },
      accent: {
        key: "violet-50",
        hsl: "270 100% 98%",
      },
      accentForeground: {
        key: "violet-700",
        hsl: "263.4 70% 50.4%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "zinc-200",
        hsl: "240 5.9% 90%",
      },
      input: {
        key: "zinc-200",
        hsl: "240 5.9% 90%",
      },
      ring: {
        key: "violet-600",
        hsl: "262.1 83.3% 57.8%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
    },
    darkColors: {
      primary: {
        key: "violet-500",
        hsl: "258.3 89.5% 66.3%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "violet-500",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Outfit', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "600",
      lineHeight: "1.5",
    },
    sizing: {
      radius: "0.625rem",
      radiusSm: "0.3125rem",
      radiusMd: "0.4375rem",
      radiusLg: "0.625rem",
      radiusXl: "0.875rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "zinc-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "zinc-700",
        hsl: "240 3.8% 26.1%",
      },
      activeColor: {
        key: "violet-500",
        hsl: "258.3 89.5% 66.3%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "zinc-800",
        hsl: "240 3.7% 15.9%",
      },
    },
  },
  {
    name: "Rose Petal",
    slug: "rose-petal",
    description: "A soft, warm pink palette that feels modern and inviting",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "rose-500",
        hsl: "349.7 89.2% 60.2%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "rose-50",
        hsl: "355.7 100% 97.3%",
      },
      secondaryForeground: {
        key: "rose-900",
        hsl: "343.1 79.7% 22.7%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      muted: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      mutedForeground: {
        key: "slate-500",
        hsl: "215.4 16.3% 46.9%",
      },
      accent: {
        key: "rose-50",
        hsl: "355.7 100% 97.3%",
      },
      accentForeground: {
        key: "rose-700",
        hsl: "345.3 82.7% 40.8%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      input: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      ring: {
        key: "rose-500",
        hsl: "349.7 89.2% 60.2%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
    },
    darkColors: {
      primary: {
        key: "rose-400",
        hsl: "351.3 94.5% 71.4%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "rose-400",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Nunito Sans', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "600",
      fontWeightBold: "700",
      lineHeight: "1.6",
    },
    sizing: {
      radius: "0.75rem",
      radiusSm: "0.375rem",
      radiusMd: "0.5rem",
      radiusLg: "0.75rem",
      radiusXl: "1rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "slate-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "slate-700",
        hsl: "240 5.3% 26.1%",
      },
      activeColor: {
        key: "rose-400",
        hsl: "351.3 94.5% 71.4%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "slate-800",
        hsl: "217.2 32.6% 17.5%",
      },
    },
  },
  {
    name: "Teal Breeze",
    slug: "teal-breeze",
    description: "A refreshing teal palette inspired by nature and clarity",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "teal-600",
        hsl: "175.3 77.4% 26.1%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "teal-50",
        hsl: "166.2 76.5% 96.7%",
      },
      secondaryForeground: {
        key: "teal-900",
        hsl: "175.9 60.8% 19%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      muted: {
        key: "gray-100",
        hsl: "220 14.3% 95.9%",
      },
      mutedForeground: {
        key: "gray-500",
        hsl: "220 8.9% 46.1%",
      },
      accent: {
        key: "teal-50",
        hsl: "166.2 76.5% 96.7%",
      },
      accentForeground: {
        key: "teal-700",
        hsl: "175.3 77.4% 26.1%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "gray-200",
        hsl: "220 13% 91%",
      },
      input: {
        key: "gray-200",
        hsl: "220 13% 91%",
      },
      ring: {
        key: "teal-600",
        hsl: "175.3 77.4% 26.1%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
    },
    darkColors: {
      primary: {
        key: "teal-400",
        hsl: "170.6 76.9% 64.3%",
      },
      primaryForeground: {
        key: "teal-950",
        hsl: "176.1 69.2% 7.3%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "teal-400",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Source Sans 3', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.5",
    },
    sizing: {
      radius: "0.5rem",
      radiusSm: "0.25rem",
      radiusMd: "0.375rem",
      radiusLg: "0.5rem",
      radiusXl: "0.75rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "gray-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "gray-700",
        hsl: "220 8.9% 26.1%",
      },
      activeColor: {
        key: "teal-400",
        hsl: "170.6 76.9% 64.3%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "gray-800",
        hsl: "215 20% 15%",
      },
    },
  },
  {
    name: "Slate Minimal",
    slug: "slate-minimal",
    description:
      "A sleek monochrome theme for a minimal, distraction-free experience",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "slate-900",
        hsl: "222.2 47.4% 11.2%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      secondaryForeground: {
        key: "slate-900",
        hsl: "222.2 47.4% 11.2%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
      muted: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      mutedForeground: {
        key: "slate-500",
        hsl: "215.4 16.3% 46.9%",
      },
      accent: {
        key: "slate-100",
        hsl: "210 40% 96.1%",
      },
      accentForeground: {
        key: "slate-900",
        hsl: "222.2 47.4% 11.2%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      input: {
        key: "slate-200",
        hsl: "214.3 31.8% 91.4%",
      },
      ring: {
        key: "slate-900",
        hsl: "222.2 47.4% 11.2%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "slate-950",
        hsl: "222.2 84% 4.9%",
      },
    },
    darkColors: {
      primary: {
        key: "slate-500",
        hsl: "215.4 16.3% 46.9%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "slate-300",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Geist', Inter, system-ui, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "600",
      lineHeight: "1.5",
    },
    sizing: {
      radius: "0.375rem",
      radiusSm: "0.25rem",
      radiusMd: "0.375rem",
      radiusLg: "0.5rem",
      radiusXl: "0.625rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "slate-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "slate-700",
        hsl: "240 5.3% 26.1%",
      },
      activeColor: {
        key: "dark-card",
        hsl: "220 17% 10%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "dark-card",
        hsl: "220 17% 10%",
      },
    },
  },
  {
    name: "Indigo Night",
    slug: "indigo-night",
    description:
      "A deep, focused indigo palette for power users who prefer contrast",
    status: "show",
    isDefault: false,
    colors: {
      primary: {
        key: "indigo-600",
        hsl: "238.7 83.5% 66.7%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "indigo-50",
        hsl: "225.9 100% 96.7%",
      },
      secondaryForeground: {
        key: "indigo-900",
        hsl: "243.7 47.1% 20%",
      },
      background: {
        key: "white",
        hsl: "0 0% 100%",
      },
      foreground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
      card: {
        key: "white",
        hsl: "0 0% 100%",
      },
      cardForeground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
      muted: {
        key: "zinc-100",
        hsl: "240 4.8% 95.9%",
      },
      mutedForeground: {
        key: "zinc-500",
        hsl: "240 3.8% 46.1%",
      },
      accent: {
        key: "indigo-50",
        hsl: "225.9 100% 96.7%",
      },
      accentForeground: {
        key: "indigo-700",
        hsl: "243.8 54.5% 41.4%",
      },
      destructive: {
        key: "red-500",
        hsl: "0 84.2% 60.2%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      border: {
        key: "zinc-200",
        hsl: "240 5.9% 90%",
      },
      input: {
        key: "zinc-200",
        hsl: "240 5.9% 90%",
      },
      ring: {
        key: "indigo-600",
        hsl: "238.7 83.5% 66.7%",
      },
      popover: {
        key: "white",
        hsl: "0 0% 100%",
      },
      popoverForeground: {
        key: "zinc-950",
        hsl: "240 10% 3.9%",
      },
    },
    darkColors: {
      primary: {
        key: "indigo-400",
        hsl: "234.5 89.5% 73.9%",
      },
      primaryForeground: {
        key: "white",
        hsl: "0 0% 100%",
      },
      secondary: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      secondaryForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      background: {
        key: "dark-bg",
        hsl: "222 47% 11%",
      },
      foreground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      card: {
        key: "dark-card",
        hsl: "217 33% 17%",
      },
      cardForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      muted: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      mutedForeground: {
        key: "gray-400",
        hsl: "215 20% 55%",
      },
      accent: {
        key: "dark-muted",
        hsl: "217 28% 25%",
      },
      accentForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
      destructive: {
        key: "red-600",
        hsl: "0 62.8% 60.6%",
      },
      destructiveForeground: {
        key: "white",
        hsl: "218 15% 85%",
      },
      border: {
        key: "dark-border",
        hsl: "217 25% 23%",
      },
      input: {
        key: "dark-input",
        hsl: "217 25% 27%",
      },
      ring: {
        key: "indigo-400",
        hsl: "160.1 84.1% 39.4%",
      },
      popover: {
        key: "dark-bg",
        hsl: "217 33% 17%",
      },
      popoverForeground: {
        key: "gray-50",
        hsl: "218 15% 85%",
      },
    },
    typography: {
      fontFamily: "'Space Grotesk', Inter, sans-serif",
      fontSizeBase: "14px",
      fontSizeSm: "12px",
      fontSizeLg: "16px",
      fontSizeXl: "20px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.5",
    },
    sizing: {
      radius: "0.5rem",
      radiusSm: "0.25rem",
      radiusMd: "0.375rem",
      radiusLg: "0.5rem",
      radiusXl: "0.75rem",
    },
    borders: {
      borderWidth: "1px",
      borderStyle: "solid",
    },
    sidebar: {
      width: "256px",
      bgColor: {
        key: "zinc-50",
        hsl: "0 0% 98%",
      },
      textColor: {
        key: "zinc-700",
        hsl: "240 3.8% 26.1%",
      },
      activeColor: {
        key: "indigo-400",
        hsl: "234.5 89.5% 73.9%",
      },
    },
    header: {
      height: "64px",
      bgColor: {
        key: "white",
        hsl: "0 0% 100%",
      },
      textColor: {
        key: "zinc-800",
        hsl: "240 3.7% 15.9%",
      },
    },
  },
];

module.exports = themes;
