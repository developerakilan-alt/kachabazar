"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoAlertCircleOutline, IoReturnUpBackOutline } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getUserSession } from "@lib/auth-client";

//internal import

import CartItem from "@components/cart/CartItem";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const CheckoutCartScreen = () => {
  const router = useRouter();
  const userInfo = getUserSession();
  const { storeCustomization, globalSetting } = useSetting();
  const { showingTranslateValue, formatPrice } = useUtilsFunction();

  const {
    total,
    isEmpty,
    items,
    cartTotal,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    isCouponAvailable,
  } = useCheckoutSubmit({});

  const checkout = storeCustomization?.checkout;

  const handleCheckout = () => {
    if (items?.length <= 0) {
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-10 pb-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <div className="w-full lg:w-[60%] xl:w-[55%]">
          <h2 className="font-bold text-xl pb-4 text-foreground">
            Shopping Cart
          </h2>
          <div className="w-full block bg-card rounded-xl border border-border p-4 sm:p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {isEmpty && (
              <div className="mt-10 flex flex-col h-full justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    className="size-40 flex-none rounded-md object-cover"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h3 className=" font-semibold text-muted-foreground text-lg pt-5">
                    Your cart is empty
                  </h3>
                  <p className="px-12 text-center text-sm text-muted-foreground pt-2">
                    No items added in your cart. Please add product to your cart
                    list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:block border-l border-border mx-10 xl:mx-16 2xl:mx-20 shrink-0"></div>
        <div className="flex-1">
          <div className="sticky top-44 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-8">
              <h2 className="font-semibold text-lg">
                {showingTranslateValue(checkout?.order_summary)}
              </h2>

              {/* <div className="flex items-center">
                <div className="shrink-0">
                  <IoAlertCircleOutline className="text-muted-foreground" />
                </div>
                <div className="ml-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Spend <strong>$500</strong> more and get free shipping!
                  </h3>
                </div>
              </div> */}

              <div className="mt-3 text-sm text-muted-foreground dark:text-muted-foreground divide-y divide-border/70 dark:divide-border">
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-muted-foreground">
                    {showingTranslateValue(checkout?.sub_total)}
                  </span>
                  <span className="font-semibold text-foreground dark:text-muted-foreground">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-muted-foreground">
                    {showingTranslateValue(checkout?.discount)}
                  </span>
                  <span className="font-semibold text-foreground dark:text-muted-foreground">
                    {formatPrice(discountAmount)}
                  </span>
                </div>

                <form className="w-full mt-8">
                  {couponInfo.couponCode ? (
                    <span className="bg-primary/10 px-4 py-3 leading-tight w-full rounded-lg flex justify-between items-center">
                      {" "}
                      <p className="text-primary font-medium">
                        Coupon Applied{" "}
                      </p>{" "}
                      <span className="text-primary text-right font-bold">
                        {couponInfo.couponCode}
                      </span>
                    </span>
                  ) : (
                    <div className="flex flex-row items-start justify-end w-full">
                      <Input
                        ref={couponRef}
                        type="text"
                        placeholder="Coupon Code"
                        className="px-4 py-2 h-10 mr-1 border border-border rounded-md focus:outline-none"
                        // className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-background border-border focus:ring-0 focus:outline-none focus:border-primary placeholder-muted-foreground placeholder-opacity-75"
                      />
                      <Button
                        onClick={handleCouponCode}
                        className="h-10 rounded-sm"
                        variant="create"
                        // className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-border rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-primary h-12 text-sm lg:text-base w-full sm:w-auto"
                      >
                        {showingTranslateValue(checkout?.apply_button)}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="bg-muted/40 p-8 rounded-b-xl border-t border-border">
              <p className="flex justify-between font-semibold text-foreground">
                <span>
                  <span className="text-sm">
                    {showingTranslateValue(checkout?.total_cost)}
                  </span>
                  <span className="block text-sm text-muted-foreground font-normal">
                    Shipping and taxes calculated at checkout.
                  </span>
                </span>
                <span className="font-bold text-foreground text-lg">
                  {formatPrice(total)}
                </span>
              </p>

              <div className="flex space-x-3 items-center mt-6">
                <Link
                  href="/"
                  className="relative h-auto inline-flex items-center justify-center rounded-lg transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-background text-foreground hover:bg-muted flex-1 border border-border"
                >
                  <span className="text-xl mr-2">
                    <IoReturnUpBackOutline />
                  </span>
                  {showingTranslateValue(checkout?.continue_button)}
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="relative h-auto inline-flex items-center justify-center rounded-lg w-full transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 focus:outline-none"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CheckoutCartScreen), {
  ssr: false,
});
