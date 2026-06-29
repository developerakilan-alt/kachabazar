"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SidebarContext } from "@context/SidebarContext";
import useAddToCart from "@hooks/useAddToCart";
import { notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

export default function useProductAction({
  product,
  attributes,
  globalSetting,
  onCloseModal, // optional for modal flow
  withRouter = false, // if true, enable handleMoreInfo
}) {
  const router = useRouter();
  const { setIsLoading, isLoading } = useContext(SidebarContext) || {};
  const { handleAddItem } = useAddToCart();
  const { getNumber, showingTranslateValue } = useUtilsFunction();

  // States
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isReadMore, setIsReadMore] = useState(false);

  const currency = globalSetting?.default_currency || "₹";
  const variantMetaKeys = [
    "_id",
    "id",
    "originalPrice",
    "price",
    "discount",
    "quantity",
    "stock",
    "barcode",
    "sku",
    "productId",
    "image",
    "createdAt",
    "updatedAt",
  ];
  const attributeIds = attributes?.map((att) => att?._id).filter(Boolean) || [];
  const hasUsableVariants =
    product?.isCombination === true &&
    attributeIds.length > 0 &&
    product?.variants?.some((variant) =>
      Object.keys(variant || {}).some(
        (key) =>
          attributeIds.includes(key) &&
          !variantMetaKeys.includes(key) &&
          variant[key],
      ),
    );
  const productStock = getNumber(product?.stock ?? product?.quantity ?? 0);
  const resolvedStock = hasUsableVariants
    ? getNumber(selectVariant?.quantity ?? stock ?? 0)
    : productStock;

  // Handle variant & price updates
  useEffect(() => {
    // console.log('value', value, product);
    if (hasUsableVariants && value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k]),
      );

      const res = result?.map(
        ({
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        }) => ({
          ...rest,
        }),
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {},
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {},
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k]),
      );

      // console.log("result2", result2);

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setSelectedImage(result2?.image);
      setStock(getNumber(result2?.quantity ?? productStock));
      const price = getNumber(result2?.price);
      const originalPrice = getNumber(result2?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100,
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else if (hasUsableVariants) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k]),
      );
      const ropeAttr = attributes?.find((a) => a.type === "rope");
      const ropeVariantId = ropeAttr?.variants?.find((v) => {
        const name = v.name?.en || Object.values(v.name || {})[0] || "";
        return name.toLowerCase() === "rope";
      })?._id;
      const firstVariant =
        (ropeVariantId &&
          product.variants.find((v) => v[ropeAttr._id] === ropeVariantId)) ||
        product.variants.find((variant) => getNumber(variant?.quantity) > 0) ||
        product.variants[0] ||
        {};

      setVariants(result);
      setStock(getNumber(firstVariant?.quantity ?? productStock));
      setSelectVariant(firstVariant);
      setSelectVa(firstVariant);
      setSelectedImage(firstVariant?.image || product?.image?.[0] || null);
      const price = getNumber(firstVariant?.price ?? product?.prices?.price);
      const originalPrice = getNumber(
        firstVariant?.originalPrice ?? product?.prices?.originalPrice,
      );
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100,
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      setStock(productStock);
      setSelectedImage(product?.image?.[0] || null);
      const price = getNumber(product?.prices?.price);
      const originalPrice = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100,
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.quantity,
    product?.stock,
    product?.variants,
    product?.isCombination,
    selectVa,
    selectVariant,
    value,
    productStock,
    hasUsableVariants,
  ]);

  // Handle variant title mapping
  useEffect(() => {
    if (!hasUsableVariants || !attributes) {
      setVariantTitle([]);
      return;
    }
    const res = Object.keys(Object.assign({}, ...product?.variants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    setVariantTitle(varTitle?.sort());
  }, [variants, attributes, product?.variants, hasUsableVariants]);

  // Add to cart
  const handleAddToCart = (productOrQuantity) => {
    // Accept either a quantity number or legacy product object (backward compatible)
    const quantity =
      typeof productOrQuantity === "number" ? productOrQuantity : 1;

    if (
      hasUsableVariants &&
      product?.variants?.length === 1 &&
      product?.variants[0].quantity < 1
    )
      return notifyError("Insufficient stock");
    if (resolvedStock <= 0) return notifyError("Insufficient stock");

    const selectedVariantName = variantTitle
      ?.map((att) =>
        att?.variants?.find((v) => v._id === selectVariant[att._id]),
      )
      .map((el) => showingTranslateValue(el?.name));

    const hasSelectedVariant =
      !hasUsableVariants ||
      product?.variants?.some(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString(),
      );

    if (hasSelectedVariant) {
      const { variants, categories, description, ...updatedProduct } = product;
      // slug is kept in updatedProduct so cart items can link to product pages
      const newItem = {
        ...updatedProduct,
        id:
          !hasUsableVariants
            ? product._id
            : product._id +
              "-" +
              variantTitle?.map((att) => selectVariant[att._id]).join("-"),
        title:
          !hasUsableVariants
            ? showingTranslateValue(product.title)
            : showingTranslateValue(product.title) + "-" + selectedVariantName,
        image: selectedImage,
        variant: hasUsableVariants
          ? selectVariant || {}
          : product?.prices || {},
        price:
          !hasUsableVariants
            ? getNumber(product.prices.price)
            : getNumber(price),
        originalPrice:
          !hasUsableVariants
            ? getNumber(product.prices.originalPrice)
            : getNumber(originalPrice),
        stock: resolvedStock,
      };

      handleAddItem(newItem, quantity);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  // Optional for modal/product detail routing
  const handleMoreInfo = (slug) => {
    if (!withRouter) return;
    if (onCloseModal) onCloseModal();
    router.push(`/product/${slug}`);
    setIsLoading?.(!isLoading);
  };

  // Display name for the category (human-readable)
  const category_display_name =
    showingTranslateValue(product?.category?.name) || "";

  // URL-safe slug for category links
  const category_name = category_display_name
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");

  return {
    // state
    value,
    setValue,
    price,
    stock,
    discount,
    isReadMore,
    setIsReadMore,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    variantTitle,
    variants,
    currency,
    category_name,
    category_display_name,

    // actions
    handleAddToCart,
    handleMoreInfo,
  };
}
