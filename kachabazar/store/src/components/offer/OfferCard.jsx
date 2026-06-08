//internal import
import { cookies } from "next/headers";
import Coupon from "@components/coupon/Coupon";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const OfferCard = async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("_lang")?.value || "en";
  const showingTranslateValue = (data) => {
    if (!data) return "";
    return data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.en || "";
  };
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  return (
    <div className="w-full group">
      <div className="bg-card h-full border border-primary/30 transition duration-150 ease-linear transform group-hover:border-primary rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary/10 dark:bg-primary/20 text-foreground px-6 py-2 border-b border-primary/20 flex items-center justify-center">
          <h3 className="text-base font-medium">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.discount_title,
            )}
          </h3>
        </div>
        <div className="overflow-hidden">
          <Coupon couponInHome />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
