import Link from "next/link";
import React from "react";

//internal import

import { getStoreCustomizationSetting } from "@services/SettingServices";
import { showingTranslateValue } from "@lib/translate";

const Banner = async ({}) => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();
  const home = storeCustomizationSetting?.home;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className=" text-xl">
            <span className="text-primary dark:text-muted-foreground font-bold">
              {showingTranslateValue(home?.promotion_title)}
            </span>{" "}
          </h1>

          <p className="text-muted-foreground dark:text-muted-foreground">
            {showingTranslateValue(home?.promotion_description)}
          </p>
        </div>
        <Link
          href={`${home?.promotion_button_link}`}
          className="text-sm font-medium px-6 py-2 bg-primary text-center rounded-full text-primary-foreground hover:bg-primary/90"
        >
          {showingTranslateValue(home?.promotion_button_name)}
        </Link>
      </div>
    </>
  );
};

export default Banner;
