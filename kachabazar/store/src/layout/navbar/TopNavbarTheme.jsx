"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SelectTheme from "@components/form/SelectTheme";
import StoreTheme from "@components/common/StoreTheme";

/**
 * TopNavbarTheme — Client component that holds the active theme state
 * for the Electronic (and any other) layout that uses TopNavbar.
 *
 * Renders:
 *   • StoreTheme  — injects CSS vars into :root whenever the theme changes
 *   • SelectTheme — dropdown for switching themes
 */
const TopNavbarTheme = ({ themes, defaultTheme, size }) => {
  const [activeTheme, setActiveTheme] = useState(defaultTheme || null);

  // On mount, restore from cookie
  useEffect(() => {
    const savedId = Cookies.get("_theme");
    if (savedId && themes?.length) {
      const found = themes.find((t) => t._id === savedId);
      if (found) {
        setActiveTheme(found);
        return;
      }
    }
    if (defaultTheme) setActiveTheme(defaultTheme);
  }, [themes, defaultTheme]);

  return (
    <>
      {/* Inject CSS custom properties into :root */}
      <StoreTheme theme={activeTheme} />

      {/* Theme switcher dropdown */}
      <SelectTheme
        themes={themes}
        defaultTheme={defaultTheme}
        onThemeChange={(theme) => setActiveTheme(theme)}
        size={size}
      />
    </>
  );
};

export default TopNavbarTheme;
