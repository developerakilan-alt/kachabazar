"use client";

import { useRouter } from "next/navigation";
import { useCart } from "react-use-cart";
import {
  IoClose,
  IoTrashOutline,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Internal imports
import { getUserSession } from "@lib/auth-client";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useSetting } from "@context/SettingContext";

const CartDrawer = ({ isOpen, setOpen }) => {
  const router = useRouter();
  const {
    isEmpty,
    items,
    cartTotal,
    removeItem,
    updateItemQuantity,
    emptyCart,
  } = useCart();
  const { showingTranslateValue, formatPrice } = useUtilsFunction();
  const userInfo = getUserSession();
  const { globalSetting } = useSetting();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    if (items?.length <= 0) {
      setOpen(false);
      return;
    }
    router.push("/checkout");
    setOpen(false);
  };

  // Calculate shipping (free over $50)
  const shippingCost = cartTotal >= 50 ? 0 : 5.99;
  const freeShippingRemaining = 50 - cartTotal;

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onTransitionEnd={() => !isOpen && setIsAnimating(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out dark:bg-background ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              Shopping Cart
            </h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground dark:hover:bg-accent"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {!isEmpty && freeShippingRemaining > 0 && (
          <div className="border-b border-border bg-gradient-to-r from-accent to-accent px-6 py-3 dark:border-border dark:from-accent/20 dark:to-accent/20">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Add{" "}
              <span className="font-semibold text-primary">
                {formatPrice(freeShippingRemaining)}
              </span>{" "}
              more for free shipping!
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted dark:bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent0 to-primary transition-all duration-500"
                style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="relative h-40 w-40">
                <Image
                  src="/no-result.svg"
                  alt="Empty cart"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-muted-foreground dark:text-muted-foreground">
                Your cart is empty
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/search");
                }}
                className="mt-6 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-4 rounded-xl border border-border bg-muted p-4 transition-all hover:border-border hover:shadow-sm dark:border-border dark:bg-muted"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-background dark:bg-muted">
                    <ImageWithFallback
                      fill
                      src={item.image?.[0] || item.image}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary dark:text-white"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30"
                      >
                        <IoTrashOutline className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Variant info */}
                    {item.variant?.size && (
                      <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                        Size: {item.variant.size}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-full border border-border dark:border-border">
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:bg-muted dark:text-muted-foreground dark:hover:bg-accent"
                        >
                          <IoRemoveOutline className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-foreground dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-muted dark:text-muted-foreground dark:hover:bg-accent"
                        >
                          <IoAddOutline className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold text-foreground dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={() => emptyCart()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-border dark:text-muted-foreground dark:hover:border-red-800 dark:hover:bg-red-900/20"
              >
                <IoTrashOutline className="h-4 w-4" />
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-border bg-muted p-6 dark:border-border dark:bg-muted">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-medium text-foreground dark:text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Shipping
                </span>
                <span
                  className={`font-medium ${
                    shippingCost === 0
                      ? "text-primary"
                      : "text-foreground dark:text-white"
                  }`}
                >
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="border-t border-border pt-2 dark:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-foreground dark:text-white">
                    {formatPrice(cartTotal + shippingCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/checkout-cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted dark:border-border dark:bg-muted dark:text-muted-foreground dark:hover:bg-accent"
              >
                View Cart
              </Link>
              <button
                onClick={handleCheckout}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-accent0 to-primary px-4 py-3 text-sm font-medium text-white transition-all hover:from-primary hover:to-primary hover:shadow-lg"
              >
                Checkout
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                Money-back Guarantee
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
