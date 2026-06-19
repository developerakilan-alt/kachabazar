"use client";

import { useRouter } from "next/navigation";

//internal import

import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryNavigateButton = ({ category }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  // console.log("category", category);

  const handleCategoryClick = (id, categoryName) => {
    // console.log("handleCategoryClick", categoryName);

    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    router.push(url);
  };

  return (
    <>
      <div className="pl-8 pb-4">
        <h3
          onClick={() =>
            handleCategoryClick(
              category._id,
              showingTranslateValue(category?.name)
            )
          }
          className="text-2xl font-bold text-white drop-shadow-lg hover:text-[#D4AF37] leading-tight line-clamp-2 group-hover transition-colors duration-300"
        >
          {showingTranslateValue(category?.name)}
        </h3>
      </div>
    </>
  );
};

export default CategoryNavigateButton;
