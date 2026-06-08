import { Suspense } from "react";
import { cookies } from "next/headers";

//internal import
import StickyCart from "@components/cart/StickyCart";
import HomeDefault from "@components/home/HomeDefault";
import HomeModern from "@components/home/HomeModern";
import HomeMinimal from "@components/home/HomeMinimal";
import HomeClothing from "@components/home/HomeClothing";
import HomeElectronic from "@components/home/HomeElectronic";
import { getStoreProducts } from "@lib/actions/product.actions";
import { getAttributes } from "@lib/actions/attribute.actions";
import { getCategories } from "@lib/actions/category.actions";
import {
  getGlobalSettings,
  getCustomizationSettings,
} from "@lib/actions/settings.actions";
import { getFeaturedCampaign } from "@lib/actions/campaign.actions";

const Home = async ({ searchParams }) => {
  const [
    { attributes },
    { storeCustomizationSetting, error: storeCustomizationError },
    { popularProducts, discountedProducts, error },
    { globalSetting },
    { categories },
    featuredCampaignResult,
  ] = await Promise.all([
    getAttributes(),
    getCustomizationSettings(),
    getStoreProducts({ category: "", title: "" }),
    getGlobalSettings(),
    getCategories(),
    getFeaturedCampaign(),
  ]);

  // Read layout from cookie first, then query param, then admin setting
  const params = await searchParams;
  const cookieStore = await cookies();
  const layout =
    cookieStore.get("_store_layout")?.value ||
    params?.layout ||
    globalSetting?.store_layout ||
    "default";

  const layoutProps = {
    popularProducts,
    discountedProducts,
    attributes,
    storeCustomizationSetting,
    storeCustomizationError: error || storeCustomizationError,
    globalSetting,
    categories,
    featuredCampaign: featuredCampaignResult?.campaign || null,
  };

  return (
    <>
      {layout === "modern" && <HomeModern {...layoutProps} />}
      {layout === "minimal" && <HomeMinimal {...layoutProps} />}
      {layout === "clothing" && <HomeClothing {...layoutProps} />}
      {layout === "electronic" && <HomeElectronic {...layoutProps} />}
      {(layout === "default" ||
        !["modern", "minimal", "clothing", "electronic"].includes(layout)) && (
        <HomeDefault {...layoutProps} />
      )}
    </>
  );
};

export default Home;
