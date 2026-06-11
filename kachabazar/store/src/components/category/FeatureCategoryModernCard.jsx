"use client";

import { useRouter } from "next/navigation";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getCategoryProductImage } from "@utils/categoryProductImages";

const FeatureCategoryModernCard = ({ category, bgClass, products = [] }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, categoryName) => {
    const category_name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    router.push(url);
  };

  const catName = showingTranslateValue(category?.name) || "Category";

  // Only use true product counts if available from the backend, DO NOT use children length as they are subcategories
  const itemQty = category?.products?.length || category?.productCount;
  const formattedCount = itemQty ? (itemQty < 10 ? `0${itemQty}` : itemQty) : null;
  const categoryImage = getCategoryProductImage(category, products);

  return (
    <li className="group h-full list-none">
      <div 
        onClick={() => handleCategoryClick(category._id, showingTranslateValue(category?.name))}
        className={`relative flex flex-col items-center justify-end w-full h-[180px] overflow-hidden rounded-2xl bg-gradient-to-b ${bgClass} to-white dark:to-background cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-4 border border-border/30`}
      >
        <img
          src={categoryImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
        <div className="relative text-center w-full">
          <h3 className="text-[15px] font-semibold text-white line-clamp-1 mb-1 transition-colors drop-shadow">
            {catName}
          </h3>
          <p className="text-[11px] font-medium text-white/80">
            {formattedCount ? `${formattedCount} Product` : "\u00A0"}
          </p>
        </div>
      </div>
    </li>
  );
};

export default FeatureCategoryModernCard;
