import { Suspense } from "react";
import Link from "next/link";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import DiscountedCard from "@components/product/DiscountedCard";
import CampaignSection from "@components/campaign/CampaignSection";
import CategorySlideshow from "@components/home/CategorySlideshow";
import { getCategoryProductImage } from "@utils/categoryProductImages";

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
  const topCategories = categories?.[0]?.children?.slice(0, 6) || [];
  const slider = storeCustomizationSetting?.slider;
  const home = storeCustomizationSetting?.home;
  const wideContainer =
    "mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 2xl:px-10";

  return (
    <div className="min-h-screen bg-white">
      <StickyCart />

      {/* ═══ Fashion Hero — Split Layout ═══ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="grid lg:grid-cols-2 min-h-[480px] lg:min-h-[560px]">
            {/* Left — Text */}
            <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 lg:py-20 order-2 lg:order-1 bg-white">
              <div className="max-w-lg">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-4 border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-full">
                  Imitation Jwels for Elegance
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-5">
                  Stylish Affordable Jwellery
                </h1>
                <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8 max-w-md">
                  Designed perfect for everyday wear and special occasions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/search"
                    className="inline-flex items-center px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide uppercase rounded-none hover:opacity-90 transition-colors"
                  >
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>
            {/* Right — Category Slideshow */}
            <CategorySlideshow
              categories={topCategories}
              products={categoryProducts || popularProducts}
              storeCustomizationSetting={storeCustomizationSetting}
            />
          </div>
        </div>
      </section>

      {/* ═══ Marquee Trust Bar ═══ */}
      <div className="bg-white border-y border-neutral-100 text-neutral-700 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array(3)
            .fill(null)
            .map((_, ri) => (
              <div
                key={ri}
                className="flex items-center gap-12 mx-6 text-[11px] font-medium uppercase tracking-[0.2em]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  Free shipping over ₹75
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  Easy 30-day returns
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  New arrivals weekly
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-neutral-400" />
                  Sustainable materials
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ═══ Featured Categories — Magazine Grid ═══ */}
      {storeCustomizationSetting?.home?.featured_status && (
        <section className="py-16 lg:py-24 bg-white">
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

            {/* Asymmetric category grid */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 lg:gap-4">
              {topCategories.map((cat, index) => {
                const categoryImage = getCategoryProductImage(
                  cat,
                  categoryProducts || popularProducts,
                );
                const spans = [
                  "md:col-span-4",
                  "md:col-span-4",
                  "md:col-span-4",
                  "md:col-span-6",
                  "md:col-span-3",
                  "md:col-span-3",
                ];
                const heights = [
                  "h-72 md:h-96",
                  "h-72 md:h-96",
                  "h-72 md:h-96",
                  "h-64 md:h-80",
                  "h-64 md:h-80",
                  "h-64 md:h-80",
                ];
                return (
                  <Link
                    key={cat._id}
                    href={`/search?_id=${cat._id}`}
                    className={`group relative overflow-hidden ${spans[index] || "md:col-span-4"} ${heights[index] || "h-72 md:h-80"}`}
                  >
                    <img
                      src={categoryImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      {/* <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">
                        {cat.children?.length || 0} styles
                      </p> */}
                      <h3 className="text-white font-bold text-lg lg:text-2xl tracking-wide uppercase">
                        {cat.name?.en || "Category"}
                      </h3>
                      <span className="mt-3 text-white/70 text-xs font-medium uppercase tracking-wider group-hover:text-white transition-colors border-b border-white/30 group-hover:border-white pb-0.5">
                        Shop now
                      </span>
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
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">
                  Just Dropped
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  <CMSkeletonTwo
                    count={1}
                    height={32}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.popular_title}
                  />
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
      {storeCustomizationSetting?.home?.discount_product_status &&
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
        )}

      {/* ═══ Trust Badges ═══ */}
      <section className="bg-white border-t border-neutral-100 dark:border-neutral-800 py-14">
        <div className={wideContainer}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                Quick Delivery
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                Within Tamil Nadu, 3- to 5-day delivery; other states: 6- to 8-day delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                Important Order Policy
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                No Cash on Delivery (COD). If the courier is returned due to call not picked up or incorrect address, re-shipping charges will be applicable.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                Naturally Derived
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                No Refunds Under Any Circumstances. 360° Unboxing Video is Mandatory for replacement requests (only for damaged products).
              </p>
            </div>
          </div>
        </div>
      </section>

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
