import { useEffect, useLayoutEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ThemeServices from "@/services/ThemeServices";

/**
 * DynamicTheme component
 *
 * Fetches the default theme (isDefault: true) and applies CSS custom
 * properties via <style> elements (NOT inline styles) so that .dark
 * class overrides work correctly with proper CSS specificity.
 *
 * CRITICAL: We inject :root {} and .dark {} rules via <style> elements.
 * Using inline styles (root.style.setProperty) would break dark mode
 * because inline CSS vars have higher specificity than ANY stylesheet rule.
 *
 * Covers: colors, dark colors, sidebar, header, typography, sizing, borders.
 */

// Extract HSL value from a color token
const resolveHsl = (token) => {
  if (!token) return null;
  if (typeof token === "string") return token;
  if (typeof token === "object" && token.hsl) return token.hsl;
  return null;
};

// Dynamically load a Google Font if not already loaded
const loadGoogleFont = (fontFamily) => {
  if (!fontFamily) return;
  const primaryFont = fontFamily.split(",")[0].trim().replace(/['"]/g, "");
  const systemFonts = [
    "system-ui",
    "sans-serif",
    "serif",
    "monospace",
    "Inter",
    "Open Sans",
  ];
  if (systemFonts.some((f) => f.toLowerCase() === primaryFont.toLowerCase()))
    return;

  const linkId = `google-font-${primaryFont.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
    const p1 = document.createElement("link");
    p1.rel = "preconnect";
    p1.href = "https://fonts.googleapis.com";
    document.head.appendChild(p1);
    const p2 = document.createElement("link");
    p2.rel = "preconnect";
    p2.href = "https://fonts.gstatic.com";
    p2.crossOrigin = "anonymous";
    document.head.appendChild(p2);
  }

  const encodedFont = primaryFont.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
};

// ─── CSS Variable Maps ──────────────────────────────────────────────

const colorVarMap = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
};

const sidebarVarMap = {
  bgColor: "--sidebar-background",
  textColor: "--sidebar-foreground",
  activeColor: "--sidebar-primary",
};

// ─── Build CSS string from theme data ───────────────────────────────

function buildLightVars(theme) {
  const vars = [];

  // 1. Color tokens
  if (theme.colors) {
    Object.entries(colorVarMap).forEach(([key, varName]) => {
      const hsl = resolveHsl(theme.colors[key]);
      if (hsl) vars.push(`  ${varName}: ${hsl};`);
    });
  }

  // 2. Sidebar variables
  if (theme.sidebar) {
    Object.entries(sidebarVarMap).forEach(([key, varName]) => {
      const hsl = resolveHsl(theme.sidebar[key]);
      if (hsl) vars.push(`  ${varName}: ${hsl};`);
    });
    vars.push(`  --sidebar-primary-foreground: 0 0% 100%;`);
    vars.push(`  --sidebar-accent: 220 14.3% 95.9%;`);
    vars.push(`  --sidebar-accent-foreground: 220.9 39.3% 11%;`);
    vars.push(`  --sidebar-border: 220 13% 91%;`);
    vars.push(
      `  --sidebar-ring: ${resolveHsl(theme.sidebar.activeColor) || "160.1 84.1% 39.4%"};`,
    );
  }

  // 3. Sizing (radius)
  if (theme.sizing) {
    if (theme.sizing.radius) vars.push(`  --radius: ${theme.sizing.radius};`);
  }

  // 4. Typography
  if (theme.typography) {
    if (theme.typography.fontFamily) {
      vars.push(`  --font-family: ${theme.typography.fontFamily};`);
    }
    if (theme.typography.fontSizeBase) {
      vars.push(`  --font-size-base: ${theme.typography.fontSizeBase};`);
    }
    if (theme.typography.fontSizeSm) {
      vars.push(`  --font-size-sm: ${theme.typography.fontSizeSm};`);
    }
    if (theme.typography.fontSizeLg) {
      vars.push(`  --font-size-lg: ${theme.typography.fontSizeLg};`);
    }
    if (theme.typography.fontSizeXl) {
      vars.push(`  --font-size-xl: ${theme.typography.fontSizeXl};`);
    }
    if (theme.typography.fontWeightNormal) {
      vars.push(
        `  --font-weight-normal: ${theme.typography.fontWeightNormal};`,
      );
    }
    if (theme.typography.fontWeightMedium) {
      vars.push(
        `  --font-weight-medium: ${theme.typography.fontWeightMedium};`,
      );
    }
    if (theme.typography.fontWeightBold) {
      vars.push(`  --font-weight-bold: ${theme.typography.fontWeightBold};`);
    }
    if (theme.typography.lineHeight) {
      vars.push(`  --line-height: ${theme.typography.lineHeight};`);
    }
  }

  // 5. Borders
  if (theme.borders) {
    if (theme.borders.borderWidth) {
      vars.push(`  --border-width: ${theme.borders.borderWidth};`);
    }
  }

  // 6. Header
  if (theme.header) {
    if (theme.header.height) {
      vars.push(`  --header-height: ${theme.header.height};`);
    }
    const hdrBg = resolveHsl(theme.header.bgColor);
    if (hdrBg) vars.push(`  --header-background: ${hdrBg};`);
    const hdrFg = resolveHsl(theme.header.textColor);
    if (hdrFg) vars.push(`  --header-foreground: ${hdrFg};`);
  }

  return vars;
}

function buildDarkVars(theme) {
  const vars = [];

  if (theme.darkColors) {
    Object.entries(colorVarMap).forEach(([key, varName]) => {
      const hsl = resolveHsl(theme.darkColors[key]);
      if (hsl) vars.push(`  ${varName}: ${hsl};`);
    });
  }

  // Dark sidebar — use card color for visual consistency with header
  const darkCard = resolveHsl(theme.darkColors?.card) || "217 33% 17%";
  const darkBorder = resolveHsl(theme.darkColors?.border) || "217 25% 23%";
  const darkAccent = resolveHsl(theme.darkColors?.accent) || "217 28% 25%";
  const darkFg = resolveHsl(theme.darkColors?.foreground) || "218 15% 85%";
  const darkRing = resolveHsl(theme.darkColors?.ring) || "160.1 84.1% 39.4%";
  const darkPrimary =
    resolveHsl(theme.darkColors?.primary) || "160.1 84.1% 39.4%";

  vars.push(`  --sidebar-background: ${darkCard};`);
  vars.push(`  --sidebar-foreground: ${darkFg};`);
  vars.push(`  --sidebar-primary: ${darkPrimary};`);
  vars.push(`  --sidebar-primary-foreground: 0 0% 100%;`);
  vars.push(`  --sidebar-accent: ${darkAccent};`);
  vars.push(`  --sidebar-accent-foreground: ${darkFg};`);
  vars.push(`  --sidebar-border: ${darkBorder};`);
  vars.push(`  --sidebar-ring: ${darkRing};`);

  // Dark header — also use card color
  vars.push(`  --header-background: ${darkCard};`);
  vars.push(`  --header-foreground: ${darkFg};`);

  return vars;
}

// ─── Component ──────────────────────────────────────────────────────

const DynamicTheme = () => {
  const queryClient = useQueryClient();

  // Fetch the default theme (isDefault: true)
  const { data: theme } = useQuery({
    queryKey: ["active-theme-default"],
    queryFn: ThemeServices.getDefaultTheme,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // Apply theme CSS vars synchronously to avoid FOUC
  useLayoutEffect(() => {
    if (!theme || !theme._id) return;

    const root = document.documentElement;

    // ── Inject light-mode :root CSS ─────────────────────────────────
    const lightVars = buildLightVars(theme);

    let lightStyleEl = document.getElementById("dynamic-theme-light");
    if (!lightStyleEl) {
      lightStyleEl = document.createElement("style");
      lightStyleEl.id = "dynamic-theme-light";
      document.head.appendChild(lightStyleEl);
    }
    lightStyleEl.textContent = `:root {\n${lightVars.join("\n")}\n}`;

    // ── Inject dark-mode .dark CSS ──────────────────────────────────
    const darkVars = buildDarkVars(theme);

    let darkStyleEl = document.getElementById("dynamic-theme-dark");
    if (!darkStyleEl) {
      darkStyleEl = document.createElement("style");
      darkStyleEl.id = "dynamic-theme-dark";
      document.head.appendChild(darkStyleEl);
    }
    darkStyleEl.textContent = `.dark {\n${darkVars.join("\n")}\n}`;

    // ── Typography: load Google Font ────────────────────────────────
    if (theme.typography?.fontFamily) {
      loadGoogleFont(theme.typography.fontFamily);
      root.style.fontFamily = theme.typography.fontFamily;
    }

    // Cleanup
    return () => {
      root.style.fontFamily = "";
      const el1 = document.getElementById("dynamic-theme-light");
      if (el1) el1.remove();
      const el2 = document.getElementById("dynamic-theme-dark");
      if (el2) el2.remove();
    };
  }, [theme]);

  // Listen for custom "theme-changed" event (dispatched by Themes page)
  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["active-theme-default"] });
    };
    window.addEventListener("theme-changed", handler);
    return () => window.removeEventListener("theme-changed", handler);
  }, [queryClient]);

  return null;
};

export default DynamicTheme;
