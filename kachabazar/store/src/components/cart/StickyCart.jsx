"use client";

import React, { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import CartDrawer from "@components/drawer/CartDrawer";
import useUtilsFunction from "@hooks/useUtilsFunction";

const StickyCart = () => {
  const { totalItems, cartTotal } = useCart();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const { formatPrice } = useUtilsFunction();

  return (
    <>
      <CartDrawer open={openCartDrawer} setOpen={setOpenCartDrawer} />
      {!openCartDrawer && (
        <button
          aria-label="Cart"
          onClick={() => setOpenCartDrawer(!openCartDrawer)}
          className="absolute"
        >
          <div className="right-0 w-35 float-right fixed top-2/4 bottom-2/4 align-middle shadow-lg cursor-pointer z-30 hidden lg:block xl:block">
            <div className="flex flex-col items-center justify-center bg-card border border-border rounded-tl-lg p-2 text-muted-foreground">
              <span className="text-2xl mb-1 text-primary">
                <IoBagHandleOutline />
              </span>
              <span className="px-2 text-sm  font-medium" suppressHydrationWarning>
                {totalItems} Items
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-primary p-2 text-primary-foreground text-base font-medium rounded-bl-lg mx-auto" suppressHydrationWarning>
              {formatPrice(cartTotal)}
            </div>
          </div>
        </button>
      )}
    </>
  );
};

export default StickyCart;
