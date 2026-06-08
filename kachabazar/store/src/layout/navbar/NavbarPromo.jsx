"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";

//internal import
import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SelectLanguage from "@components/form/SelectLanguage";
import StoreTheme from "@components/common/StoreTheme";
import {
  AlertCircle,
  ChevronDownIcon,
  File,
  FolderLock,
  Gift,
  HelpCircle,
  PhoneIncoming,
  ShoppingBag,
  User,
  Zap,
} from "lucide-react";
import { useSetting } from "@context/SettingContext";

const NavbarPromo = ({
  languages,
  categories,
  categoryError,
  themes,
  defaultTheme,
  storeLayout = "default",
}) => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomization, globalSetting } = useSetting();

  const { showingTranslateValue } = useUtilsFunction();
  const navbar = storeCustomization?.navbar;

  const [activeTheme, setActiveTheme] = useState(defaultTheme || null);

  // On mount, check for saved theme in cookie
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
      {/* Inject theme CSS variables */}
      <StoreTheme theme={activeTheme} />

      <div
        suppressHydrationWarning
        className="hidden lg:block xl:block bg-background text-foreground border-b border-border"
      >
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

                    {navbar?.about_menu_status && (
                      <Link
                        href="/about-us"
                        onClick={() => setIsLoading(!isLoading)}
                        className="py-2 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {showingTranslateValue(navbar?.about_us) || "About Us"}
                      </Link>
                    )}

                    {navbar?.contact_menu_status && (
                      <Link
                        onClick={() => setIsLoading(!isLoading)}
                        href="/contact-us"
                        className="py-2 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {showingTranslateValue(navbar?.contact_us) ||
                          "Contact Us"}
                      </Link>
                    )}

                    <div className="relative group/pages">
                      <button className="inline-flex items-center py-2 text-sm font-medium text-foreground hover:text-primary focus:outline-none">
                        <span>
                          {showingTranslateValue(navbar?.pages) || "Pages"}
                        </span>
                        <ChevronDownIcon
                          className="ml-1 h-3 w-3 group-hover/pages:rotate-180 transition-transform duration-200"
                          aria-hidden="true"
                        />
                      </button>

                      <div className="invisible opacity-0 group-hover/pages:visible group-hover/pages:opacity-100 absolute z-10 -ml-1 top-full pt-1 transition-all duration-200 ease-in-out">
                        <div className="w-screen max-w-xs bg-card border border-border rounded-lg shadow-lg">
                          <div className="rounded-lg shadow-lg overflow-y-scroll grow scrollbar-hide w-full h-full">
                            <div className="relative grid gap-2 px-6 py-6 text-foreground">
                              {navbar?.offers_menu_status && (
                                <span className="p-2 items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <Gift className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/offers"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(navbar?.offers) ||
                                        "Offers"}
                                    </Link>
                                  </div>
                                </span>
                              )}
                              <span className="p-2 items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                <div className="w-full flex">
                                  <Zap className="my-auto h-5 w-5 text-orange-500" />
                                  <Link
                                    href="/flash-sale"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                  >
                                    Flash Sale
                                  </Link>
                                </div>
                              </span>
                              <span className="p-2 items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                <div className="w-full flex">
                                  <ShoppingBag className="my-auto h-5 w-5 text-muted-foreground" />
                                  <Link
                                    href="/checkout"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                  >
                                    {showingTranslateValue(navbar?.checkout) ||
                                      "Checkout"}
                                  </Link>
                                </div>
                              </span>

                              {navbar?.faq_status && (
                                <span className="p-2  items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <HelpCircle className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/faq"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(navbar?.faq) ||
                                        "FAQ"}
                                    </Link>
                                  </div>
                                </span>
                              )}

                              {navbar?.about_menu_status && (
                                <span className="p-2   items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <User className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/about-us"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(
                                        navbar?.about_us,
                                      ) || "About Us"}
                                    </Link>
                                  </div>
                                </span>
                              )}

                              {navbar?.contact_menu_status && (
                                <span className="p-2   items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <PhoneIncoming className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/contact-us"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(
                                        navbar?.contact_us,
                                      ) || "Contact Us"}
                                    </Link>
                                  </div>
                                </span>
                              )}

                              {navbar?.privacy_policy_status && (
                                <span className="p-2   items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <FolderLock className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/privacy-policy"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(
                                        navbar?.privacy_policy,
                                      ) || "Privacy Policy"}
                                    </Link>
                                  </div>
                                </span>
                              )}

                              {navbar?.term_and_condition_status && (
                                <span className="p-2   items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                  <div className="w-full flex">
                                    <File className="my-auto h-5 w-5 text-muted-foreground" />
                                    <Link
                                      href="/terms-and-conditions"
                                      onClick={() => setIsLoading(!isLoading)}
                                      className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                    >
                                      {showingTranslateValue(
                                        navbar?.term_and_condition,
                                      ) || "Terms & Conditions"}
                                    </Link>
                                  </div>
                                </span>
                              )}

                              <span className="p-2 items-center rounded-md hover:bg-accent w-full hover:text-primary">
                                <div className="w-full flex">
                                  <AlertCircle className="my-auto h-5 w-5 text-muted-foreground" />
                                  <Link
                                    href="/404"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="relative inline-flex items-center ml-2 py-0 rounded text-sm font-medium text-foreground hover:text-primary"
                                  >
                                    404
                                  </Link>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {navbar?.offers_menu_status && (
                      <Link
                        href="/offers"
                        onClick={() => setIsLoading(!isLoading)}
                        className="relative inline-flex items-center py-0 px-2 rounded text-sm font-medium" style={{ backgroundColor: "rgba(221,142,37,0.1)", color: "#dd8e25" }}
                      >
                        {showingTranslateValue(navbar?.offers) || "Offers"}
                        <div className="absolute flex w-3 h-3 left-auto -right-1.5 -top-1.5">
                          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75" style={{ backgroundColor: "#dd8e25" }}></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 border border-white" style={{ backgroundColor: "#EB8B10" }}></span>
                        </div>
                      </Link>
                    )}

                    <Link
                      href="/flash-sale"
                      onClick={() => setIsLoading(!isLoading)}
                      className="relative inline-flex items-center py-0 px-2 rounded text-sm font-medium" style={{ backgroundColor: "#F8E6D0", color: "#EB8B10" }}
                    >
                      ⚡ Flash Sale
                      <div className="absolute flex w-3 h-3 left-auto -right-1.5 -top-1.5">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75" style={{ backgroundColor: "#EB8B10" }}></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 border border-white" style={{ backgroundColor: "#dd8e25" }}></span>
                      </div>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-foreground">
            <SelectLanguage data={languages} />

            {navbar?.privacy_policy_status && (
              <Link
                onClick={() => setIsLoading(!isLoading)}
                href="/privacy-policy"
                className="py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {showingTranslateValue(navbar?.privacy_policy) ||
                  "Privacy Policy"}
              </Link>
            )}
            {navbar?.term_and_condition_status && (
              <Link
                onClick={() => setIsLoading(!isLoading)}
                href="/terms-and-conditions"
                className="py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {showingTranslateValue(navbar?.term_and_condition) ||
                  "Terms & Conditions"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromo;
