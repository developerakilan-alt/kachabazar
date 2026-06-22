const CategorySlideshow = ({
  categories = [],
  products = [],
  storeCustomizationSetting,
}) => {
  const slider = storeCustomizationSetting?.slider;

  const imageSrc =
    slider?.first_img ||
    (categories.length > 0
      ? categories[0]?.image ||
        `/api/category/image/${categories[0]?._id}`
      : "/slider/slider-1.jpg");

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 my-4 rounded-xl overflow-hidden">
      <img
        src={imageSrc}
        alt="Banner"
        className="w-full h-auto object-contain bg-neutral-200 dark:bg-neutral-800"
      />
    </div>
  );
};

export default CategorySlideshow;
