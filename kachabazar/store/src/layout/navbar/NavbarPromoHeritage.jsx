"use client";

import { useState, useEffect } from "react";

import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import TopNavbarTheme from "./TopNavbarTheme";
import SelectLayout from "@components/form/SelectLayout";
import StoreTheme from "@components/common/StoreTheme";
import { useSetting } from "@context/SettingContext";

const NavbarPromoHeritage = ({
  categories,
  categoryError,
  themes,
  defaultTheme,
  storeLayout = "heritage",
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

      <div className="border-t border-[rgba(216,163,96,0.08)]">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 h-12 flex justify-between items-center">
          <div className="inline-flex">
            <div className="relative">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center md:justify-start md:space-x-10">
                  <nav className="md:flex items-center gap-5">
                    {navbar?.categories_menu_status && (
                      <MegaMenuCategory
                        categories={categories}
                        categoryError={categoryError}
                        storeLayout={storeLayout}
                      />
                    )}


                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-[rgba(216,163,96,0.8)]">
            <TopNavbarTheme
              themes={themes}
              defaultTheme={defaultTheme}
              size="text-xs"
            />
            <SelectLayout currentLayout={storeLayout} size="text-xs" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromoHeritage;
