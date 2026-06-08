"use client";

import { useContext } from "react";
import Link from "next/link";
import { StarIcon, TrendingUpIcon, TagIcon } from "lucide-react";

import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";

const NavbarPromoElectronic = ({ categories, categoryError }) => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const navbar = storeCustomization?.navbar;

  return (
    <div className="hidden lg:flex items-center gap-0.5 h-full">
      {/* Categories Mega Menu */}
      {navbar?.categories_menu_status && (
        <MegaMenuCategory
          categories={categories}
          categoryError={categoryError}
          storeLayout="electronic"
        />
      )}
      {/* Best-Selling Items */}
      <Link
        href="/search?sort=best-selling"
        onClick={() => setIsLoading(!isLoading)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 transition-colors whitespace-nowrap"
      >
        <TrendingUpIcon className="h-3.5 w-3.5" />
        Best-Selling
      </Link>

      {/* 5-Star Rated */}
      <Link
        href="/search?rating=5"
        onClick={() => setIsLoading(!isLoading)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 transition-colors whitespace-nowrap"
      >
        <StarIcon className="h-3.5 w-3.5 fill-current" />
        5-Star Rated
      </Link>

      {/* New In (Offers link) */}
      {navbar?.offers_menu_status && (
        <Link
          href="/offers"
          onClick={() => setIsLoading(!isLoading)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/15 transition-colors whitespace-nowrap"
        >
          <TagIcon className="h-3.5 w-3.5" />
          {showingTranslateValue(navbar?.offers) || "New In"}
        </Link>
      )}

     
      
    </div>
  );
};

export default NavbarPromoElectronic;
