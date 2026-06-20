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

  const sliderImages = [
    { src: slider?.first_img, label: slider?.first_title?.en || "Slide 1" },
    { src: slider?.second_img, label: slider?.second_title?.en || "Slide 2" },
    { src: slider?.third_img, label: slider?.third_title?.en || "Slide 3" },
    { src: slider?.four_img, label: slider?.four_title?.en || "Slide 4" },
    { src: slider?.five_img, label: slider?.five_title?.en || "Slide 5" },
  ].filter((item) => item.src);

  const categoryImages = categories
    .slice(0, 6)
    .map((cat) => ({
      src: getCategoryProductImage(cat, products),
      name: cat.name?.en || "",
    }))
    .filter((item) => item.src);

  const defaultImage = slider?.first_img || "/slider/slider-1.jpg";

  const images = sliderImages.length > 0
    ? sliderImages
    : categoryImages.length > 0
      ? categoryImages
      : [{ src: defaultImage, name: "" }];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : 0,
    );
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  return (
    <div className="relative order-1 lg:order-2 min-h-[300px] lg:min-h-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
      {images.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={item.name || item.label || ""}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50/80 dark:to-neutral-900/80 lg:hidden" />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
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
