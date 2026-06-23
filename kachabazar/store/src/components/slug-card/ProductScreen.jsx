"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronRight, Minus, Plus } from "lucide-react";

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
import { FiChevronRight, FiHeadphones, FiMinus, FiPlus } from "react-icons/fi";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect } from "react";

const ProductScreen = ({ product, reviews, attributes, relatedProducts }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { item, setItem } = useAddToCart();
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
    // actions
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
    {
      label: "SKU",
      value: hasVariants ? selectVariant?.sku : product?.sku,
    },
    {
      label: "Barcode",
      value: hasVariants ? selectVariant?.barcode : product?.barcode,
    },
    { label: "Category", value: category_display_name },
    {
      label: "Availability",
      value: isOutOfStock ? "Stock out" : `${availableStock} in stock`,
    },
  ].filter((detail) => detail.value);

  useEffect(() => {
    if (!isOutOfStock && item > availableStock) {
      setItem(availableStock);
    }
  }, [availableStock, isOutOfStock, item, setItem]);

  // console.log("discount", discount);

  return (
    <>
      <div className="bg-background px-0">
        <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
          <div className="flex items-center py-4 lg:py-6">
            <ol className="flex items-center w-full overflow-hidden text-muted-foreground">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link href="/">Home</Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold ">
                <Link
                  href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                >
                  {category_display_name}
                </Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm px-1 transition duration-200 ease-in ">
                {showingTranslateValue(product?.title)}
              </li>
            </ol>
          </div>
          {/* Product */}
          <div className="relative lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-8 mb-16">
            {/* Product image */}
            <div className="lg:col-span-3 lg:row-end-1">
              {/* Image gallery */}
              <div className="overflow-hidden w-full mx-auto">
                {product?.image?.[0] ? (
                  <Image
                    src={selectedImage || product.image[0]}
                    alt="product"
                    width={500}
                    height={500}
                    priority
                    className="aspect-square w-full rounded-xl bg-muted object-cover"
                  />
                ) : (
                  <Image
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    width={500}
                    height={500}
                    alt="product Image"
                    className="aspect-square w-full rounded-xl bg-muted object-cover"
                  />
                )}
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

            {/* Product details */}
            <div className="lg:sticky top-44 mt-6 lg:mt-0 self-start z-10 mx-auto lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:max-w-none">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div className="relative">
                  <Stock stock={availableStock} />
                </div>
                <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold  text-foreground">
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

              <div>
                <div className="flex items-center mt-4">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 w-full">
                    {/* Quantity Selector */}
                    <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 border-border">
                      <Button
                        variant="outline"
                        onClick={() => setItem(item - 1)}
                        disabled={item === 1}
                        className="border-0 border-e-1 border-border rounded-none flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-foreground hover:text-muted-foreground"
                      >
                        <span className="sm:text-2xl">
                          <Minus />
                        </span>
                      </Button>

                      <p className="font-semibold flex items-center justify-center transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-foreground w-10 md:w-20 xl:w-22">
                        {item}
                      </p>

                      <Button
                        variant="outline"
                        onClick={() => setItem(item + 1)}
                        disabled={!canIncreaseQuantity}
                        className="border-0 border-s-1 border-border rounded-none flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-foreground hover:text-muted-foreground"
                      >
                        <span className="sm:text-2xl">
                          <Plus />
                        </span>
                      </Button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOutOfStock}
                      className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold  text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none px-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 w-full h-11"
                      variant="create"
                    >
                      {isOutOfStock ? "Stock Out" : "Add to Cart"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                    <div>
                      <span className=" font-semibold py-1 text-sm d-block">
                        <span className="text-muted-foreground">Category:</span>{" "}
                        <Link
                          href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                          className="cursor-pointer"
                        >
                          <span className="text-muted-foreground font-medium ml-2 hover:text-primary">
                            {category_display_name}
                          </span>
                        </Link>
                      </span>

                      <Tags product={product} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-3">
                  <FiHeadphones className="mr-1 text-md" />
                  Call Us for Order
                  <a
                    href={`tel:${globalSetting?.contact || "+099949343"}`}
                    className="font-bold text-primary ml-1"
                  >
                    {globalSetting?.contact || "+099949343"}
                  </a>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-sm font-medium text-foreground">
                    Highlights
                  </h3>
                  {/* {productDetails.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-2 rounded-md border border-border bg-muted/30 p-3 text-sm sm:grid-cols-2">
                      {productDetails.map((detail) => (
                        <div key={detail.label} className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {detail.label}
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {detail.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )} */}
                  <div className="mt-4">
                    <span className="hidden">shipping description card</span>
                    <Card storeCustomization={storeCustomization} />
                  </div>
                </div>

              </div>
            </div>
            <div className="mx-auto w-full lg:col-span-3 lg:my-0 my-8 lg:max-w-none">
              <TabGroup>
                <div className="border-b border-border">
                  <TabList className="-mb-px flex space-x-8">
                    {/* <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground hover:border-border focus:outline-0 hover:text-foreground data-selected:border-primary data-selected:text-primary">
                      Customer Reviews
                    </Tab> */}

                    <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground hover:border-border focus:outline-0 hover:text-foreground data-selected:border-primary data-selected:text-primary">
                      Description
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                  {/* <TabPanel className="-mb-10">
                    <h3 className="sr-only">Customer Reviews</h3>
                    <ProductReviews reviews={reviews} />
                  </TabPanel> */}
                  <TabPanel className="pt-8">
                    <h3 className="sr-only">Product Description</h3>
                    <p className="text-sm leading-6 text-muted-foreground md:leading-6 mb-3">
                      {isReadMore
                        ? showingTranslateValue(product?.description)?.slice(
                            0,
                            150,
                          )
                        : showingTranslateValue(product?.description)}
                    </p>
                    <div className="text-sm text-muted-foreground [&_h4]:mt-5 [&_h4]:font-medium [&_h4]:text-foreground [&_li]:pl-2 [&_li::marker]:text-muted-foreground [&_p]:my-2 [&_p]:text-sm/6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm/6 [&>:first-child]:mt-0" />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
          {/* related products */}
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
    </>
  );
};

export default ProductScreen;
