export const getDefaultVariant = (product, attributes) => {
  if (!product?.isCombination || !product?.variants?.length) return {};

  const ropeAttr = attributes?.find((a) => a.type === "rope");
  const ropeVariantId = ropeAttr?.variants?.find((v) => {
    const name = v.name?.en || Object.values(v.name || {})[0] || "";
    return name.toLowerCase() === "rope";
  })?._id;

  return (
    (ropeVariantId &&
      product.variants.find((v) => v[ropeAttr._id] === ropeVariantId)) ||
    product.variants.find((v) => Number(v?.quantity) > 0) ||
    product.variants[0] ||
    {}
  );
};
