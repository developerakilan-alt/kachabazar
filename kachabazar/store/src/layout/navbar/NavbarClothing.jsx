import Link from "next/link";

//internal imports
import NavbarPromoClothing from "@layout/navbar/NavbarPromoClothing";
import SearchInput from "@components/navbar/SearchInput";
import NavbarIconsClothing from "@components/navbar/NavbarIconsClothing";
import MobileNavIconsClothing from "@components/navbar/MobileNavIconsClothing";
import { getShowingLanguage } from "@services/SettingServices";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingThemes, getDefaultTheme } from "@services/ThemeServices";
import Image from "next/image";
import SelectLayout from "@components/form/SelectLayout";

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
  const clothingContainer =
    "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10";

  return (
    <div className="sticky z-40 top-0 w-full">
      {/* Announcement Bar — Slim, elegant */}
      <div className="hidden lg:block bg-black text-white">
        <div className={clothingContainer}>
          <div className="py-1.5 text-xs flex justify-between items-center">
            <a
              href="mailto:hautecouturejewellery@gmail.com"
              className="tracking-[0.25em] uppercase text-[10px] font-light text-neutral-400 hover:text-white transition-colors"
            >
              SUPPORT: hautecouturejewellery@gmail.com
            </a>
            <div className="flex items-center gap-5 text-neutral-500">
              <SelectLayout currentLayout={storeLayout} size="text-[10px]" />
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
      <header className="bg-black">
        <div className={clothingContainer}>
          {/* Mobile layout: [left icons] [logo center] [right icons] */}
<div className="flex sm:hidden h-16 items-center gap-2">
  <MobileNavIconsClothing
    categories={categories}
    categoryError={categoryError}
    storeCustomization={storeCustomization}
  />
</div>

{/* Mobile Search Bar */}
<div className="flex sm:hidden px-4 pb-3">
  <SearchInput variant="dark" />
</div>
          {/* Desktop layout: [logo left] [search center] [icons right] */}
          <div className="hidden sm:flex relative h-16 items-center justify-between gap-6">
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
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <SearchInput variant="dark" />
            </div>
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

    </div>
  );
};

export default NavbarClothing;
