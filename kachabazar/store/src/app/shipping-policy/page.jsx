import React from "react";

import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getCustomizationSettings } from "@lib/actions/settings.actions";

export const metadata = {
  title: "Shipping Policy",
  description:
    "Read our shipping policy for delivery information and guidelines.",
  keywords: ["shipping", "delivery", "policy", "orders"],
};

const ShippingPolicy = async () => {
  const { storeCustomizationSetting, error } = await getCustomizationSettings();

  const shipping_policy = storeCustomizationSetting?.shipping_policy;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        headerBg={shipping_policy?.header_bg}
        title={shipping_policy?.title}
      />
      <div className="relative z-10 mt-4 bg-background text-foreground">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-10">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <CMSkeletonTwo
              html
              count={15}
              height={15}
              error={error}
              loading={false}
              data={shipping_policy?.description}
            />
            <br />
            <CMSkeletonTwo count={15} height={15} loading={false} />
            <br />
            <CMSkeletonTwo count={15} height={15} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
