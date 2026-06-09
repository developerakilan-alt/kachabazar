//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";
import { getShowingCategory } from "@services/CategoryService";
import CategoryNavigateButton from "@components/category/CategoryNavigateButton";
import { getCategoryProductImage } from "@utils/categoryProductImages";

const FeatureCategory = async ({ categories: initialCategories, products = [] } = {}) => {
  const result = initialCategories
    ? { categories: initialCategories, error: null }
    : await getShowingCategory();
  const { categories, error } = result;

  return (
    <>
      {error ? (
        <CMSkeletonTwo count={10} height={20} error={error} loading={false} />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
          {categories?.filter(c => c?.name?.en && c.name.en !== "Uncategorized")?.map((category, i) => {
            const categoryImage = getCategoryProductImage(category, products);

            return (
            <li className="group" key={i + 1}>
              <div className="relative flex min-h-[150px] w-full overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-md group-hover:border-primary/40">
                <img
                  src={categoryImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
                <div className="relative flex items-end p-4 [&_a]:!text-white/85 [&_h3]:!text-white [&_svg]:!text-white/85">
                  <CategoryNavigateButton
                    category={{
                      ...category,
                      name: category.name,
                      description: category.description,
                    }}
                    // showingTranslateValue={showingTranslateValue}
                  />
                </div>
              </div>
            </li>
          );
          })}
        </ul>
      )}
    </>
  );
};

export default FeatureCategory;
