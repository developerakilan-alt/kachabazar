"use client";
import React from "react";

const ModernHero = ({ discountedProducts, attributes, globalSetting, storeCustomizationSetting }) => {
  const home = storeCustomizationSetting?.home || {};
  const slider = storeCustomizationSetting?.slider || {};
  const heroImg = slider?.first_img || home?.quick_delivery_img || globalSetting?.logo || "";

  return (
    <div className="w-full mt-0 mb-8">
      {heroImg ? (
        <img
          src={heroImg}
          alt={globalSetting?.shop_name || "Store"}
          className="w-full"
          style={{ display: "block", maxHeight: "500px", objectFit: "cover", objectPosition: "center" }}
        />
      ) : (
        <div className="w-full h-64 bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No banner image</p>
        </div>
      )}
    </div>
  );
};

export default ModernHero;