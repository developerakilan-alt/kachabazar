import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cookies } from "next/headers";
import { getUserServerSession } from "@lib/auth-server";

const FooterElectronic = async ({
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
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-slate-950 text-white">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-14 lg:py-16">
          {/* Brand */}
          {footer?.block4_status && (
            <div className="col-span-2">
              <Link href="/" className="inline-block mb-5">
                <Image
                  width={140}
                  height={40}
                  className="h-8 w-auto max-w-[160px] object-contain"
                  src={footer?.block4_logo || "/logo/logo-color.png"}
                  alt="logo"
                />
              </Link>
              <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                {showingTranslateValue(footer?.block4_address) ||
                  "Your trusted destination for the latest technology."}
              </p>
              {footer?.block4_phone && (
                <p className="mt-4 text-xs text-slate-500">
                  Tel: {footer.block4_phone}
                </p>
              )}
              {footer?.block4_email && (
                <p className="text-xs text-slate-500">
                  Email: {footer.block4_email}
                </p>
              )}

              {footer?.social_links_status && (
                <div className="flex items-center gap-3 mt-5">
                  {footer?.social_facebook && (
                    <Link
                      href={footer.social_facebook}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[30px]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </Link>
                  )}
                  {footer?.social_twitter && (
                    <Link
                      href={footer.social_twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[30px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </Link>
                  )}
                  {footer?.social_pinterest && (
                    <Link
                      href={footer.social_pinterest}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Pinterest"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[30px]"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.905 2.168-2.905 1.024 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.974-5.365 11.974-11.987C23.97 5.367 18.603 0 11.985 0z"/></svg>
                    </Link>
                  )}
                  {footer?.social_linkedin && (
                    <Link
                      href={footer.social_linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[30px]"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </Link>
                  )}
                  {footer?.social_whatsapp && (
                    <Link
                      href={footer.social_whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[30px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Block 1 */}
          {footer?.block1_status && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-5">
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
                          className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          {showingTranslateValue(item.title)}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          {/* Block 2 */}
          {footer?.block2_status && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-5">
                {showingTranslateValue(footer?.block2_title) || "Support"}
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
                          className="text-sm text-slate-400 hover:text-white transition-colors"
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-5">
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
                          href={userInfo?.email ? item.link || "#" : "#"}
                          className="text-sm text-slate-400 hover:text-white transition-colors"
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

        {/* Bottom */}
        <div className="border-t border-slate-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {globalSetting?.copyright_text ||
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          {footer?.payment_method_status && (
            <Image
              width={200}
              height={50}
              className="opacity-40"
              src={
                footer?.payment_method_img || "/payment-method/payment-logo.png"
              }
              alt="payment"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterElectronic;
