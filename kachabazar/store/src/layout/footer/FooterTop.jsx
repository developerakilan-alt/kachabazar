import React from "react";

const FooterTop = async ({ error, storeCustomizationSetting, globalSetting }) => {
  const home = storeCustomizationSetting?.home;
  const t = (obj) => obj?.en || obj || "";

  return (
    <div
      id="footerTop"
      className="bg-repeat bg-center overflow-hidden bg-secondary"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-8 text-center">
        <div className="text-3xl text-primary mb-2">✦</div>
        <p className="text-lg font-serif font-medium text-accent">
          {t(home?.popular_title) || globalSetting?.site_description || "Elegant & Timeless Collection"}
        </p>
        <div className="text-3xl text-primary mt-2">✦</div>
      </div>
    </div>
  );
};

export default FooterTop;
