"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategoryProductImage } from "@utils/categoryProductImages";

const CategorySlideshow = ({
  categories = [],
  products = [],
  storeCustomizationSetting,
}) => {
  const slider = storeCustomizationSetting?.slider;
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = categories
    .slice(0, 6)
    .map((cat) => ({
      src: getCategoryProductImage(cat, products),
      name: cat.name?.en || "",
    }))
    .filter((item) => item.src);

  const defaultImage = slider?.first_img || "/slider/slider-1.jpg";

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0,
    );
  }, [allImages.length]);

  useEffect(() => {
    if (allImages.length < 2) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [allImages.length, nextSlide]);

  const images =
    allImages.length > 0
      ? allImages
      : [{ src: defaultImage, name: "" }];

  return (
    <div className="relative order-1 lg:order-2 min-h-[300px] lg:min-h-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
      {images.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={item.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50/80 dark:to-neutral-900/80 lg:hidden" />
      {allImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySlideshow;
