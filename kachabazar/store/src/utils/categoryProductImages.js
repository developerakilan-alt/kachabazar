const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const collectCategoryIds = (category) => {
  const ids = new Set();

  const walk = (item) => {
    const id = getId(item);
    if (id) ids.add(id);
    item?.children?.forEach(walk);
  };

  walk(category);
  return ids;
};

const getProductImage = (product) => {
  const image = Array.isArray(product?.image) ? product.image[0] : product?.image;

  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.src || "";
};

const productBelongsToCategory = (product, categoryIds) => {
  const productCategoryIds = [
    getId(product?.category),
    ...(Array.isArray(product?.categories) ? product.categories.map(getId) : []),
  ].filter(Boolean);

  return productCategoryIds.some((id) => categoryIds.has(id));
};

const getCategoryProductImage = (category, products = []) => {
  const categoryIds = collectCategoryIds(category);
  const matchedProduct = products.find((product) =>
    productBelongsToCategory(product, categoryIds),
  );

  return getProductImage(matchedProduct) || category?.icon || PLACEHOLDER_IMAGE;
};

export { PLACEHOLDER_IMAGE, getCategoryProductImage };
