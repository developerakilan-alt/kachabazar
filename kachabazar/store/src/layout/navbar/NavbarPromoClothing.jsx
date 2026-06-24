"use client";

import { useState, useEffect } from "react";

import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import StoreTheme from "@components/common/StoreTheme";
import Link from "next/link";

const NavbarPromoClothing = ({
  languages,
  categories,
  categoryError,
  themes,
  defaultTheme,
  storeLayout = "clothing",
  categoriesMenuStatus = true,
}) => {

  const [activeTheme, setActiveTheme] = useState(defaultTheme || null);
  const clothingContainer =
    "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10";

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

      <div className="hidden lg:block xl:block bg-[#EBD1B0] border-b border-[#d9bd99]">
        <div
          className={`${clothingContainer} h-11 flex justify-between items-center`}
        >
          <div className="flex items-center gap-6">
            {/* Mega Menu */}
            {categoriesMenuStatus && (
              <MegaMenuCategory
                categories={categories}
                categoryError={categoryError}
                storeLayout="clothing"
              />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-foreground">
            <Link href="/privacy-policy" className="hover:text-[#8B6914] transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#8B6914] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromoClothing;
