import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Facebook, Twitter, Youtube, ShoppingBag } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

import { cookies } from "next/headers";
import { getUserServerSession } from "@lib/auth-server";

const FooterHeritage = async ({
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

  return (
    <footer className="heritage-footer font-serif">
      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 lg:border-r border-[rgba(216,163,96,0.1)] lg:pr-8 flex flex-col space-y-10">

            {/* Newsletter */}
            <div>
              <h3 className="text-[22px] font-bold text-[#D4AF37] leading-snug mb-5 gold-text">
                Get early discount offers, updates subscribe to our newsletter
              </h3>
              <NewsletterForm />
            </div>

            {/* Phone */}
            {footer?.block4_phone && (
              <div className="flex items-center space-x-4 my-6">
                <div className="w-12 h-12 bg-[rgba(216,163,96,0.15)] rounded-full flex items-center justify-center flex-shrink-0 gold-border-animate">
                  <Phone className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#D4AF37] tracking-tight">
                    {footer.block4_phone}
                  </div>
                  <div className="text-sm text-[rgba(216,163,96,0.5)] mt-0.5">
                    Working 8:00 - 22:00
                  </div>
                </div>
              </div>
            )}
            {globalSetting?.vat_number && (
              <div className="flex items-center space-x-4 pb-6">
                <div className="w-12 h-12 bg-[rgba(216,163,96,0.15)] rounded-full flex items-center justify-center flex-shrink-0 gold-border-animate">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#D4AF37]"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                </div>
                <div>
                  <div className="text-sm text-[rgba(216,163,96,0.5)]">GST Number</div>
                  <div className="text-lg font-semibold text-[#D4AF37]">{globalSetting.vat_number}</div>
                </div>
              </div>
            )}

            {/* App Download */}
            <div>
              <h4 className="text-base font-bold text-[rgba(216,163,96,0.7)] mb-4">
                Download our app
              </h4>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={storeCustomizationSetting?.home?.daily_need_google_link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[rgba(216,163,96,0.1)] hover:bg-[rgba(216,163,96,0.18)] transition border border-[rgba(216,163,96,0.2)] text-[#D4AF37] px-3 py-2 rounded-md flex items-center space-x-2"
                >
                  {storeCustomizationSetting?.home?.button2_img ? (
                    <Image
                      src={storeCustomizationSetting.home.button2_img}
                      alt="Google Play"
                      width={120}
                      height={36}
                      className="h-9 w-auto object-contain"
                    />
                  ) : (
                    <>
                      <svg viewBox="0 0 512 512" className="w-6 h-6 flex-shrink-0" fill="currentColor">
                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-[10px] uppercase tracking-wider leading-none text-[rgba(216,163,96,0.5)]">GET IT ON</div>
                        <div className="text-sm font-semibold leading-tight">Google Play</div>
                      </div>
                    </>
                  )}
                </Link>

                <Link
                  href={storeCustomizationSetting?.home?.daily_need_app_link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[rgba(216,163,96,0.1)] hover:bg-[rgba(216,163,96,0.18)] transition border border-[rgba(216,163,96,0.2)] text-[#D4AF37] px-3 py-2 rounded-md flex items-center space-x-2"
                >
                  {storeCustomizationSetting?.home?.button1_img ? (
                    <Image
                      src={storeCustomizationSetting.home.button1_img}
                      alt="App Store"
                      width={120}
                      height={36}
                      className="h-9 w-auto object-contain"
                    />
                  ) : (
                    <>
                      <svg viewBox="0 0 384 512" className="w-6 h-6 flex-shrink-0" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-[10px] uppercase tracking-wider leading-none text-[rgba(216,163,96,0.5)]">Download on the</div>
                        <div className="text-sm font-semibold leading-tight">App Store</div>
                      </div>
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 lg:pl-6 flex flex-col justify-between">

            {/* Top row: Logo + Social */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[rgba(216,163,96,0.1)] pb-8 mb-8">
              <Link href="/" className="flex-shrink-0">
                {footer?.block4_logo ? (
                  <Image
                    width={130}
                    height={40}
                    className="h-9 w-auto object-contain"
                    src={footer.block4_logo}
                    alt="logo"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-7 w-7 text-[#D4AF37]" />
                    <span className="text-2xl font-bold gold-text">
                      {globalSetting?.store_name || "Store"}
                    </span>
                  </div>
                )}
              </Link>

              {footer?.social_links_status && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-[rgba(216,163,96,0.5)] mr-2">
                    Follow us
                  </span>
                  {footer?.social_facebook && (
                    <Link
                      href={footer.social_facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-sm bg-[rgba(216,163,96,0.1)] hover:bg-[rgba(216,163,96,0.2)] text-[#D4AF37] flex items-center justify-center transition"
                    >
                      <Facebook className="h-4 w-4" />
                    </Link>
                  )}
                  {footer?.social_twitter && (
                    <Link
                      href={footer.social_twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="w-8 h-8 rounded-sm bg-[rgba(216,163,96,0.1)] hover:bg-[rgba(216,163,96,0.2)] text-[#D4AF37] flex items-center justify-center transition"
                    >
                      <Twitter className="h-4 w-4" />
                    </Link>
                  )}
                  {footer?.social_whatsapp && (
                    <Link
                      href={footer.social_whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Youtube"
                      className="w-8 h-8 rounded-sm bg-[rgba(216,163,96,0.1)] hover:bg-[rgba(216,163,96,0.2)] text-[#D4AF37] flex items-center justify-center transition"
                    >
                      <Youtube className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* 4 Link Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footer?.block1_status && (
                <div>
                  <h4 className="text-[15px] font-bold text-[#D4AF37] mb-5">
                    {showingTranslateValue(footer?.block1_title) || "Useful links"}
                  </h4>
                  <ul className="space-y-1.5">
                    {[
                      { title: footer?.block1_sub_title1, link: footer?.block1_sub_link1 },
                      { title: footer?.block1_sub_title2, link: footer?.block1_sub_link2 },
                      { title: footer?.block1_sub_title3, link: footer?.block1_sub_link3 },
                      { title: footer?.block1_sub_title4, link: footer?.block1_sub_link4 },
                    ].map(
                      (item, i) =>
                        item.title && (
                          <li key={i}>
                            <Link href={item.link || "#"} className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                              {showingTranslateValue(item.title)}
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}

              {footer?.block2_status && (
                <div>
                  <h4 className="text-[15px] font-bold text-[#D4AF37] mb-5">
                    {showingTranslateValue(footer?.block2_title) || "Shop category"}
                  </h4>
                  <ul className="space-y-1.5">
                    {[
                      { title: footer?.block2_sub_title1, link: footer?.block2_sub_link1 },
                      { title: footer?.block2_sub_title2, link: footer?.block2_sub_link2 },
                      { title: footer?.block2_sub_title3, link: footer?.block2_sub_link3 },
                      { title: footer?.block2_sub_title4, link: footer?.block2_sub_link4 },
                    ].map(
                      (item, i) =>
                        item.title && (
                          <li key={i}>
                            <Link href={item.link || "#"} className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                              {showingTranslateValue(item.title)}
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}

              {footer?.block3_status && (
                <div>
                  <h4 className="text-[15px] font-bold text-[#D4AF37] mb-5">
                    {showingTranslateValue(footer?.block3_title) || "Let us help you"}
                  </h4>
                  <ul className="space-y-1.5">
                    {[
                      { title: footer?.block3_sub_title1, link: footer?.block3_sub_link1 },
                      { title: footer?.block3_sub_title2, link: footer?.block3_sub_link2 },
                      { title: footer?.block3_sub_title3, link: footer?.block3_sub_link3 },
                      { title: footer?.block3_sub_title4, link: footer?.block3_sub_link4 },
                    ].map(
                      (item, i) =>
                        item.title && (
                          <li key={i}>
                            <Link
                              href={userInfo?.email ? item.link || "#" : `/auth/login?callbackUrl=${encodeURIComponent(item.link || "/user/dashboard")}`}
                              className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300"
                            >
                              {showingTranslateValue(item.title)}
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-[15px] font-bold text-[#D4AF37] mb-5">
                  Get to know us
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/about-us" className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                      Careers
                      <span className="ml-2 bg-[#D4AF37] text-[#1a1510] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Open
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                      Customer reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="block text-sm text-[rgba(216,163,96,0.6)] hover:text-[#D4AF37] hover:ml-2 transition-all duration-300">
                      Privacy policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment strip */}
            {footer?.payment_method_status && (
              <div className="mt-8 border-t border-[rgba(216,163,96,0.1)] pt-6">
                <h4 className="text-[15px] font-bold text-[#D4AF37] mb-3">
                  We accepted payment
                </h4>
                <ul className="flex items-center flex-wrap gap-2.5">
                  <li className="bg-[rgba(216,163,96,0.08)] px-2 py-1 hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(216,163,96,0.2)] transition-all border border-[rgba(216,163,96,0.2)] rounded flex items-center justify-center h-[34px] w-[64px]">
                    <Image src="/app/visa-icon.svg" width={46} height={24} alt="Visa" className="object-contain" />
                  </li>
                  <li className="bg-[rgba(216,163,96,0.08)] px-2 py-1 hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(216,163,96,0.2)] transition-all border border-[rgba(216,163,96,0.2)] rounded flex items-center justify-center h-[34px] w-[64px]">
                    <Image src="/app/mastercard-icon.svg" width={46} height={24} alt="Mastercard" className="object-contain" />
                  </li>
                  <li className="bg-[rgba(216,163,96,0.08)] px-2 py-1 hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(216,163,96,0.2)] transition-all border border-[rgba(216,163,96,0.2)] rounded flex items-center justify-center h-[34px] w-[64px]">
                    <Image src="/app/paypal-icon.svg" width={46} height={24} alt="PayPal" className="object-contain" />
                  </li>
                  <li className="bg-[rgba(216,163,96,0.08)] px-2 py-1 hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(216,163,96,0.2)] transition-all border border-[rgba(216,163,96,0.2)] rounded flex items-center justify-center h-[34px] w-[64px]">
                    <Image src="/app/skrill-icon.svg" width={46} height={24} alt="Skrill" className="object-contain" />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(216,163,96,0.08)] py-5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-[rgba(216,163,96,0.5)] mb-4 md:mb-0">
            {globalSetting?.copyright_text || (
              <>© All rights reserved. <span className="text-[rgba(216,163,96,0.7)]">hautecouturejewellery</span></>
            )}
          </p>
          <div className="flex space-x-6">
            <Link href="/terms-and-conditions" className="text-[rgba(216,163,96,0.5)] hover:text-[#D4AF37] transition-colors">
              Terms &amp; conditions
            </Link>
            <Link href="/privacy-policy" className="text-[rgba(216,163,96,0.5)] hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterHeritage;
