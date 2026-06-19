import Link from "next/link";

//internal imports
import NavbarPromoClothing from "@layout/navbar/NavbarPromoClothing";
import SearchInput from "@components/navbar/SearchInput";
import NavbarIconsClothing from "@components/navbar/NavbarIconsClothing";
import { getShowingLanguage } from "@services/SettingServices";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingThemes, getDefaultTheme } from "@services/ThemeServices";
import MobileFooter from "@layout/footer/MobileFooter";
import Image from "next/image";

const NavbarClothing = async ({
  globalSetting,
  storeCustomization,
  storeLayout: layoutProp,
}) => {
  const [
    { languages },
    { categories, error: categoryError },
    { themes },
    { theme: defaultTheme },
  ] = await Promise.all([
    getShowingLanguage(),
    getShowingCategory(),
    getShowingThemes(),
    getDefaultTheme(),
  ]);

  const storeLayout = layoutProp || globalSetting?.store_layout || "clothing";
  const categoriesMenuStatus = storeCustomization?.navbar?.categories_menu_status !== false;

  return (
    <div className="sticky z-40 top-0 w-full">
      {/* Announcement Bar — Slim, elegant */}
      <div className="hidden lg:block bg-[#D97706] text-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="py-1.5 text-xs flex justify-between items-center">
            <a
              href="mailto:hautecouturejewellery@gmail.com"
              className="tracking-[0.25em] uppercase text-[10px] font-light text-neutral-400 hover:text-white transition-colors"
            >
              SUPPORT: hautecouturejewellery@gmail.com
            </a>
            <div className="flex items-center gap-5 text-neutral-500">
              {/* <Link
                href="/about-us"
                className="hover:text-white transition-colors text-[11px] tracking-wide"
              >
                About
              </Link> */}
              {/* <Link
                href="/contact-us"
                className="hover:text-white transition-colors text-[11px] tracking-wide"
              >
                Contact
              </Link> */}
              <Link
                href="/user/my-account"
                className="hover:text-white transition-colors text-[11px] tracking-wide"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar — Dark, premium fashion look */}
      <header className="bg-[#D97706]">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="relative flex h-16 items-center justify-between gap-6">
            {/* Logo — use light logo on dark bg */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image
                width={160}
                height={50}
                className="h-10 w-auto max-w-[160px] object-contain"
                priority
                src={storeCustomization?.navbar?.logo || "/logo/logo-light.png"}
                alt="logo"
              />
            </Link>

            {/* Center — Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <SearchInput variant="dark" />
            </div>

            {/* Right — Icons */}
            <NavbarIconsClothing />
          </div>
        </div>
      </header>

      {/* Promo Nav */}
      <NavbarPromoClothing
        languages={languages}
        categories={categories}
        categoryError={categoryError}
        themes={themes}
        defaultTheme={defaultTheme}
        storeLayout={storeLayout}
        categoriesMenuStatus={categoriesMenuStatus}
      />

      <MobileFooter
        categories={categories}
        categoryError={categoryError}
        globalSetting={globalSetting}
      />
    </div>
  );
};

export default NavbarClothing;
