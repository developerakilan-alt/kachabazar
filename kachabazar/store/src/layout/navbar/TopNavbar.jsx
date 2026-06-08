import React from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";

//internal imports
import LogoutButton from "./LogoutButton";
import { showingTranslateValue } from "@lib/translate";
import SelectLanguage from "@components/form/SelectLanguage";
import TopNavbarTheme from "./TopNavbarTheme";
import SelectLayout from "@components/form/SelectLayout";
import { getShowingLanguage } from "@services/SettingServices";
import { getShowingThemes, getDefaultTheme } from "@services/ThemeServices";
import { getGlobalSettings } from "@lib/actions/settings.actions";

const TopNavbar = async ({ storeCustomization }) => {
  const navbar = storeCustomization?.navbar;

  const [
    { languages },
    { themes },
    { theme: defaultTheme },
    { globalSetting },
  ] = await Promise.all([
    getShowingLanguage(),
    getShowingThemes(),
    getDefaultTheme(),
    getGlobalSettings(),
  ]);

  const storeLayout = globalSetting?.store_layout || "default";

  return (
    <div className="hidden lg:block" style={{ backgroundColor: "#D8A360" }}>
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="py-2 font-sans text-xs font-medium flex justify-between items-center text-white">
          <span className="flex items-center">
            <FiPhoneCall className="mr-2" />
            <strong>FREE Shipping</strong>&nbsp;All Over The Website
          </span>

          <div className="lg:text-right flex items-center navBar">
            <a
              href="mailto:hautecouturejewellery@gmail.com"
              className="font-medium hover:text-white/80"
            >
              SUPPORT: hautecouturejewellery@gmail.com
            </a>

            <span className="mx-3">|</span>

            <LogoutButton storeCustomization={storeCustomization} />

            <div className="flex items-center ml-4 gap-2 border-l border-white/30 pl-4">
              <SelectLanguage data={languages} size="text-xs" />
              <TopNavbarTheme
                themes={themes}
                defaultTheme={defaultTheme}
                size="text-xs"
              />
              <SelectLayout currentLayout={storeLayout} size="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
