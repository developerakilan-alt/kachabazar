import { Suspense } from "react";
import Link from "next/link";
import { FiTruck, FiFileText, FiStar, FiShield, FiCreditCard, FiHeart, FiAward } from "react-icons/fi";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import DiscountedCard from "@components/product/DiscountedCard";
import CampaignSection from "@components/campaign/CampaignSection";
import CategorySlideshow from "@components/home/CategorySlideshow";
import { getCategoryProductImage } from "@utils/categoryProductImages";
import { normalizeStoreImageUrl } from "@utils/imageUtils";

const HomeClothing = ({
  popularProducts,
  categoryProducts,
  discountedProducts,
  attributes,
  storeCustomizationSetting,
  storeCustomizationError,
  globalSetting,
  categories,
  featuredCampaign,
}) => {
  const topCategories = categories || [];
  const home = storeCustomizationSetting?.home;
  const wideContainer =
    "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10";
  const t = (obj) => obj?.en || obj || "";

  return (
    <div className="min-h-screen bg-white">
      <StickyCart />

      {/* ═══ Fashion Hero — Split Layout ═══ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px]">
          <div>
            {/* Category Slideshow */}
            <CategorySlideshow
              categories={topCategories}
              products={categoryProducts || popularProducts}
              storeCustomizationSetting={storeCustomizationSetting}
            />
          </div>
        </div>
      </section>

      {/* ═══ Marquee Trust Bar ═══ */}
      {/*
      {home?.delivery_status && (
        <div className="bg-white border-y border-neutral-100 text-neutral-700 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3">
            {Array(3).fill(null).map((_, ri) => (
              <div
                key={ri}
                className="flex items-center gap-12 mx-6 text-[11px] font-medium uppercase tracking-[0.2em]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  {t(home?.quick_delivery_title) || "Fast Delivery"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  {t(home?.promotion_button_name) || "Easy Returns"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  {t(home?.feature_title) || "New Arrivals"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  Premium Quality
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      */}

      {/* ═══ Featured Categories — Magazine Grid ═══ */}
      {storeCustomizationSetting?.home?.featured_status && (
        <section className="pt-8 lg:pt-12 pb-16 lg:pb-24 bg-white">
          <div className={wideContainer}>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-3">
                Shop by Category
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                <CMSkeletonTwo
                  count={1}
                  height={40}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.feature_title}
                />
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-3 max-w-md mx-auto text-sm">
                <CMSkeletonTwo
                  count={1}
                  height={14}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.feature_description}
                />
              </p>
            </div>

            {/* 6-per-row category grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              {topCategories.map((cat) => {
                const categoryImage = normalizeStoreImageUrl(cat.icon) || getCategoryProductImage(
                  cat,
                  categoryProducts || popularProducts,
                );
                return (
                  <Link
                    key={cat._id}
                    href={`/search?_id=${cat._id}`}
                    className="group relative overflow-hidden aspect-square rounded-2xl"
                  >
                    <img
                      src={categoryImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-4 pb-5">
                      <h3 className="text-white font-bold text-lg lg:text-xl tracking-wide uppercase drop-shadow-lg">
                        {cat.name?.en || "Category"}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Editorial Split Banner ═══ */}
      {/* {storeCustomizationSetting?.home?.delivery_status && (
        <section className="bg-neutral-50 dark:bg-neutral-900">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-gradient-to-br from-neutral-100 to-stone-100 dark:from-neutral-800 dark:to-stone-900 p-10 lg:p-14 flex flex-col justify-center min-h-[280px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-3">
                  {home?.quick_delivery_subtitle?.en || "The Seasonal Edit"}
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3 leading-tight">
                  {home?.quick_delivery_title?.en ||
                    "Curated Styles For Every Occasion"}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm leading-relaxed">
                  {home?.quick_delivery_description?.en ||
                    "Handpicked pieces that blend comfort with contemporary style."}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={home?.quick_delivery_link || "/search"}
                    className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-colors"
                  >
                    {home?.quick_delivery_button?.en || "Shop Now"}
                  </Link>
                  <Link
                    href={home?.promotion_button_link || "/offers"}
                    className="inline-flex items-center px-6 py-2.5 border border-primary text-primary text-xs font-semibold tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {home?.promotion_button_name?.en || "View Lookbook"}
                  </Link>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 border border-neutral-200 dark:border-neutral-700 rounded-full opacity-50" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 border border-neutral-200 dark:border-neutral-700 rounded-full opacity-30" />
              </div>
              <div className="bg-neutral-900 dark:bg-neutral-800 text-white p-10 lg:p-14 flex items-center min-h-[280px]">
                <div className="grid grid-cols-3 gap-6 w-full text-center">
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold tracking-tight">50+</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-2">Brands</p>
                  </div>
                  <div className="border-x border-neutral-700">
                    <p className="text-4xl lg:text-5xl font-bold tracking-tight">2k+</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-2">Products</p>
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold tracking-tight">24h</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-2">Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* ═══ Popular Products ═══ */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <section className="py-16 lg:py-24 bg-white">
          <div className={wideContainer}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  New Releases
                </h2>
              </div>
              <Link
                href="/search"
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline-offset-4 hover:underline hidden sm:block transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-5">
              {popularProducts
                ?.slice(
                  0,
                  storeCustomizationSetting?.home
                    ?.latest_discount_product_limit || 10,
                )
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    attributes={attributes}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Campaign / Flash Sale Section */}
      {featuredCampaign && (
        <CampaignSection campaign={featuredCampaign} attributes={attributes} />
      )}

      {/* ═══ Discounted Products ═══ */}
      {/* {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <section
            id="discount"
            className="py-16 lg:py-24 bg-white"
          >
            <div className={wideContainer}>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">
                    On Sale
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    <CMSkeletonTwo
                      count={1}
                      height={32}
                      loading={false}
                      error={storeCustomizationError}
                      data={
                        storeCustomizationSetting?.home?.latest_discount_title
                      }
                    />
                  </h2>
                </div>
                <Link
                  href="/search"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline-offset-4 hover:underline hidden sm:block transition-colors"
                >
                  Shop All Sale →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-5">
                {discountedProducts
                  ?.slice(
                    0,
                    storeCustomizationSetting?.home?.popular_product_limit ||
                      10,
                  )
                  .map((product) => (
                    <DiscountedCard
                      key={product._id}
                      product={product}
                      attributes={attributes}
                    />
                  ))}
              </div>
            </div>
          </section>
        )} */}

      {/* ═══ Trust Badges ═══ */}
      {home?.delivery_status && (
        <section className="bg-white border-t border-neutral-100 dark:border-neutral-800 py-14">
          <div className={wideContainer}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {(home?.trust_badges?.length > 0
                ? home.trust_badges
                : [
                    { title: home?.quick_delivery_title, description: home?.quick_delivery_description },
                    { title: home?.promotion_title, description: home?.promotion_description },
                    { title: home?.feature_title, description: home?.feature_description },
                  ]
              ).map((badge, i) => {
                const badgeIcons = [FiTruck, FiFileText, FiStar, FiShield, FiCreditCard, FiHeart, FiAward];
                const IconComp = badgeIcons[i % badgeIcons.length];
                return (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComp className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    </div>
                    {i === 0 ? (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                          Quick Delivery
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                          Within Tamil Nadu, 3- to 5-day delivery; other states: 6- to 8-day delivery
                        </p>
                      </>
                    ) : i === 1 ? (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                          Important Order Policy
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                          No Cash on Delivery (COD), If the courier is returned due to call not picked up or incorrect address, re-shipping charges will be applicable
                        </p>
                      </>
                    ) : i === 2 ? (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                          Naturally Derived
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                          No Refunds Under Any Circumstances, 360° Unboxing Video is Mandatory for replacement requests (only for damaged products)
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                          {t(badge?.title) || "Trust Badge"}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                          {t(badge?.description) || ""}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Newsletter ═══ */}
      {/* <section className="bg-neutral-900 dark:bg-neutral-800 text-white py-16 lg:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-4">
            Join the Community
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
            Stay in Style
          </h2>
          <p className="text-neutral-400 mb-8 text-sm max-w-sm mx-auto">
            Subscribe for exclusive access to new arrivals, seasonal edits, and
            member-only offers.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 bg-transparent border border-neutral-600 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button className="px-7 py-3.5 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomeClothing;
