"use client";

import React, { useEffect, useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import Link from "next/link";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
} from "react-icons/io5";
import { ImCreditCard } from "react-icons/im";
import useTranslation from "next-translate/useTranslation";

//internal import
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import CartItem from "@components/cart/CartItem";
import InputArea from "@components/form/InputArea";
import InputShipping from "@components/form/InputShipping";
import InputPayment from "@components/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import SwitchToggle from "@components/form/SwitchToggle";
import OrderSuccessNotification from "@components/notifications/OrderSuccessNotification";

const CheckoutForm = ({
  storeSetting: storeSettingProp,
  shippingAddress,
  hasShippingAddress,
  storeCustomizationSetting,
  isGuest = false,
}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isEnabled = (value) => value === true || value === "true" || value === 1 || value === "1";

  const {
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    register,
    watch,
    errors,
    showCard,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    isCouponAvailable,
    globalSetting,
    storeSetting,
    storeCustomization,
    showingTranslateValue,
    handleDefaultShippingAddress,
    showOrderSuccess,
    orderSuccessData,
    setShowOrderSuccess,
  } = useCheckoutSubmit({
    shippingAddress,
    isGuest,
    storeSetting: storeSettingProp,
    storeCustomizationSetting,
  });
  const { formatPrice } = useUtilsFunction();
  const checkout = storeCustomization?.checkout;
  const selectedPaymentMethod = watch("paymentMethod");
  if (!mounted) return null; // or a skeleton loader

  return (
    <>
      {/* Order Success Notification Modal */}
      <OrderSuccessNotification
        show={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        orderId={orderSuccessData?.orderId}
        invoice={orderSuccessData?.invoice}
        total={orderSuccessData?.total}
        trackingId={orderSuccessData?.trackingId}
        currency={orderSuccessData?.currency}
      />

      <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row gap-0">
        {/* checkout form */}
        <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
          <div className="mt-5 md:mt-0 md:col-span-2">
            {/* <Elements stripe={stripePromise}> */}
            <form onSubmit={handleSubmit(submitHandler)}>
              {isGuest && (
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    🛒 You are checking out as a guest. Only Cash on Delivery is
                    available for guest orders.
                  </p>
                </div>
              )}
              {!isGuest && hasShippingAddress && (
                <div className="flex justify-end my-2">
                  <SwitchToggle
                    id="shipping-address"
                    title="Use Default Shipping Address"
                    processOption={useExistingAddress}
                    handleProcess={handleDefaultShippingAddress}
                  />
                </div>
              )}
              <div className="form-group">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  01. {showingTranslateValue(checkout?.personal_details)}
                </h2>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.first_name)}
                      name="firstName"
                      type="text"
                      placeholder="John"
                    />
                    <Error errorMessage={errors.firstName} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.last_name)}
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                    />
                    <Error errorMessage={errors.lastName} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.email_address)}
                      name="email"
                      type="email"
                      placeholder="youremail@gmail.com"
                    />
                    <Error errorMessage={errors.email} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.checkout_phone)}
                      name="contact"
                      type="tel"
                      placeholder="+062-6532956"
                    />

                    <Error errorMessage={errors.contact} />
                  </div>
                </div>
              </div>

              <div className="form-group mt-12">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  02. {showingTranslateValue(checkout?.shipping_details)}
                </h2>

                <div className="grid grid-cols-6 gap-6 mb-8">
                  <div className="col-span-6">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.street_address)}
                      name="address"
                      type="text"
                      placeholder="123 Boulevard Rd, Beverley Hills"
                    />
                    <Error errorMessage={errors.address} />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.city)}
                      name="city"
                      type="text"
                      placeholder="Los Angeles"
                    />
                    <Error errorMessage={errors.city} />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.country)}
                      name="country"
                      type="text"
                      placeholder="United States"
                    />
                    <Error errorMessage={errors.country} />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.zip_code)}
                      name="zipCode"
                      type="text"
                      placeholder="2345"
                    />
                    <Error errorMessage={errors.zipCode} />
                  </div>
                </div>

                <Label label={showingTranslateValue(checkout?.shipping_cost)} />
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={showingTranslateValue(checkout?.shipping_name_two)}
                      description={showingTranslateValue(
                        checkout?.shipping_one_desc,
                      )}
                      value={Number(checkout?.shipping_one_cost) || 60}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={showingTranslateValue(checkout?.shipping_name_two)}
                      description={showingTranslateValue(
                        checkout?.shipping_two_desc,
                      )}
                      value={Number(checkout?.shipping_two_cost) || 20}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>
                </div>
              </div>

              <div className="form-group mt-12">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  03. {showingTranslateValue(checkout?.payment_method)}
                </h2>
                {!isGuest && showCard && (
                  <div className="mb-3">
                    <CardElement />{" "}
                    <p className="text-red-400 text-sm mt-1">{error}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                  {isEnabled(storeSetting?.cod_status) && (
                    <div className="">
                      <InputPayment
                        setShowCard={setShowCard}
                        register={register}
                        name={t("common:cashOnDelivery")}
                        value="Cash"
                        Icon={IoWalletSharp}
                      />
                      <Error errorMessage={errors.paymentMethod} />
                    </div>
                  )}

                  {!isGuest && isEnabled(storeSetting?.stripe_status) && (
                    <div className="">
                      <InputPayment
                        setShowCard={setShowCard}
                        register={register}
                        name={t("common:creditCard")}
                        value="Card"
                        Icon={ImCreditCard}
                      />
                      <Error errorMessage={errors.paymentMethod} />
                    </div>
                  )}

                  {!isGuest && isEnabled(storeSetting?.razorpay_status) && (
                    <div className="">
                      <InputPayment
                        setShowCard={setShowCard}
                        register={register}
                        name="RazorPay"
                        value="RazorPay"
                        Icon={ImCreditCard}
                      />
                      <Error errorMessage={errors.paymentMethod} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                <div className="col-span-6 sm:col-span-3">
                  <Button className="w-full h-10 rounded-sm" variant="outline">
                    <Link
                      href="/"
                      rel="preload"
                      className="flex justify-center text-center"
                    >
                      <span className="text-xl mr-2">
                        <IoReturnUpBackOutline />
                      </span>
                      {showingTranslateValue(checkout?.continue_button)}
                    </Link>
                  </Button>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <Button
                    type="submit"
                    variant="create"
                    disabled={
                      isEmpty ||
                      (selectedPaymentMethod === "Card" && !stripe) ||
                      isCheckoutSubmit
                    }
                    isLoading={isCheckoutSubmit}
                    className="w-full h-10 rounded-sm"
                  >
                    {isCheckoutSubmit ? (
                      "Processing"
                    ) : (
                      <span className="flex justify-center text-center">
                        {showingTranslateValue(checkout?.confirm_button)}
                        <span className="text-xl ml-2">
                          {" "}
                          <IoArrowForward />
                        </span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
            {/* </Elements> */}
          </div>
        </div>

        {/* cart section */}
        <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-44 md:order-2 lg:order-2">
          <div className="border p-5 lg:px-8 lg:py-8 rounded-xl bg-card border-border shadow-sm order-1 sm:order-2">
            <h2 className="font-semibold  text-lg pb-4">
              {showingTranslateValue(checkout?.order_summary)}
            </h2>

            <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-muted/30 rounded-lg block">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {isEmpty && (
                <div className="text-center py-10">
                  <span className="flex justify-center my-auto text-muted-foreground font-semibold text-4xl">
                    <IoBagHandle />
                  </span>
                  <h2 className="font-medium  text-sm pt-2 text-muted-foreground">
                    No Item Added Yet!
                  </h2>
                </div>
              )}
            </div>

            <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-foreground last:border-b-0 last:text-base last:pb-0">
              <form className="w-full">
                {couponInfo.couponCode ? (
                  <span className="bg-accent px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                    {" "}
                    <p className="text-primary">Coupon Applied </p>{" "}
                    <span className="text-primary font-bold text-right">
                      {couponInfo.couponCode}
                    </span>
                  </span>
                ) : (
                  <div className="flex flex-row items-start justify-end">
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
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {showingTranslateValue(checkout?.sub_total)}
              <span className="ml-auto flex-shrink-0 text-foreground font-bold">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {showingTranslateValue(checkout?.shipping_cost)}
              <span className="ml-auto flex-shrink-0 text-foreground font-bold">
                {formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {showingTranslateValue(checkout?.discount)}
              <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                {formatPrice(discountAmount)}
              </span>
            </div>
            <div className="border-t mt-4">
              <div className="flex items-center font-bold  justify-between pt-5 text-sm uppercase">
                {showingTranslateValue(checkout?.total_cost)}
                <span className=" font-extrabold text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
