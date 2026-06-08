import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SidebarContext } from "@/context/SidebarContext";
import ThemeServices from "@/services/ThemeServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";
import { getHslFromKey } from "@/utils/themeConstants";

// ─── Default color tokens (key + hsl) ─────────────────────────────────
const ct = (key, hsl) => ({ key, hsl });

const defaultColors = {
  primary: ct("emerald-500", "160.1 84.1% 39.4%"),
  primaryForeground: ct("slate-50", "210 40% 98%"),
  secondary: ct("slate-100", "210 40% 96.1%"),
  secondaryForeground: ct("slate-950", "222.2 84% 4.9%"),
  background: ct("white", "0 0% 100%"),
  foreground: ct("slate-950", "222.2 84% 4.9%"),
  card: ct("white", "0 0% 100%"),
  cardForeground: ct("slate-950", "222.2 84% 4.9%"),
  muted: ct("slate-100", "210 40% 96.1%"),
  mutedForeground: ct("slate-500", "215.4 16.3% 46.9%"),
  accent: ct("slate-100", "210 40% 96.1%"),
  accentForeground: ct("slate-950", "222.2 84% 4.9%"),
  destructive: ct("red-500", "0 84.2% 60.2%"),
  destructiveForeground: ct("slate-50", "210 40% 98%"),
  border: ct("slate-200", "214.3 31.8% 91.4%"),
  input: ct("slate-200", "214.3 31.8% 91.4%"),
  ring: ct("emerald-500", "160.1 84.1% 39.4%"),
  popover: ct("white", "0 0% 100%"),
  popoverForeground: ct("slate-950", "222.2 84% 4.9%"),
};

const defaultDarkColors = {
  primary: ct("emerald-500", "160.1 84.1% 39.4%"),
  primaryForeground: ct("white", "0 0% 100%"),
  secondary: ct("slate-700", "217 28% 25%"),
  secondaryForeground: ct("slate-300", "218 15% 85%"),
  background: ct("slate-900", "222 47% 11%"),
  foreground: ct("slate-300", "218 15% 85%"),
  card: ct("slate-800", "217 33% 17%"),
  cardForeground: ct("slate-300", "218 15% 85%"),
  muted: ct("slate-700", "217 28% 25%"),
  mutedForeground: ct("slate-400", "215 20% 55%"),
  accent: ct("slate-700", "217 28% 25%"),
  accentForeground: ct("slate-300", "218 15% 85%"),
  destructive: ct("red-400", "0 62.8% 60.6%"),
  destructiveForeground: ct("slate-300", "218 15% 85%"),
  border: ct("dark-border", "217 25% 23%"),
  input: ct("dark-input", "217 25% 27%"),
  ring: ct("emerald-500", "160.1 84.1% 39.4%"),
  popover: ct("slate-800", "217 33% 17%"),
  popoverForeground: ct("slate-300", "218 15% 85%"),
};

const defaultTypography = {
  fontFamily: "Inter, sans-serif",
  fontSizeBase: "14px",
  fontSizeSm: "12px",
  fontSizeLg: "16px",
  fontSizeXl: "20px",
  fontWeightNormal: "400",
  fontWeightMedium: "500",
  fontWeightBold: "700",
  lineHeight: "1.5",
};

const defaultSizing = {
  radius: "0.5rem",
  radiusSm: "0.25rem",
  radiusMd: "0.375rem",
  radiusLg: "0.5rem",
  radiusXl: "0.75rem",
};

const defaultBorders = {
  borderWidth: "1px",
  borderStyle: "solid",
};

const defaultSidebar = {
  width: "256px",
  bgColor: ct("slate-50", "0 0% 98%"),
  textColor: ct("slate-700", "240 5.3% 26.1%"),
  activeColor: ct("emerald-500", "160.1 84.1% 39.4%"),
};

const defaultHeader = {
  height: "64px",
  bgColor: ct("white", "0 0% 100%"),
  textColor: ct("gray-800", "215 27.9% 16.9%"),
};

// Helper: update a color token by resolving the key to HSL automatically
const updateColorToken = (key) => ({
  key,
  hsl: getHslFromKey(key),
});

const useThemeSubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const { closeDrawer } = useAction();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colors, setColors] = useState(structuredClone(defaultColors));
  const [darkColors, setDarkColors] = useState(
    structuredClone(defaultDarkColors),
  );
  const [typography, setTypography] = useState({ ...defaultTypography });
  const [sizing, setSizing] = useState({ ...defaultSizing });
  const [borders, setBorders] = useState({ ...defaultBorders });
  const [sidebar, setSidebar] = useState(structuredClone(defaultSidebar));
  const [header, setHeader] = useState(structuredClone(defaultHeader));
  const [tapValue, setTapValue] = useState("General");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // ─── Color update helpers ──────────────────────────────────────────
  const updateColor = (role, key) => {
    setColors((prev) => ({ ...prev, [role]: updateColorToken(key) }));
  };

  const updateDarkColor = (role, key) => {
    setDarkColors((prev) => ({ ...prev, [role]: updateColorToken(key) }));
  };

  const updateSidebarColor = (role, key) => {
    setSidebar((prev) => ({ ...prev, [role]: updateColorToken(key) }));
  };

  const updateHeaderColor = (role, key) => {
    setHeader((prev) => ({ ...prev, [role]: updateColorToken(key) }));
  };

  // ─── Apply a preset ───────────────────────────────────────────────
  const applyColorPreset = (preset, isDark = false) => {
    const setter = isDark ? setDarkColors : setColors;
    setter((prev) => {
      const next = { ...prev };
      Object.keys(preset).forEach((role) => {
        if (role === "name") return;
        if (next[role] !== undefined) {
          next[role] = updateColorToken(preset[role]);
        }
      });
      if (preset.primary) {
        next.ring = updateColorToken(preset.primary);
      }
      if (preset.foreground) {
        next.cardForeground = updateColorToken(preset.foreground);
        next.popoverForeground = updateColorToken(preset.foreground);
      }
      if (preset.background) {
        next.card = updateColorToken(preset.background);
        next.popover = updateColorToken(preset.background);
      }
      if (preset.secondary) {
        next.secondaryForeground = isDark
          ? updateColorToken("slate-50")
          : updateColorToken("slate-950");
        next.accentForeground = isDark
          ? updateColorToken("slate-50")
          : updateColorToken("slate-950");
      }
      return next;
    });
  };

  // ─── Submit ────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const themeData = {
        name: data.name,
        description: data.description || "",
        status: data.status || "show",
        isDefault: data.isDefault || false,
        colors,
        darkColors,
        typography,
        sizing,
        borders,
        sidebar,
        header,
      };

      if (id) {
        const res = await ThemeServices.updateTheme(id, themeData);
        setIsUpdate(true);
        notifySuccess(res.message);
      } else {
        const res = await ThemeServices.addTheme(themeData);
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      closeDrawer();
      setIsSubmitting(false);
      // Notify DynamicTheme to re-fetch the active theme
      window.dispatchEvent(new Event("theme-changed"));
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  // ─── Load existing theme ──────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setColors(structuredClone(defaultColors));
      setDarkColors(structuredClone(defaultDarkColors));
      setTypography({ ...defaultTypography });
      setSizing({ ...defaultSizing });
      setBorders({ ...defaultBorders });
      setSidebar(structuredClone(defaultSidebar));
      setHeader(structuredClone(defaultHeader));
      return;
    }

    (async () => {
      try {
        const res = await ThemeServices.getThemeById(id);
        if (res) {
          setValue("name", res.name);
          setValue("description", res.description);
          setValue("status", res.status);
          setValue("isDefault", res.isDefault);

          if (res.colors) setColors(res.colors);
          if (res.darkColors) setDarkColors(res.darkColors);
          if (res.typography) setTypography(res.typography);
          if (res.sizing) setSizing(res.sizing);
          if (res.borders) setBorders(res.borders);
          if (res.sidebar) setSidebar(res.sidebar);
          if (res.header) setHeader(res.header);
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    setValue,
    watch,
    // Colors
    colors,
    setColors,
    darkColors,
    setDarkColors,
    updateColor,
    updateDarkColor,
    applyColorPreset,
    // Typography
    typography,
    setTypography,
    // Sizing
    sizing,
    setSizing,
    // Borders
    borders,
    setBorders,
    // Layout
    sidebar,
    setSidebar,
    updateSidebarColor,
    header,
    setHeader,
    updateHeaderColor,
    // Tabs
    tapValue,
    setTapValue,
  };
};

export default useThemeSubmit;
