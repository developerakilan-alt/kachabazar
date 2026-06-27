"use client";

import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

//internal import

import { UserContext } from "@context/UserContext";
import { getAllCoupons } from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import { addNotification } from "@services/NotificationServices";
import {
  addOrder,
  addGuestOrder,
  addRazorpayOrder,
  createOrderByRazorPay,
  createPaymentIntent,
  sendEmailInvoiceToCustomer,
} from "@services/OrderServices";
import { getUserSession } from "@lib/auth-client";
import { useSetting } from "@context/SettingContext";
import useUtilsFunction from "./useUtilsFunction";
import { addShippingAddress } from "@services/ServerActionServices";

const useCheckoutSubmit = ({
  shippingAddress,
  isGuest = false,
  storeSetting: storeSettingOverride,
  storeCustomizationSetting: storeCustomizationOverride,
}) => {
  const { dispatch } = useContext(UserContext);

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [isCouponAvailable, setIsCouponAvailable] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const couponRef = useRef("");
  const { error: razorPayError, isLoading, Razorpay } = useRazorpay();
  const { isEmpty, emptyCart, items, cartTotal } = useCart();

  const userInfo = getUserSession();
  const {
    globalSetting,
    storeSetting: contextStoreSetting,
    storeCustomization: contextStoreCustomization,
  } = useSetting() || {};
  const storeSetting = storeSettingOverride || contextStoreSetting || {};
  const storeCustomization =
    storeCustomizationOverride || contextStoreCustomization || {};
  const { showDateFormat, showingTranslateValue } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "₹";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const zipCode = watch("zipCode");

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
    if (userInfo?.email) {
      setValue("email", userInfo?.email);
    }
  }, [isCouponApplied]);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total]);

  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) => preValue + currentValue.itemTotal,
      0,
    );

    let totalValue = 0;
    const subTotal = parseFloat(cartTotal + Number(shippingCost)).toFixed(2);
    const discountAmount =
      discountPercentage?.type === "fixed"
        ? discountPercentage?.value
        : discountProductTotal * (discountPercentage?.value / 100);

    const discountAmountTotal = discountAmount ? discountAmount : 0;

    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);
    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  const submitHandler = async (data) => {
    try {
      setIsCheckoutSubmit(true);
      setError("");

      if (isGuest) {
        if (!data.email && !data.contact) {
          setIsCheckoutSubmit(false);
          return notifyError(
            "Email or phone number is required for guest checkout.",
          );
        }
        if (!data.firstName) {
          setIsCheckoutSubmit(false);
          return notifyError("Name is required for guest checkout.");
        }
        if (!data.address) {
          setIsCheckoutSubmit(false);
          return notifyError("Address is required for guest checkout.");
        }
      }

      const userDetails = {
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        contact: data.contact,
        email: data.email,
        address: data.address,
        country: data.country,
        city: data.city,
        zipCode: data.zipCode,
      };

      let orderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "pending",
        cart: items,
        subTotal: cartTotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
      };

      const userId = userInfo?.id || userInfo?._id;
      if (!isGuest && userId) {
        try {
          await addShippingAddress({
            userId: userId,
            shippingAddressData: {
              ...userDetails,
            },
          });
        } catch (addrErr) {
          console.error("Failed to save shipping address:", addrErr.message);
        }
      }

      switch (data.paymentMethod) {
        case "RazorPay":
          await handlePaymentWithRazorpay(orderInfo);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || error?.message);
      setIsCheckoutSubmit(false);
    }
  };

  const handleOrderSuccess = async (orderResponse, orderInfo) => {
    try {
      const notificationInfo = {
        orderId: orderResponse?._id,
        message: `${
          orderResponse?.user_info?.name
        } placed an order of ${parseFloat(orderResponse?.total).toFixed(2)}!`,
        image:
          userInfo?.image ||
          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      };

      const updatedData = {
        ...orderResponse,
        date: showDateFormat(orderResponse.createdAt),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };

      if (globalSetting?.email_to_customer) {
        sendEmailInvoiceToCustomer(updatedData).catch((emailErr) => {
          console.error("Failed to send email invoice:", emailErr.message);
        });
      }

      if (!isGuest) {
        const { notification, error } = await addNotification(notificationInfo);
      }

      setOrderSuccessData({
        orderId: orderResponse?._id,
        invoice: orderResponse?.invoice,
        total: orderResponse?.total,
        trackingId: orderResponse?.trackingId,
        currency: currency,
      });
      setShowOrderSuccess(true);

      if (isGuest) {
        router.push(
          `/order/confirmation?invoice=${orderResponse?.invoice}&trackingId=${orderResponse?.trackingId}`,
        );
      } else {
        router.push(`/order/${orderResponse?._id}`);
      }
      notifySuccess(
        "Your Order Confirmed! The invoice will be emailed to you shortly.",
      );
      Cookies.remove("couponInfo");
      emptyCart();
      setIsCheckoutSubmit(false);
    } catch (err) {
      console.error("Order success handling error:", err.message);
      throw new Error(err.message);
    }
  };

  const handlePaymentWithRazorpay = async (orderInfo) => {
    try {
      const {
        amount,
        id,
        currency,
        keyId,
        error: razorpayOrderError,
      } = await createOrderByRazorPay({
        amount: Math.round(total).toString(),
      });
      if (razorpayOrderError) {
        throw new Error(razorpayOrderError);
      }

      const razorpayKey = keyId || storeSetting?.razorpay_id;
      if (!razorpayKey) {
        throw new Error("Razorpay test key is not configured");
      }

      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: globalSetting?.shop_name || "Store",
        description: "This is the total cost of your purchase",
        order_id: id,
        handler: async (response) => {
          const razorpayDetails = {
            amount: orderInfo.total,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const orderData = { ...orderInfo, razorpay: razorpayDetails };
          const { orderResponse, error } = await addRazorpayOrder(orderData);
          if (error) {
            setIsCheckoutSubmit(false);
            return notifyError(error);
          }
          await handleOrderSuccess(orderResponse, orderInfo);
        },
        prefill: {
          name: orderInfo?.user_info?.name || "Customer",
          email: orderInfo?.user_info?.email || "customer@example.com",
          contact: orderInfo?.user_info?.contact || "0000000000",
        },
        theme: { color: "#10b981" },
        modal: {
          ondismiss: () => setIsCheckoutSubmit(false),
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (err) {
      console.error("Razorpay payment error:", err.message);
      throw new Error(err.message);
    }
  };

  const handleShippingCost = (value) => {
    setShippingCost(Number(value));
  };

  const handleDefaultShippingAddress = (value) => {
    setUseExistingAddress(value);
    if (value && shippingAddress && shippingAddress?.name) {
      const address = shippingAddress;
      const nameParts = address?.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName =
        nameParts?.length > 1 ? nameParts[nameParts?.length - 1] : "";

      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("address", address.address || "");
      setValue("contact", address.contact || "");
      setValue("email", userInfo?.email || "");
      setValue("city", address.city || "");
      setValue("country", address.country || "");
      setValue("zipCode", address.zipCode || "");
    } else {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("address", "");
      setValue("contact", "");
      setValue("city", "");
      setValue("country", "");
      setValue("zipCode", "");
    }
  };

  const handleCouponCode = async (e) => {
    e.preventDefault();

    if (!couponRef.current.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    setIsCouponAvailable(true);

    try {
      const { coupons, error } = await getAllCoupons();
      const result = coupons.filter(
        (coupon) => coupon.couponCode === couponRef.current.value,
      );
      setIsCouponAvailable(false);

      if (result.length < 1) {
        notifyError("Please Input a Valid Coupon!");
        return;
      }

      if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
        notifyError("This coupon is not valid!");
        return;
      }

      if (total < result[0]?.minimumAmount) {
        notifyError(
          `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`,
        );
        return;
      } else {
        notifySuccess(`Your Coupon ${result[0].couponCode} is Applied!`);
        setIsCouponApplied(true);
        setMinimumAmount(result[0]?.minimumAmount);
        setDiscountPercentage(result[0].discountType);
        dispatch({ type: "SAVE_COUPON", payload: result[0] });
        Cookies.set("couponInfo", JSON.stringify(result[0]));
      }
    } catch (error) {
      return notifyError(error.message);
    }
  };

  return {
    register,
    watch,
    errors,
    showCard,
    setShowCard,
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    isCouponApplied,
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
    zipCode,
  };
};

export default useCheckoutSubmit;