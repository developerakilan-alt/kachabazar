import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cookies } from "next/headers";
import { getUserServerSession } from "@lib/auth-server";

const FooterClothing = async ({
  error,
  storeCustomizationSetting,
  globalSetting,
}) => {
  const cookieStore = await cookies();
  const lang = cookieStore.get("_lang")?.value || "en";
  const showingTranslateValue = (data) => {
    if (!data) return "";
    return data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.en || "";
  };
  const footer = storeCustomizationSetting?.footer;
  const userInfo = await getUserServerSession();
  const clothingContainer =
    "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10";

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className={clothingContainer}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 lg:py-20">
          {/* Brand Column */}
          {footer?.block4_status && (
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <Image
                  width={140}
                  height={40}
                  className="h-8 w-auto max-w-[160px] object-contain"
                  src={footer?.block4_logo || "/logo/logo-color.png"}
                  alt="logo"
                />
              </Link>
              <div className="flex items-start gap-2 mb-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p className="text-sm leading-relaxed text-neutral-400 max-w-xs">
                  {showingTranslateValue(footer?.block4_address) ||
                    "Curated fashion for the modern wardrobe."}
                </p>
              </div>
              {footer?.block4_phone && (
                <div className="flex items-center gap-2 mb-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 shrink-0">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <p className="text-xs text-neutral-400">
                    {footer.block4_phone}
                  </p>
                </div>
              )}
              {footer?.block4_email && (
                <div className="flex items-center gap-2 mb-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 shrink-0">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <p className="text-xs text-neutral-400">
                    {footer.block4_email}
                  </p>
                </div>
              )}
              {globalSetting?.vat_number && (
                <div className="flex items-center gap-2 mt-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-neutral-400 shrink-0">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                  <p className="text-xs text-neutral-400">
                    GST: {globalSetting.vat_number}
                  </p>
                </div>
              )}
              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-4">
                  {(footer?.social_instagram || true) && (
                    <Link
                      href={footer?.social_instagram || "https://www.instagram.com/"}
                      aria-label="Instagram"
                      rel="noreferrer"
                      target="_blank"
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </Link>
                  )}
                  {(footer?.social_youtube || true) && (
                    <Link
                      href={footer?.social_youtube || "https://www.youtube.com/"}
                      aria-label="YouTube"
                      rel="noreferrer"
                      target="_blank"
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </Link>
                  )}
                </div>
            </div>
          )}

          {/* Block 1 */}
          {/*
          {footer?.block1_status && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-5">
                {showingTranslateValue(footer?.block1_title) || "Shop"}
              </h4>
              <ul className="space-y-3">
                {[
                  {
                    title: footer?.block1_sub_title1,
                    link: footer?.block1_sub_link1,
                  },
                  {
                    title: footer?.block1_sub_title2,
                    link: footer?.block1_sub_link2,
                  },
                  {
                    title: footer?.block1_sub_title3,
                    link: footer?.block1_sub_link3,
                  },
                  {
                    title: footer?.block1_sub_title4,
                    link: footer?.block1_sub_link4,
                  },
                ].map(
                  (item, i) =>
                    item.title && (
                      <li key={i}>
                        <Link
                          href={item.link || "#"}
                          className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                          {showingTranslateValue(item.title)}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
          */}

          {/* Block 2 */}
          {footer?.block2_status && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-5">
                {showingTranslateValue(footer?.block2_title) || "Help"}
              </h4>
              <ul className="space-y-3">
                {[
                  {
                    title: footer?.block2_sub_title1,
                    link: footer?.block2_sub_link1,
                  },
                  {
                    title: footer?.block2_sub_title2,
                    link: footer?.block2_sub_link2,
                  },
                  {
                    title: footer?.block2_sub_title3,
                    link: footer?.block2_sub_link3,
                  },
                  {
                    title: footer?.block2_sub_title4,
                    link: footer?.block2_sub_link4,
                  },
                ].map(
                  (item, i) =>
                    item.title && (
                      <li key={i}>
                        <Link
                          href={item.link || "#"}
                          className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                          {showingTranslateValue(item.title)}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          {/* Block 3 */}
          {footer?.block3_status && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-5">
                {showingTranslateValue(footer?.block3_title) || "Account"}
              </h4>
              <ul className="space-y-3">
                {[
                  {
                    title: footer?.block3_sub_title1,
                    link: footer?.block3_sub_link1,
                  },
                  {
                    title: footer?.block3_sub_title2,
                    link: footer?.block3_sub_link2,
                  },
                  {
                    title: footer?.block3_sub_title3,
                    link: footer?.block3_sub_link3,
                  },
                  {
                    title: footer?.block3_sub_title4,
                    link: footer?.block3_sub_link4,
                  },
                ].map(
                  (item, i) =>
                    item.title && (
                      <li key={i}>
                        <Link
                          href={userInfo?.email ? item.link || "#" : `/auth/login?callbackUrl=${encodeURIComponent(item.link || "/user/dashboard")}`}
                          className="text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                          {showingTranslateValue(item.title)}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            {globalSetting?.copyright_text ||
              "© " + new Date().getFullYear() + " All rights reserved."}
          </p>



          {footer?.payment_method_status && (
            <div>
              <Image
                width={200}
                height={50}
                className="opacity-60"
                src={
                  footer?.payment_method_img ||
                  "/payment-method/payment-logo.png"
                }
                alt="payment"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterClothing;
