/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Lato", "system-ui", "sans-serif"],
      serif: ["Cormorant Garamond", "Georgia", "serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    extend: {
      colors: {
        // Primary brand colors - Gold/Warm theme
        primary: {
          50: "#fef8ee",
          100: "#fdf0d7",
          200: "#f9ddae",
          300: "#f5c47b",
          400: "#f0a546",
          500: "#dd8e25",
          600: "#c77a2f",
          700: "#a35f2a",
          800: "#854b27",
          900: "#6e3e23",
          950: "#3d1f10",
        },
        // Secondary colors - Warm grays
        secondary: {
          50: "#f8f6f4",
          100: "#f0ece8",
          200: "#e0d8d0",
          300: "#cbbfb3",
          400: "#b4a492",
          500: "#a38e7a",
          600: "#957c67",
          700: "#7d6755",
          800: "#675548",
          900: "#55463d",
          950: "#2d241e",
        },
        // Accent colors - Warm tones
        accent: {
          orange: "#EB8B10",
          amber: "#D8A360",
          rose: "#e8a0a0",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
        },
      },
      height: {
        header: "560px",
        "screen-90": "90vh",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      backgroundImage: {
        "page-header": "url('/page-header-bg.jpg')",
        "contact-header": "url('/page-header-bg-2.jpg')",
        subscribe: "url('/subscribe-bg.jpg')",
        "app-download": "url('/app-download.jpg')",
        cta: "url('/cta-bg.png')",
        "cta-1": "url('/cta/cta-bg-1.png')",
        "cta-2": "url('/cta/cta-bg-2.png')",
        "cta-3": "url('/cta/cta-bg-3.png')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.1)",
        product:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "product-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        shimmer: "shimmer 2s infinite linear",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

module.exports = config;
