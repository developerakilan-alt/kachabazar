"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Headphones,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

//internal import
import Price from "@components/common/Price";
import Tags from "@components/common/Tags";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@components/common/Discount";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Rating from "@components/common/Rating";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import Stock from "@components/common/Stock";
import useProductAction from "@hooks/useProductAction";
import { useSetting } from "@context/SettingContext";
import {
  FiEye,
  FiHeadphones,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import MainModal from "./MainModal";

const ProductModal = ({ product, modalOpen, attributes, setModalOpen }) => {
  const { globalSetting } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { item, setItem, totalItems, handleAddItem, handleIncreaseQuantity } =
    useAddToCart();
  const {
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
    category_name,

    // actions
    handleAddToCart,
    handleMoreInfo,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
    onCloseModal: () => setModalOpen(false),
    withRouter: true,
  });

  return (
    <>
      <MainModal
        modalOpen={modalOpen}
        bottomCloseBtn={false}
        handleCloseModal={() => setModalOpen(false)}
      >
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="lg:flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
            <Link
              href={`/product/${product.slug}`}
              passHref
              className="w-full lg:w-[40%]"
            >
              <div
                onClick={() => setModalOpen(false)}
                className="flex-shrink-0 flex items-center justify-center h-auto cursor-pointer"
              >
                {(() => {
                  const mSrc = selectedImage || product.image?.[0] || "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";
                  return (
                    <img
                      src={mSrc}
                      width={420}
                      height={420}
                      alt="product"
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = "true";
                          e.target.src = "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";
                        }
                      }}
                    />
                  );
                })()}
              </div>
            </Link>

            <div className="w-full lg:w-[60%] pt-6 lg:pt-0 lg:pl-7 xl:pl-10">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div
                  className={`${
                    stock <= 0 ? "relative py-1 mb-2" : "relative"
                  }`}
                >
                  <Stock In stock={stock} />
                </div>
                <Link href={`/product/${product.slug}`}>
                  <h2
                    onClick={() => setModalOpen(false)}
                    className="text-foreground text-lg md:text-xl lg:text-xl font-medium hover:text-primary cursor-pointer"
                  >
                    {showingTranslateValue(product?.title)}
                  </h2>
                </Link>
                <div className="flex gap-0.5 items-center mt-1">
                  {/* Rating */}
                  <Rating
                    size="md"
                    showReviews={true}
                    rating={product?.average_rating}
                    totalReviews={product?.total_reviews}
                  />
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground md:leading-6">
                {showingTranslateValue(product?.description)}
              </p>
              <div className="flex items-center my-4">
                <Price
                  price={price}
                  product={product}
                  originalPrice={originalPrice}
                />
                <span className="ml-2">
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
                      variants={product?.variants}
                      setSelectVa={setSelectVa}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                    />
                  </span>
                ))}
              </div>

              <div className="flex items-center mt-4">
                <div className="w-full grid lg:grid-cols-3 sm:grid-cols-3 gap-3">
                  <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border border-border">
                    <button
                      onClick={() => setItem(item - 1)}
                      disabled={item === 1}
                      className="flex items-center cursor-pointer justify-center py-2 px-4 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-foreground border-e border-border hover:text-muted-foreground"
                    >
                      <span className="text-xl">
                        <FiMinus />
                      </span>
                    </button>
                    <p className="font-semibold text-sm">{item}</p>
                    <button
                      onClick={() => setItem(item + 1)}
                      disabled={
                        product.quantity < item || product.quantity === item
                      }
                      className="flex items-center cursor-pointer justify-center py-2 px-4 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-foreground border-s border-border hover:text-muted-foreground"
                    >
                      <span className="text-xl">
                        <FiPlus />
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={product.quantity < 1}
                    className="w-full text-sm flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-primary-foreground py-2 px-4 bg-primary hover:bg-primary/90"
                  >
                    <FiShoppingBag className="mr-2" />
                    Add to cart
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    passHref
                    className="w-full relative h-auto flex items-center font-semibold text-sm text-foreground justify-center rounded-md transition-colors py-2 px-4 border border-border bg-card hover:bg-accent hover:text-primary"
                  >
                    <FiEye className="mr-2" />
                    View details
                  </Link>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                  <div>
                    <span className=" font-semibold py-1 text-sm d-block">
                      <span className="text-muted-foreground">Category</span>{" "}
                      <Link
                        href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                        className="cursor-pointer"
                      >
                        <button
                          type="button"
                          className="text-muted-foreground font-medium ml-2 hover:text-primary"
                          onClick={() => setIsLoading(!isLoading)}
                        >
                          {category_name}
                        </button>
                      </Link>
                    </span>

                    <Tags product={product} />
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                <FiHeadphones className="mr-1 text-muted-foreground text-md" />
                Call Us for Order
                <a
                  href={`tel:${globalSetting?.contact || "+099949343"}`}
                  className="font-bold text-primary ml-1"
                >
                  {globalSetting?.contact || "+099949343"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </MainModal>
    </>
  );
};

export default ProductModal;
