"use client";

import { CartProvider } from "react-use-cart";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@lib/stripe";
import { SessionProvider } from "next-auth/react";

//internal imports
import { UserProvider } from "@context/UserContext";
import { SidebarProvider } from "@context/SidebarContext";
import { LanguageProvider } from "@context/LanguageContext";
import QueryProvider from "@lib/providers/QueryProvider";
import FacebookPixel from "@components/common/FacebookPixel";

const Providers = ({ children, storeSetting }) => {
  const stripePromise = getStripe(
    storeSetting?.stripe_key || process.env.NEXT_PUBLIC_STRIPE_KEY,
  );

  return (
    <>
      <ToastContainer />
      <FacebookPixel
        pixelId={storeSetting?.fb_pixel_key}
        enabled={storeSetting?.fb_pixel_status}
      />
      <QueryProvider>
        <SessionProvider basePath="/api/auth">
          <LanguageProvider>
            <SidebarProvider>
              <UserProvider>
                <Elements stripe={stripePromise}>
                  <CartProvider>{children}</CartProvider>
                </Elements>
              </UserProvider>
            </SidebarProvider>
          </LanguageProvider>
        </SessionProvider>
      </QueryProvider>
    </>
  );
};

export default Providers;
