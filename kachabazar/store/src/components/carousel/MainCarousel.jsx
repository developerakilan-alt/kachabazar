//internal import

import { cookies } from "next/headers";
import CarouselCard from "@components/carousel/CarouselCard";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const MainCarousel = async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("_lang")?.value || "en";
  const showingTranslateValue = (data) => {
    if (!data) return "";
    return data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.en || "";
  };
  const showingUrl = (data) => (data !== undefined ? data : "!#");
  const showingImage = (data) => data !== undefined && data;

  const { storeCustomizationSetting } = await getStoreCustomizationSetting();
  const slider = storeCustomizationSetting?.slider;

  const sliderData = [
    {
      id: 1,

      title: showingTranslateValue(slider?.first_title),
      info: showingTranslateValue(slider?.first_description),
      buttonName: showingTranslateValue(slider?.first_button),
      url: showingUrl(slider?.first_link),
      image: showingImage(slider?.first_img) || "/slider/slider-1.jpg",
    },
    {
      id: 2,
      title: showingTranslateValue(slider?.second_title),
      info: showingTranslateValue(slider?.second_description),
      buttonName: showingTranslateValue(slider?.second_button),
      url: showingUrl(slider?.second_link),
      image: showingImage(slider?.second_img) || "/slider/slider-2.jpg",
    },
    {
      id: 3,
      title: showingTranslateValue(slider?.third_title),
      info: showingTranslateValue(slider?.third_description),
      buttonName: showingTranslateValue(slider?.third_button),
      url: showingUrl(slider?.third_link),
      image: showingImage(slider?.third_img) || "/slider/slider-3.jpg",
    },
    {
      id: 4,
      title: showingTranslateValue(slider?.four_title),
      info: showingTranslateValue(slider?.four_description),
      buttonName: showingTranslateValue(slider?.four_button),
      url: showingUrl(slider?.four_link),
      image: showingImage(slider?.four_img) || "/slider/slider-1.jpg",
    },
    {
      id: 5,
      title: showingTranslateValue(slider?.five_title),
      info: showingTranslateValue(slider?.five_description),
      buttonName: showingTranslateValue(slider?.five_button),
      url: showingUrl(slider?.five_link),
      image: showingImage(slider?.five_img) || "/slider/slider-2.jpg",
    },
  ];

  return (
    <>
      <CarouselCard
        sliderData={sliderData}
        storeCustomizationSetting={storeCustomizationSetting}
      />
    </>
  );
};

export default MainCarousel;
