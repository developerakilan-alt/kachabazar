import React from "react";
import Link from "next/link";

const ModernBanner = ({ storeCustomizationSetting, globalSetting }) => {
  const t = (obj) => obj?.en || obj || "";
  const home = storeCustomizationSetting?.home || {};

  const bannerCards = [
    {
      title: t(home?.promotion_title) || "Special Offer",
      desc: t(home?.promotion_description) || "Sign up today and get instant savings.",
      link: home?.promotion_button_link || "/register",
      btnLabel: t(home?.promotion_button_name) || "Shop Now",
      gradient: "from-[#dcfce7] to-white dark:from-emerald-950/20 dark:to-background",
    },
    {
      title: t(home?.quick_delivery_title) || "Free Delivery",
      desc: t(home?.quick_delivery_description) || "Save more with free delivery on orders.",
      link: home?.quick_delivery_link || "/search",
      btnLabel: t(home?.quick_delivery_button) || "Order Now",
      gradient: "from-[#ffe4e6] to-white dark:from-rose-950/20 dark:to-background",
    },
    {
      title: t(home?.feature_title) || "Fresh Groceries",
      desc: t(home?.feature_description) || "Everything you need delivered to your door.",
      link: "/search",
      btnLabel: "Browse All",
      gradient: "from-[#fef9c3] to-white dark:from-yellow-900/20 dark:to-background",
    },
  ];

  return (
    <div className="bg-background pt-0 pb-12">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannerCards.map((card, i) => (
            <div
              key={i}
              className={`group relative flex flex-col justify-between w-full rounded-2xl bg-gradient-to-b ${card.gradient} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 lg:p-6 border border-border/30 min-h-[260px]`}
            >
              <div className="flex flex-col items-center text-center z-10 w-full mb-4">
                <h3 className="text-base lg:text-md font-bold text-gray-800 dark:text-gray-100 leading-tight mb-2 uppercase tracking-wide">
                  {card.title}
                </h3>
                {home?.quick_delivery_img && (
                  <img
                    src={home.quick_delivery_img}
                    alt={card.title}
                    className="w-full h-auto max-h-32 transition-transform duration-500 rounded-lg group-hover:scale-105 my-2 object-contain"
                  />
                )}
              </div>
              <div className="flex items-end justify-between w-full z-10">
                <p className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm max-w-[70%]">
                  {card.desc}
                </p>
                <Link
                  href={card.link}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors shrink-0 flex-none shadow-lg bg-foreground text-background hover:opacity-90"
                >
                  <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernBanner;
