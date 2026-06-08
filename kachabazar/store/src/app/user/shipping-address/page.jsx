import React from "react";

//internal imports
import { getShippingAddress } from "@lib/actions/customer.actions";
import UpdateShippingAddress from "./UpdateShippingAddress";

// Force dynamic rendering - don't cache this page
export const dynamic = "force-dynamic";

const Shipping = async ({ searchParams }) => {
  const { id } = await searchParams;
  const { shippingAddress, error } = await getShippingAddress(id || "");

  // console.log("getShippingAddress", shippingAddress);
  // console.log("param::", id);
  return (
    <>
      <UpdateShippingAddress shippingAddress={shippingAddress} error={error} />
    </>
  );
};

export default Shipping;
