import { Suspense } from "react";

// Server Actions from lib
import { getShippingAddress } from "@lib/actions/customer.actions";
import { isAuthenticated } from "@lib/actions/auth.actions";
import {
  getGlobalSettings,
  getCustomizationSettings,
  getStoreSettings,
} from "@lib/actions/settings.actions";

// Client Component
import CheckoutClient from "./_components/checkout-client";
import CheckoutLoading from "./loading";

export const metadata = {
  title: "Checkout",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order", "secure checkout"],
};

const Checkout = async () => {
  // Check if user is authenticated
  const authenticated = await isAuthenticated();

  // Fetch settings first to check if guest checkout is enabled
  const [
    { globalSetting, error: settingsError },
    { storeCustomizationSetting, error: customizationError },
    { storeSetting, error: storeError },
  ] = await Promise.all([
    getGlobalSettings(),
    getCustomizationSettings(),
    getStoreSettings(),
  ]);

  const isGuest = !authenticated;

  // Fetch shipping address only for authenticated users
  let shippingAddress = null;
  let hasShippingAddress = false;

  if (authenticated) {
    const { shippingAddress: addr } = await getShippingAddress();
    shippingAddress = addr?.shippingAddress || null;
    hasShippingAddress =
      addr && Object.keys(addr?.shippingAddress || {}).length > 0;
  }

  // Only show critical errors (network failures, etc.) — missing settings are not fatal
  const allErrors = [settingsError, customizationError, storeError].filter(Boolean);
  const criticalError = allErrors.find((e) => !e.toLowerCase().includes("not found"));

  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutClient
        error={criticalError}
        storeSetting={storeSetting || {}}
        shippingAddress={shippingAddress}
        hasShippingAddress={hasShippingAddress}
        storeCustomizationSetting={storeCustomizationSetting || {}}
        isGuest={isGuest}
      />
    </Suspense>
  );
};

export default Checkout;
