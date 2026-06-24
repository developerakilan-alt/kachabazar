import Link from "next/link";
import Image from "next/image";

import { getShowingCategory } from "@services/CategoryService";
import { getShowingThemes, getDefaultTheme } from "@services/ThemeServices";
import SearchInput from "@components/navbar/SearchInput";
import NotifyIcon from "@components/navbar/NotifyIcon";
import ProfileDropDown from "@components/navbar/ProfileDropDown";
import MobileFooter from "@layout/footer/MobileFooter";
import NavbarPromoHeritage from "@layout/navbar/NavbarPromoHeritage";

const NavbarHeritage = async ({
  globalSetting,
  storeCustomization,
  storeLayout: layoutProp,
}) => {
  const [
    { categories, error: categoryError },
    { themes },
    { theme: defaultTheme },
  ] = await Promise.all([
    getShowingCategory(),
    getShowingThemes(),
    getDefaultTheme(),
  ]);

  const storeLayout = layoutProp || globalSetting?.store_layout || "heritage";

  return (
    <>
      {/* Hero section — above the navbar */}
      <div className="heritage-hero relative mx-auto max-w-screen-xl px-4 sm:px-10 py-6 lg:py-8 text-center">
        <div className="kolam-border-top mb-4" />
        <div className="relative z-10">
          <div className="inline-block gold-pulse rounded-full px-6 py-1 mb-4 text-xs font-semibold text-[#D4AF37] bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)]">
            ✦ Heritage Collection ✦
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-3 gold-text">
            Hautecouture Jwellery
          </h1>
          <p className="text-lg text-[rgba(212,175,55,0.6)] max-w-2xl mx-auto leading-relaxed">
            Hautecouture Jwellery - Best Imitation Jwellery Online in India
          </p>
        </div>
        <div className="kolam-divider mt-4" />
      </div>

      {/* Sticky navbar */}
      <div className="sticky z-40 top-0 w-full">
        <div className="heritage-navbar">
          {/* Main header */}
          <header className="relative">
            <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
              <div className="relative flex h-20 justify-between items-center">
                {/* Logo */}
                <div className="hidden sm:flex shrink-0">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      width={160}
                      height={50}
                      className="h-10 w-auto max-w-[160px] object-contain"
                      priority
                      src={
                        storeCustomization?.navbar?.logo || "/logo/logo-light.png"
                      }
                      alt="logo"
                    />
                  </Link>
                </div>

                {/* Search */}
                <div className="min-w-0 flex-1 md:px-8 lg:px-10">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none">
                    <div className="w-full">
                      <SearchInput />
                    </div>
                  </div>
                </div>

                {/* Icons */}
                <div className="lg:relative lg:z-10 sm:flex sm:items-center hidden gap-3">
                  {/* <SelectLayout currentLayout={storeLayout} size="text-xs" /> */}
                  <NotifyIcon />
                  <ProfileDropDown />
                </div>
              </div>
            </div>
          </header>

          {/* Bottom promo bar with categories */}
          <NavbarPromoHeritage
            categories={categories}
            categoryError={categoryError}
            themes={themes}
            defaultTheme={defaultTheme}
            storeLayout={storeLayout}
          />
        </div>

        <MobileFooter
          categories={categories}
          categoryError={categoryError}
          globalSetting={globalSetting}
        />
      </div>
    </>
  );
};

export default NavbarHeritage;
