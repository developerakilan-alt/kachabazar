"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronRight, Minus, Plus, Heart, ShieldCheck, RotateCcw, Award } from "lucide-react";

//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Tags from "@components/common/Tags";
import Card from "@components/slug-card/Card";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@components/common/Discount";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ImageCarousel from "@components/carousel/ImageCarousel";
import { useSetting } from "@context/SettingContext";
import useProductAction from "@hooks/useProductAction";
import Rating from "@components/common/Rating";
import { Button } from "@components/ui/button";
import ProductReviews from "./ProductReviews";
import { FiChevronRight, FiMinus, FiPlus, FiHeart, FiHome, FiGrid, FiShoppingBag, FiUser } from "react-icons/fi";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProductScreen = ({ product, reviews, attributes, relatedProducts }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { item, setItem } = useAddToCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();

  const {
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
    setSelectVa,
    variantTitle,
    category_name,
    category_display_name,
    handleAddToCart,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
  });

  const hasVariants =
    product?.isCombination === true && variantTitle?.length > 0;
  const productLevelStock = Number(product?.stock ?? product?.quantity ?? 0);
  const availableStock = Number(
    hasVariants ? stock || 0 : stock || productLevelStock || 0,
  );
  const isOutOfStock = availableStock <= 0;
  const canIncreaseQuantity = !isOutOfStock && item < availableStock;

  const productDetails = [
    { label: "Product", value: showingTranslateValue(product?.title) },
    { label: "SKU", value: hasVariants ? selectVariant?.sku : product?.sku },
    { label: "Barcode", value: hasVariants ? selectVariant?.barcode : product?.barcode },
    { label: "Category", value: category_display_name },
    { label: "Availability", value: isOutOfStock ? "Stock out" : `${availableStock} in stock` },
  ].filter((detail) => detail.value);

  useEffect(() => {
    if (!isOutOfStock && item > availableStock) {
      setItem(availableStock);
    }
  }, [availableStock, isOutOfStock, item, setItem]);

  return (
    <>
      <div className="bg-background px-0 pb-20 lg:pb-0">
        <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 lg:py-6">
            <ol className="flex items-center w-full overflow-hidden text-muted-foreground">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link href="/">Home</Link>
              </li>
              <li className="text-sm mt-[1px]"><FiChevronRight /></li>
              <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link href={`/search?category=${category_name}&_id=${product?.category?._id}`}>
                  {category_display_name}
                </Link>
              </li>
              <li className="text-sm mt-[1px]"><FiChevronRight /></li>
              <li className="text-sm px-1 transition duration-200 ease-in">
                {showingTranslateValue(product?.title)}
              </li>
            </ol>
          </div>

          {/* Product */}
          <div className="relative lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-8 mb-16">

            {/* Product Image */}
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="overflow-hidden w-full mx-auto relative">
                {product?.image?.[0] ? (
                  <Image
                    src={selectedImage || product.image[0]}
                    alt="product"
                    width={500}
                    height={500}
                    priority
                    className="aspect-square w-full rounded-2xl bg-muted object-cover"
                  />
                ) : (
                  <Image
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    width={500}
                    height={500}
                    alt="product Image"
                    className="aspect-square w-full rounded-2xl bg-muted object-cover"
                  />
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-white text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                    {discount?.toFixed(2)}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-all hover:scale-110"
                  aria-label="Add to wishlist"
                >
                  <FiHeart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
              </div>

              {product?.image?.length > 1 && (
                <div className="flex flex-row flex-wrap mt-4">
                  <ImageCarousel
                    images={product.image}
                    handleChangeImage={setSelectedImage}
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:sticky top-44 mt-6 lg:mt-0 self-start z-10 mx-auto lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:max-w-none">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div className="relative">
                  <Stock stock={availableStock} />
                </div>
                <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold text-foreground">
                  {showingTranslateValue(product?.title)}
                </h1>
                <div className="flex gap-0.5 items-center mt-1">
                  <Rating
                    size="md"
                    showReviews={true}
                    rating={product?.average_rating}
                    totalReviews={product?.total_reviews}
                  />
                </div>
              </div>

              <div className="flex items-center mb-8">
                <Price
                  price={price}
                  product={product}
                  originalPrice={originalPrice}
                />
                <span className="ml-2 block">
                  <Discount slug product={product} discount={discount} />
                </span>
              </div>

              {/* Variants */}
              <div className="mb-6">
                {variantTitle?.map((a, i) => (
                  <span key={a._id} className="mb-2 block">
                    <h4 className="text-sm py-1 text-foreground font-medium">
                      {showingTranslateValue(a?.name)}:
                    </h4>
                    <VariantList
                      att={a._id}
                      option={a.option}
                      setValue={setValue}
                      varTitle={variantTitle}
                      setSelectVa={setSelectVa}
                      variants={product.variants}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                    />
                  </span>
                ))}
              </div>

              {/* Quantity + Add to Cart */}
              <div>
                <div className="flex items-center mt-4">
                  <div className="flex items-center gap-4 w-full">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between rounded-full overflow-hidden flex-shrink-0 border h-12 border-border px-2 gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setItem(item - 1)}
                        disabled={item === 1}
                        className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <p className="font-semibold text-base text-foreground w-8 text-center">
                        {item}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => setItem(item + 1)}
                        disabled={!canIncreaseQuantity}
                        className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Add to Cart Button — Gold */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOutOfStock}
                      className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}
                    >
                      <FiShoppingBag className="w-4 h-4" />
                      {isOutOfStock ? "Stock Out" : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-3 border border-amber-100 rounded-2xl p-4 bg-amber-50/50">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">Premium Quality</span>
                    <span className="text-[10px] text-muted-foreground">Finest craftsmanship</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">Secure Payment</span>
                    <span className="text-[10px] text-muted-foreground">100% safe & secure</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">Easy Returns</span>
                    <span className="text-[10px] text-muted-foreground">Hassle free returns</span>
                  </div>
                </div>

                {/* Category & Tags */}
                <div className="flex items-center mt-4">
                  <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                    <div>
                      <span className="font-semibold py-1 text-sm d-block">
                        <span className="text-muted-foreground">Category:</span>{" "}
                        <Link
                          href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                          className="cursor-pointer"
                        >
                          <span className="text-amber-700 font-medium ml-2 hover:text-amber-900">
                            {category_display_name}
                          </span>
                        </Link>
                      </span>
                      <Tags product={product} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-sm font-medium text-foreground">Highlights</h3>
                  <div className="mt-4">
                    <Card storeCustomization={storeCustomization} />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Tab */}
            <div className="mx-auto w-full lg:col-span-3 lg:my-0 my-8 lg:max-w-none">
              <TabGroup>
                <div className="border-b border-border">
                  <TabList className="-mb-px flex space-x-8">
                    <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground hover:border-border focus:outline-0 hover:text-foreground data-selected:border-amber-600 data-selected:text-amber-700">
                      Description
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                  <TabPanel className="pt-8">
                    <h3 className="sr-only">Product Description</h3>
                    <p className="text-sm leading-6 text-muted-foreground md:leading-6 mb-3">
                      {isReadMore
                        ? showingTranslateValue(product?.description)?.slice(0, 150)
                        : showingTranslateValue(product?.description)}
                    </p>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts?.length >= 2 && (
            <div className="pt-10 lg:pt-16 lg:pb-10 mt-8 border-t border-border">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl mb-6">
                Related Products
              </h3>
              <div className="flex">
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                    {relatedProducts?.slice(1, 13).map((product, i) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        attributes={attributes}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar — Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex lg:hidden">
        <Link href="/" className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-amber-700">
          <FiHome className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/search" className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-muted-foreground">
          <FiGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        <Link href="/user/my-account" className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-muted-foreground">
          <FiHeart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Wishlist</span>
        </Link>
        <Link href="/user/my-orders" className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-muted-foreground">
          <FiShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link href="/user/my-account" className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-muted-foreground">
          <FiUser className="w-5 h-5" />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </>
  );
};

export default ProductScreen;