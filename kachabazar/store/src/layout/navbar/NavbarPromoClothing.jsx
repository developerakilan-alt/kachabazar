"use client";

import { useState, useEffect } from "react";

import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import StoreTheme from "@components/common/StoreTheme";
import { useSetting } from "@context/SettingContext";

const NavbarPromoClothing = ({
  categories,
  categoryError,
  themes,
  defaultTheme,
  storeLayout = "clothing",
}) => {
  const { storeCustomization } = useSetting();
  const navbar = storeCustomization?.navbar;

  const [activeTheme, setActiveTheme] = useState(defaultTheme || null);

  useEffect(() => {
    const Cookies = require("js-cookie");
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
      <StoreTheme theme={activeTheme} />

      <div className="hidden lg:block xl:block bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 h-11 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* Mega Menu */}
            {navbar?.categories_menu_status && (
              <MegaMenuCategory
                categories={categories}
                categoryError={categoryError}
                storeLayout="clothing"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromoClothing;
