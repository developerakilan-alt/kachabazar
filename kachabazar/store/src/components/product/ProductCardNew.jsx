"use client";

import { useEffect, useRef, useState } from "react";
import {
  IoAdd,
  IoRemove,
  IoExpand,
  IoHeart,
  IoHeartOutline,
  IoCartOutline,
} from "react-icons/io5";
import { useCart } from "react-use-cart";
import Link from "next/link";
import dynamic from "next/dynamic";

// Internal imports
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError } from "@utils/toast";
import Rating from "@components/common/Rating";
import useAddToCart from "@hooks/useAddToCart";
import { useSetting } from "@context/SettingContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";

const ProductCardNew = ({ product, attributes }) => {
  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { globalSetting } = useSetting();

  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { showingTranslateValue } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";

  // Calculate discount percentage
  const originalPrice = product?.isCombination
    ? product?.variants?.[0]?.originalPrice
    : product?.prices?.originalPrice;
  const currentPrice = product?.isCombination
    ? product?.variants?.[0]?.price
    : product?.prices?.price;
  const discountPercentage =
    originalPrice && currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(true);
      return;
    }

    const { variants, categories, description, ...updatedProduct } = product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: p.prices.price,
      originalPrice: product.prices?.originalPrice,
    };
    addItem(newItem);
  };

  const handleModalOpen = (event) => {
    setModalOpen(event);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setModalOpen]);

  const cartItem = items.find((item) => item.id === product._id);

  return (
    <>
      {modalOpen && (
        <ProductModal
          product={product}
          modalOpen={modalOpen}
          attributes={attributes}
          globalSetting={globalSetting}
          setModalOpen={setModalOpen}
        />
      )}

      <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-background shadow-product transition-all duration-300 hover:shadow-product-hover dark:bg-muted">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product?.stock < 5 && product?.stock > 0 && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              Low Stock
            </span>
          )}
          {product?.stock === 0 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background dark:bg-muted dark:hover:bg-accent"
        >
          {isWishlisted ? (
            <IoHeart className="h-5 w-5 text-rose-500" />
          ) : (
            <IoHeartOutline className="h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
          )}
        </button>

        {/* Product Image */}
        <Link
          href={`/product/${product?.slug}`}
          className="relative aspect-square w-full overflow-hidden bg-muted dark:bg-muted"
        >
          <ImageWithFallback
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            alt={showingTranslateValue(product?.title) || "Product"}
            src={product.image?.[0]}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg transition-transform hover:scale-105"
            >
              <IoExpand className="h-4 w-4" />
              Quick View
            </button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category */}
          {product?.category && (
            <span className="mb-1 text-xs font-medium uppercase tracking-wide text-primary dark:text-primary">
              {showingTranslateValue(product?.category?.name)}
            </span>
          )}

          {/* Title */}
          <Link
            href={`/product/${product?.slug}`}
            className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
          >
            {showingTranslateValue(product?.title)}
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <Rating
              size="sm"
              showReviews={true}
              rating={product?.average_rating}
              totalReviews={product?.total_reviews}
            />
          </div>

          {/* Price and Add to Cart */}
          <div className="mt-auto flex items-end justify-between gap-2">
            <Price
              card
              product={product}
              price={currentPrice}
              originalPrice={originalPrice}
            />

            {/* Add to Cart Button */}
            <div className="shrink-0">
              {inCart(product._id) ? (
                <div className="flex items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground">
                  <button
                    onClick={() =>
                      updateItemQuantity(cartItem.id, cartItem.quantity - 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-primary"
                  >
                    <IoRemove className="h-4 w-4" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-bold">
                    {cartItem?.quantity}
                  </span>
                  <button
                    onClick={() =>
                      product?.variants?.length > 0
                        ? handleAddItem(product)
                        : handleIncreaseQuantity(cartItem)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-primary"
                  >
                    <IoAdd className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddItem(product)}
                  disabled={product?.stock === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:hover:scale-100"
                >
                  <IoCartOutline className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCardNew), { ssr: false });
