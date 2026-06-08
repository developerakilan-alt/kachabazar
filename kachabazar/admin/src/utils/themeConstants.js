/**
 * Theme Constants — Tailwind CSS Color Palette & Predefined Options
 *
 * All dropdown/select options for the Theme drawer.
 * Colors use Tailwind's official color palette with HSL values
 * for CSS custom property injection.
 */

// ─── Tailwind Color Palette ────────────────────────────────────────────
// Each color has shades 50–950 with their HSL values.
// Format: { name, label, hex, hsl }

export const TAILWIND_COLORS = {
  slate: {
    50: { hex: "#f8fafc", hsl: "210 40% 98%" },
    100: { hex: "#f1f5f9", hsl: "210 40% 96.1%" },
    200: { hex: "#e2e8f0", hsl: "214.3 31.8% 91.4%" },
    300: { hex: "#cbd5e1", hsl: "212.7 26.8% 83.9%" },
    400: { hex: "#94a3b8", hsl: "215 20.2% 65.1%" },
    500: { hex: "#64748b", hsl: "215.4 16.3% 46.9%" },
    600: { hex: "#475569", hsl: "215.3 19.3% 34.5%" },
    700: { hex: "#334155", hsl: "215.3 25% 26.7%" },
    800: { hex: "#1e293b", hsl: "217.2 32.6% 17.5%" },
    900: { hex: "#0f172a", hsl: "222.2 47.4% 11.2%" },
    950: { hex: "#020617", hsl: "222.2 84% 4.9%" },
  },
  gray: {
    50: { hex: "#f9fafb", hsl: "210 20% 98%" },
    100: { hex: "#f3f4f6", hsl: "220 14.3% 95.9%" },
    200: { hex: "#e5e7eb", hsl: "220 13% 91%" },
    300: { hex: "#d1d5db", hsl: "216 12.2% 83.9%" },
    400: { hex: "#9ca3af", hsl: "217.9 10.6% 64.9%" },
    500: { hex: "#6b7280", hsl: "220 8.9% 46.1%" },
    600: { hex: "#4b5563", hsl: "215 13.8% 34.1%" },
    700: { hex: "#374151", hsl: "216.9 19.1% 26.7%" },
    800: { hex: "#1f2937", hsl: "215 27.9% 16.9%" },
    900: { hex: "#111827", hsl: "220.9 39.3% 11%" },
    950: { hex: "#030712", hsl: "224 71.4% 4.1%" },
  },
  zinc: {
    50: { hex: "#fafafa", hsl: "0 0% 98%" },
    100: { hex: "#f4f4f5", hsl: "240 4.8% 95.9%" },
    200: { hex: "#e4e4e7", hsl: "240 5.9% 90%" },
    300: { hex: "#d4d4d8", hsl: "240 4.9% 83.9%" },
    400: { hex: "#a1a1aa", hsl: "240 5% 64.9%" },
    500: { hex: "#71717a", hsl: "240 3.8% 46.1%" },
    600: { hex: "#52525b", hsl: "240 5.2% 33.9%" },
    700: { hex: "#3f3f46", hsl: "240 5.3% 26.1%" },
    800: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
    900: { hex: "#18181b", hsl: "240 5.9% 10%" },
    950: { hex: "#09090b", hsl: "240 10% 3.9%" },
  },
  neutral: {
    50: { hex: "#fafafa", hsl: "0 0% 98%" },
    100: { hex: "#f5f5f5", hsl: "0 0% 96.1%" },
    200: { hex: "#e5e5e5", hsl: "0 0% 89.8%" },
    300: { hex: "#d4d4d4", hsl: "0 0% 83.1%" },
    400: { hex: "#a3a3a3", hsl: "0 0% 63.9%" },
    500: { hex: "#737373", hsl: "0 0% 45.1%" },
    600: { hex: "#525252", hsl: "0 0% 32.2%" },
    700: { hex: "#404040", hsl: "0 0% 25.1%" },
    800: { hex: "#262626", hsl: "0 0% 14.9%" },
    900: { hex: "#171717", hsl: "0 0% 9%" },
    950: { hex: "#0a0a0a", hsl: "0 0% 3.9%" },
  },
  red: {
    50: { hex: "#fef2f2", hsl: "0 85.7% 97.3%" },
    100: { hex: "#fee2e2", hsl: "0 93.3% 94.1%" },
    200: { hex: "#fecaca", hsl: "0 96.3% 89.4%" },
    300: { hex: "#fca5a5", hsl: "0 93.5% 81.8%" },
    400: { hex: "#f87171", hsl: "0 90.6% 70.8%" },
    500: { hex: "#ef4444", hsl: "0 84.2% 60.2%" },
    600: { hex: "#dc2626", hsl: "0 72.2% 50.6%" },
    700: { hex: "#b91c1c", hsl: "0 73.7% 41.8%" },
    800: { hex: "#991b1b", hsl: "0 70% 35.3%" },
    900: { hex: "#7f1d1d", hsl: "0 62.8% 30.6%" },
    950: { hex: "#450a0a", hsl: "0 74.7% 15.5%" },
  },
  orange: {
    50: { hex: "#fff7ed", hsl: "33.3 100% 96.5%" },
    100: { hex: "#ffedd5", hsl: "34.3 100% 91.8%" },
    200: { hex: "#fed7aa", hsl: "32.1 97.7% 83.1%" },
    300: { hex: "#fdba74", hsl: "25.4 95.3% 72.5%" },
    400: { hex: "#fb923c", hsl: "20.5 90.2% 60.8%" },
    500: { hex: "#f97316", hsl: "24.6 95% 53.1%" },
    600: { hex: "#ea580c", hsl: "20.9 91.7% 48.2%" },
    700: { hex: "#c2410c", hsl: "17.5 88.3% 40.2%" },
    800: { hex: "#9a3412", hsl: "15 79.1% 33.7%" },
    900: { hex: "#7c2d12", hsl: "15.3 74.6% 27.8%" },
    950: { hex: "#431407", hsl: "13 81.1% 14.5%" },
  },
  amber: {
    50: { hex: "#fffbeb", hsl: "48 100% 96.1%" },
    100: { hex: "#fef3c7", hsl: "48 96.5% 88.8%" },
    200: { hex: "#fde68a", hsl: "48 96.6% 76.7%" },
    300: { hex: "#fcd34d", hsl: "45.9 96.7% 64.5%" },
    400: { hex: "#fbbf24", hsl: "43.3 96.4% 56.3%" },
    500: { hex: "#f59e0b", hsl: "37.7 92.1% 50.2%" },
    600: { hex: "#d97706", hsl: "32.1 94.6% 43.7%" },
    700: { hex: "#b45309", hsl: "26 90.5% 37.1%" },
    800: { hex: "#92400e", hsl: "22.7 82.5% 31.4%" },
    900: { hex: "#78350f", hsl: "21.7 77.8% 26.5%" },
    950: { hex: "#451a03", hsl: "20.9 91.7% 14.1%" },
  },
  yellow: {
    50: { hex: "#fefce8", hsl: "54.9 91.7% 95.3%" },
    100: { hex: "#fef9c3", hsl: "54.9 96.7% 88%" },
    200: { hex: "#fef08a", hsl: "52.8 98.3% 76.9%" },
    300: { hex: "#fde047", hsl: "50.4 97.8% 63.5%" },
    400: { hex: "#facc15", hsl: "47.9 95.8% 53.1%" },
    500: { hex: "#eab308", hsl: "45.4 93.4% 47.5%" },
    600: { hex: "#ca8a04", hsl: "40.6 96.1% 40.4%" },
    700: { hex: "#a16207", hsl: "35.5 91.7% 32.9%" },
    800: { hex: "#854d0e", hsl: "31.8 81% 28.8%" },
    900: { hex: "#713f12", hsl: "28.4 72.5% 25.7%" },
    950: { hex: "#422006", hsl: "26 83.3% 14.1%" },
  },
  lime: {
    50: { hex: "#f7fee7", hsl: "78.3 92% 95.1%" },
    100: { hex: "#ecfccb", hsl: "79.6 89.1% 89.2%" },
    200: { hex: "#d9f99d", hsl: "80.9 88.5% 79.6%" },
    300: { hex: "#bef264", hsl: "82 84.5% 67.1%" },
    400: { hex: "#a3e635", hsl: "82.7 78% 55.5%" },
    500: { hex: "#84cc16", hsl: "83.7 80.5% 44.3%" },
    600: { hex: "#65a30d", hsl: "84.8 85.2% 34.5%" },
    700: { hex: "#4d7c0f", hsl: "85.9 78.4% 27.3%" },
    800: { hex: "#3f6212", hsl: "86.3 69% 22.7%" },
    900: { hex: "#365314", hsl: "87.6 61.2% 20.2%" },
    950: { hex: "#1a2e05", hsl: "86.3 80% 10.2%" },
  },
  green: {
    50: { hex: "#f0fdf4", hsl: "138.5 76.5% 96.7%" },
    100: { hex: "#dcfce7", hsl: "140.6 84.2% 92.5%" },
    200: { hex: "#bbf7d0", hsl: "141 78.9% 85.1%" },
    300: { hex: "#86efac", hsl: "141.7 76.6% 73.1%" },
    400: { hex: "#4ade80", hsl: "141.9 69.2% 58%" },
    500: { hex: "#22c55e", hsl: "142.1 70.6% 45.3%" },
    600: { hex: "#16a34a", hsl: "142.1 76.2% 36.3%" },
    700: { hex: "#15803d", hsl: "142.4 71.8% 29.2%" },
    800: { hex: "#166534", hsl: "142.8 64.2% 24.1%" },
    900: { hex: "#14532d", hsl: "143.8 61.2% 20.2%" },
    950: { hex: "#052e16", hsl: "144.9 80.4% 10%" },
  },
  emerald: {
    50: { hex: "#ecfdf5", hsl: "151.8 81% 95.9%" },
    100: { hex: "#d1fae5", hsl: "149.3 80.4% 90%" },
    200: { hex: "#a7f3d0", hsl: "152.4 76% 80.4%" },
    300: { hex: "#6ee7b7", hsl: "156.2 71.6% 66.9%" },
    400: { hex: "#34d399", hsl: "158.1 64.4% 51.6%" },
    500: { hex: "#10b981", hsl: "160.1 84.1% 39.4%" },
    600: { hex: "#059669", hsl: "161.4 93.5% 30.4%" },
    700: { hex: "#047857", hsl: "162.9 93.5% 24.3%" },
    800: { hex: "#065f46", hsl: "163.1 88.1% 19.8%" },
    900: { hex: "#064e3b", hsl: "164.2 85.7% 16.5%" },
    950: { hex: "#022c22", hsl: "165.7 91.3% 9.4%" },
  },
  teal: {
    50: { hex: "#f0fdfa", hsl: "166.2 76.5% 96.7%" },
    100: { hex: "#ccfbf1", hsl: "167.2 85.5% 89.2%" },
    200: { hex: "#99f6e4", hsl: "168.4 83.8% 78.2%" },
    300: { hex: "#5eead4", hsl: "170.6 76.9% 64.3%" },
    400: { hex: "#2dd4bf", hsl: "172.5 66% 50.4%" },
    500: { hex: "#14b8a6", hsl: "173.4 80.4% 40%" },
    600: { hex: "#0d9488", hsl: "174.7 83.9% 31.6%" },
    700: { hex: "#0f766e", hsl: "175.3 77.4% 26.1%" },
    800: { hex: "#115e59", hsl: "176.1 69.4% 21.8%" },
    900: { hex: "#134e4a", hsl: "175.9 60.8% 19%" },
    950: { hex: "#042f2e", hsl: "176.5 87.3% 10%" },
  },
  cyan: {
    50: { hex: "#ecfeff", hsl: "183.2 100% 96.3%" },
    100: { hex: "#cffafe", hsl: "185.1 95.9% 90.4%" },
    200: { hex: "#a5f3fc", hsl: "186.2 93.5% 81.8%" },
    300: { hex: "#67e8f9", hsl: "187 92.4% 69%" },
    400: { hex: "#22d3ee", hsl: "187.9 85.7% 53.3%" },
    500: { hex: "#06b6d4", hsl: "188.7 94.5% 42.7%" },
    600: { hex: "#0891b2", hsl: "191.6 91.4% 36.5%" },
    700: { hex: "#0e7490", hsl: "192.9 82.3% 31%" },
    800: { hex: "#155e75", hsl: "194.4 69.6% 27.1%" },
    900: { hex: "#164e63", hsl: "196.4 63.6% 23.7%" },
    950: { hex: "#083344", hsl: "197 78.9% 14.9%" },
  },
  sky: {
    50: { hex: "#f0f9ff", hsl: "204 100% 97.1%" },
    100: { hex: "#e0f2fe", hsl: "204 93.8% 93.7%" },
    200: { hex: "#bae6fd", hsl: "200.6 94.4% 86.1%" },
    300: { hex: "#7dd3fc", hsl: "199.4 95.5% 73.9%" },
    400: { hex: "#38bdf8", hsl: "198.4 93.2% 59.6%" },
    500: { hex: "#0ea5e9", hsl: "198.6 88.7% 48.4%" },
    600: { hex: "#0284c7", hsl: "200.4 98% 39.4%" },
    700: { hex: "#0369a1", hsl: "201.3 96.3% 32.2%" },
    800: { hex: "#075985", hsl: "201 90% 27.5%" },
    900: { hex: "#0c4a6e", hsl: "202 80.3% 23.9%" },
    950: { hex: "#082f49", hsl: "204 80.2% 15.9%" },
  },
  blue: {
    50: { hex: "#eff6ff", hsl: "213.8 100% 96.9%" },
    100: { hex: "#dbeafe", hsl: "214.3 94.6% 92.7%" },
    200: { hex: "#bfdbfe", hsl: "213.3 96.9% 87.3%" },
    300: { hex: "#93c5fd", hsl: "211.7 96.4% 78.4%" },
    400: { hex: "#60a5fa", hsl: "213.1 93.9% 67.8%" },
    500: { hex: "#3b82f6", hsl: "217.2 91.2% 59.8%" },
    600: { hex: "#2563eb", hsl: "221.2 83.2% 53.3%" },
    700: { hex: "#1d4ed8", hsl: "224.3 76.3% 48%" },
    800: { hex: "#1e40af", hsl: "225.9 70.7% 40.2%" },
    900: { hex: "#1e3a8a", hsl: "224.4 64.3% 32.9%" },
    950: { hex: "#172554", hsl: "226 57% 21%" },
  },
  indigo: {
    50: { hex: "#eef2ff", hsl: "225.9 100% 96.7%" },
    100: { hex: "#e0e7ff", hsl: "226.5 100% 93.9%" },
    200: { hex: "#c7d2fe", hsl: "228 96.5% 88.8%" },
    300: { hex: "#a5b4fc", hsl: "229.7 93.5% 81.8%" },
    400: { hex: "#818cf8", hsl: "234.5 89.5% 73.9%" },
    500: { hex: "#6366f1", hsl: "238.7 83.5% 66.7%" },
    600: { hex: "#4f46e5", hsl: "243.4 75.4% 58.6%" },
    700: { hex: "#4338ca", hsl: "244.5 57.9% 50.6%" },
    800: { hex: "#3730a3", hsl: "243.7 54.5% 41.4%" },
    900: { hex: "#312e81", hsl: "242.2 47.4% 34.3%" },
    950: { hex: "#1e1b4b", hsl: "243.8 47.1% 20%" },
  },
  violet: {
    50: { hex: "#f5f3ff", hsl: "250 100% 97.6%" },
    100: { hex: "#ede9fe", hsl: "251.4 91.3% 95.5%" },
    200: { hex: "#ddd6fe", hsl: "250.5 95.2% 91.8%" },
    300: { hex: "#c4b5fd", hsl: "252.5 94.7% 85.1%" },
    400: { hex: "#a78bfa", hsl: "255.1 91.7% 76.3%" },
    500: { hex: "#8b5cf6", hsl: "258.3 89.5% 66.3%" },
    600: { hex: "#7c3aed", hsl: "262.1 83.3% 57.8%" },
    700: { hex: "#6d28d9", hsl: "263.4 70% 50.4%" },
    800: { hex: "#5b21b6", hsl: "263.7 69.3% 42.2%" },
    900: { hex: "#4c1d95", hsl: "263.5 67.4% 34.9%" },
    950: { hex: "#2e1065", hsl: "261.2 72.6% 22.9%" },
  },
  purple: {
    50: { hex: "#faf5ff", hsl: "270 100% 98%" },
    100: { hex: "#f3e8ff", hsl: "268.7 100% 95.5%" },
    200: { hex: "#e9d5ff", hsl: "268.6 100% 91.8%" },
    300: { hex: "#d8b4fe", hsl: "269.2 97.4% 85.1%" },
    400: { hex: "#c084fc", hsl: "270 95.2% 75.3%" },
    500: { hex: "#a855f7", hsl: "270.7 91% 65.1%" },
    600: { hex: "#9333ea", hsl: "271.5 81.3% 55.9%" },
    700: { hex: "#7e22ce", hsl: "272.1 71.7% 47.1%" },
    800: { hex: "#6b21a8", hsl: "272.9 67.2% 39.4%" },
    900: { hex: "#581c87", hsl: "273.6 65.6% 32%" },
    950: { hex: "#3b0764", hsl: "274 87.1% 20.8%" },
  },
  fuchsia: {
    50: { hex: "#fdf4ff", hsl: "289.1 100% 97.8%" },
    100: { hex: "#fae8ff", hsl: "287 100% 95.5%" },
    200: { hex: "#f5d0fe", hsl: "288.3 95.8% 90.6%" },
    300: { hex: "#f0abfc", hsl: "291.1 93.1% 82.9%" },
    400: { hex: "#e879f9", hsl: "292 91.4% 72.5%" },
    500: { hex: "#d946ef", hsl: "292.2 84.1% 60.6%" },
    600: { hex: "#c026d3", hsl: "293.4 69.5% 48.8%" },
    700: { hex: "#a21caf", hsl: "294.7 72.4% 39.8%" },
    800: { hex: "#86198f", hsl: "295.4 70.2% 32.9%" },
    900: { hex: "#701a75", hsl: "296.7 63.6% 28%" },
    950: { hex: "#4a044e", hsl: "297.1 90.2% 16.1%" },
  },
  pink: {
    50: { hex: "#fdf2f8", hsl: "327.3 73.3% 97.1%" },
    100: { hex: "#fce7f3", hsl: "325.7 77.8% 94.7%" },
    200: { hex: "#fbcfe8", hsl: "325.9 84.6% 89.8%" },
    300: { hex: "#f9a8d4", hsl: "327.4 87.1% 81.8%" },
    400: { hex: "#f472b6", hsl: "328.6 85.5% 70.2%" },
    500: { hex: "#ec4899", hsl: "330.4 81.2% 60.4%" },
    600: { hex: "#db2777", hsl: "333.3 71.4% 50.6%" },
    700: { hex: "#be185d", hsl: "335.1 77.6% 42%" },
    800: { hex: "#9d174d", hsl: "335.8 74.4% 35.3%" },
    900: { hex: "#831843", hsl: "335.9 69% 30.4%" },
    950: { hex: "#500724", hsl: "336.2 80.3% 17.3%" },
  },
  rose: {
    50: { hex: "#fff1f2", hsl: "355.7 100% 97.3%" },
    100: { hex: "#ffe4e6", hsl: "355.6 100% 94.7%" },
    200: { hex: "#fecdd3", hsl: "352.7 96.1% 90%" },
    300: { hex: "#fda4af", hsl: "352.6 95.7% 81.8%" },
    400: { hex: "#fb7185", hsl: "351.3 94.5% 71.4%" },
    500: { hex: "#f43f5e", hsl: "349.7 89.2% 60.2%" },
    600: { hex: "#e11d48", hsl: "346.8 77.2% 49.8%" },
    700: { hex: "#be123c", hsl: "345.3 82.7% 40.8%" },
    800: { hex: "#9f1239", hsl: "343.4 79.7% 34.7%" },
    900: { hex: "#881337", hsl: "341.5 75.5% 30.4%" },
    950: { hex: "#4c0519", hsl: "343.1 87.7% 15.9%" },
  },
  white: {
    DEFAULT: { hex: "#ffffff", hsl: "0 0% 100%" },
  },
  black: {
    DEFAULT: { hex: "#000000", hsl: "0 0% 0%" },
  },
};

// Flatten for easy lookup: "emerald-500" → { hex, hsl }
export const flattenColors = () => {
  const flat = {};
  Object.entries(TAILWIND_COLORS).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, val]) => {
      const key = shade === "DEFAULT" ? colorName : `${colorName}-${shade}`;
      flat[key] = { ...val, name: key };
    });
  });
  return flat;
};

export const FLAT_COLORS = flattenColors();

// Get HSL from a color key like "emerald-500"
export const getHslFromKey = (key) => {
  return FLAT_COLORS[key]?.hsl || key; // fallback to raw value
};

// Get hex from a color key
export const getHexFromKey = (key) => {
  return FLAT_COLORS[key]?.hex || key;
};

// ─── Font Family Options ───────────────────────────────────────────────
export const FONT_FAMILY_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "'Nunito Sans', sans-serif", label: "Nunito Sans" },
  { value: "'Source Sans Pro', sans-serif", label: "Source Sans Pro" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Raleway, sans-serif", label: "Raleway" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta Sans" },
  { value: "system-ui, sans-serif", label: "System UI" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Merriweather', serif", label: "Merriweather" },
  { value: "'Fira Code', monospace", label: "Fira Code" },
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
];

// ─── Font Size Options ─────────────────────────────────────────────────
export const FONT_SIZE_OPTIONS = [
  { value: "10px", label: "10px — Extra Small" },
  { value: "11px", label: "11px" },
  { value: "12px", label: "12px — Small (xs)" },
  { value: "13px", label: "13px" },
  { value: "14px", label: "14px — Base (sm)" },
  { value: "15px", label: "15px" },
  { value: "16px", label: "16px — Medium (base)" },
  { value: "18px", label: "18px — Large (lg)" },
  { value: "20px", label: "20px — XL" },
  { value: "24px", label: "24px — 2XL" },
  { value: "30px", label: "30px — 3XL" },
  { value: "36px", label: "36px — 4XL" },
];

// ─── Font Weight Options ───────────────────────────────────────────────
export const FONT_WEIGHT_OPTIONS = [
  { value: "100", label: "100 — Thin" },
  { value: "200", label: "200 — Extra Light" },
  { value: "300", label: "300 — Light" },
  { value: "400", label: "400 — Normal" },
  { value: "500", label: "500 — Medium" },
  { value: "600", label: "600 — Semi Bold" },
  { value: "700", label: "700 — Bold" },
  { value: "800", label: "800 — Extra Bold" },
  { value: "900", label: "900 — Black" },
];

// ─── Line Height Options ───────────────────────────────────────────────
export const LINE_HEIGHT_OPTIONS = [
  { value: "1", label: "1 — None" },
  { value: "1.25", label: "1.25 — Tight" },
  { value: "1.375", label: "1.375 — Snug" },
  { value: "1.5", label: "1.5 — Normal" },
  { value: "1.625", label: "1.625 — Relaxed" },
  { value: "2", label: "2 — Loose" },
];

// ─── Border Radius Options ─────────────────────────────────────────────
export const RADIUS_OPTIONS = [
  { value: "0", label: "0 — None" },
  { value: "0.125rem", label: "0.125rem — 2px" },
  { value: "0.25rem", label: "0.25rem — 4px (sm)" },
  { value: "0.375rem", label: "0.375rem — 6px (md)" },
  { value: "0.5rem", label: "0.5rem — 8px (default)" },
  { value: "0.75rem", label: "0.75rem — 12px (lg)" },
  { value: "1rem", label: "1rem — 16px (xl)" },
  { value: "1.5rem", label: "1.5rem — 24px (2xl)" },
  { value: "9999px", label: "9999px — Full" },
];

// ─── Border Width Options ──────────────────────────────────────────────
export const BORDER_WIDTH_OPTIONS = [
  { value: "0px", label: "0px — None" },
  { value: "1px", label: "1px — Default" },
  { value: "2px", label: "2px — Medium" },
  { value: "4px", label: "4px — Thick" },
  { value: "8px", label: "8px — Extra Thick" },
];

// ─── Border Style Options ──────────────────────────────────────────────
export const BORDER_STYLE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
  { value: "none", label: "None" },
];

// ─── Sidebar Width Options ─────────────────────────────────────────────
export const SIDEBAR_WIDTH_OPTIONS = [
  { value: "200px", label: "200px — Narrow" },
  { value: "224px", label: "224px — Compact" },
  { value: "256px", label: "256px — Default" },
  { value: "280px", label: "280px — Wide" },
  { value: "320px", label: "320px — Extra Wide" },
];

export const SIDEBAR_COLLAPSED_WIDTH_OPTIONS = [
  { value: "0px", label: "0px — Hidden" },
  { value: "48px", label: "48px — Minimal" },
  { value: "64px", label: "64px — Default" },
  { value: "80px", label: "80px — Comfortable" },
];

// ─── Header Height Options ─────────────────────────────────────────────
export const HEADER_HEIGHT_OPTIONS = [
  { value: "48px", label: "48px — Compact" },
  { value: "56px", label: "56px — Small" },
  { value: "64px", label: "64px — Default" },
  { value: "72px", label: "72px — Tall" },
  { value: "80px", label: "80px — Extra Tall" },
];

// ─── Color Role Descriptions ───────────────────────────────────────────
// What each CSS variable is used for (tooltips/help text)
export const COLOR_ROLE_INFO = {
  primary: "Buttons, links, active states",
  primaryForeground: "Text on primary backgrounds",
  secondary: "Secondary buttons, tags",
  secondaryForeground: "Text on secondary backgrounds",
  background: "Page background",
  foreground: "Main body text",
  card: "Card backgrounds",
  cardForeground: "Text inside cards",
  muted: "Muted backgrounds, disabled states",
  mutedForeground: "Muted/placeholder text",
  accent: "Highlighted areas, hover backgrounds",
  accentForeground: "Text on accent backgrounds",
  destructive: "Error, danger, delete actions",
  destructiveForeground: "Text on destructive backgrounds",
  border: "Borders, dividers",
  input: "Input field borders",
  ring: "Focus rings, outlines",
  popover: "Dropdown/popover backgrounds",
  popoverForeground: "Text in dropdowns/popovers",
};

// ─── Preset Color Schemes (Quick Apply) ────────────────────────────────
export const COLOR_PRESETS = [
  {
    name: "Emerald",
    primary: "emerald-500",
    secondary: "slate-100",
    accent: "slate-100",
    destructive: "red-500",
    background: "white",
    foreground: "slate-950",
    muted: "slate-100",
    border: "slate-200",
  },
  {
    name: "Ocean Blue",
    primary: "blue-600",
    secondary: "sky-100",
    accent: "sky-100",
    destructive: "red-500",
    background: "white",
    foreground: "slate-950",
    muted: "sky-100",
    border: "sky-200",
  },
  {
    name: "Violet",
    primary: "violet-600",
    secondary: "violet-100",
    accent: "violet-100",
    destructive: "red-500",
    background: "white",
    foreground: "slate-950",
    muted: "violet-100",
    border: "violet-200",
  },
  {
    name: "Rose",
    primary: "rose-500",
    secondary: "rose-100",
    accent: "rose-100",
    destructive: "red-600",
    background: "white",
    foreground: "slate-950",
    muted: "rose-100",
    border: "rose-200",
  },
  {
    name: "Amber",
    primary: "amber-500",
    secondary: "amber-100",
    accent: "amber-100",
    destructive: "red-500",
    background: "white",
    foreground: "slate-950",
    muted: "amber-100",
    border: "amber-200",
  },
  {
    name: "Teal",
    primary: "teal-500",
    secondary: "teal-100",
    accent: "teal-100",
    destructive: "red-500",
    background: "white",
    foreground: "slate-950",
    muted: "teal-100",
    border: "teal-200",
  },
];

// ─── Dark Mode Preset Mappings ─────────────────────────────────────────
export const DARK_COLOR_PRESETS = [
  {
    name: "Emerald Dark",
    primary: "emerald-500",
    secondary: "gray-800",
    accent: "gray-800",
    destructive: "red-900",
    background: "gray-950",
    foreground: "gray-50",
    muted: "gray-800",
    border: "gray-800",
  },
  {
    name: "Ocean Dark",
    primary: "blue-600",
    secondary: "gray-800",
    accent: "gray-800",
    destructive: "red-900",
    background: "gray-950",
    foreground: "gray-50",
    muted: "gray-800",
    border: "gray-800",
  },
  {
    name: "Violet Dark",
    primary: "violet-600",
    secondary: "gray-800",
    accent: "gray-800",
    destructive: "red-900",
    background: "gray-950",
    foreground: "gray-50",
    muted: "gray-800",
    border: "gray-800",
  },
  {
    name: "Rose Dark",
    primary: "rose-500",
    secondary: "gray-800",
    accent: "gray-800",
    destructive: "red-900",
    background: "gray-950",
    foreground: "gray-50",
    muted: "gray-800",
    border: "gray-800",
  },
];
