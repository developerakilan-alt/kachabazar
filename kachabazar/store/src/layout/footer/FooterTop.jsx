import React from "react";
import Link from "next/link";
import Image from "next/image";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

const FooterTop = async ({ error, storeCustomizationSetting }) => {
  // console.log("storeCustomizationSetting", storeCustomizationSetting?.footer);

  const home = storeCustomizationSetting?.home;

  return (
    <div
      id="footerTop"
      className="bg-repeat bg-center overflow-hidden"
      style={{ backgroundColor: "#F8E6D0" }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-8 text-center">
        <div className="text-3xl text-[#dd8e25] mb-2">✦</div>
        <p className="text-lg font-serif font-medium" style={{ color: "#EB8B10" }}>
          Elegant &amp; Timeless Imitation Jewellery
        </p>
        <div className="text-3xl text-[#dd8e25] mt-2">✦</div>
      </div>
    </div>
  );
};

export default FooterTop;
