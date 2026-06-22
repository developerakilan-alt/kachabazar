import { Suspense } from "react";
import Link from "next/link";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import DiscountedCard from "@components/product/DiscountedCard";
import CampaignSection from "@components/campaign/CampaignSection";

const HomeHeritage = ({
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
  const t = (obj) => obj?.en || obj || "";
  const home = storeCustomizationSetting?.home || {};

  return (
    <div className="min-h-screen bg-background temple-bg">
      <StickyCart />

      {/* Heritage Hero Section */}
      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-10 py-16 lg:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 temple-glow opacity-20 pointer-events-none" />
        <div className="kolam-divider mb-6" />
        <h1 className="text-3xl lg:text-5xl font-bold gold-text mb-4">
          {globalSetting?.shop_name || "Heritage Collection"}
        </h1>
        <p className="text-[rgba(216,163,96,0.7)] max-w-2xl mx-auto mb-8 text-sm lg:text-base leading-relaxed">
          {globalSetting?.site_description || "Timeless craftsmanship passed down through generations."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-2.5 border border-primary/40 rounded-lg font-medium text-primary hover:bg-primary/10 transition-colors text-sm"
          >
            Explore Collection
          </Link>
          <Link
            href="#popular"
            className="inline-flex items-center px-6 py-2.5 border border-border rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
          >
            Browse Products
          </Link>
        </div>
        <div className="kolam-divider mt-6" />
      </div>

      {/* Category pills */}
      {storeCustomizationSetting?.home?.featured_status && (
        <div className="border-y border-[#c8961e]/20 py-6">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-10">
            <Suspense fallback={<p className="text-[rgba(216,163,96,0.5)]">Loading categories...</p>}>
              <FeatureCategory
                categories={categories}
                products={categoryProducts || popularProducts}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Popular products — heritage treasure grid */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <div id="popular" className="py-8">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
            <div className="kolam-divider mb-3" />
            <div className="text-center mb-5">
              <h2 className="text-xl lg:text-2xl font-bold gold-text">
                <CMSkeletonTwo
                  count={1}
                  height={24}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_title}
                />
              </h2>
              <p className="text-[rgba(216,163,96,0.5)] mt-2 max-w-lg mx-auto text-sm">
                <CMSkeletonTwo
                  count={1}
                  height={14}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_description}
                />
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3">
              {popularProducts
                ?.slice(
                  0,
                  storeCustomizationSetting?.home
                    ?.latest_discount_product_limit || 16,
                )
                .map((product) => (
                  <div key={product._id} className="heritage-card rounded-lg p-2.5">
                    <ProductCard
                      product={product}
                      attributes={attributes}
                    />
                  </div>
                ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 rounded-lg font-medium text-primary hover:bg-primary/10 transition-colors text-sm"
              >
                View All Products
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Campaign / Flash Sale Section */}
      {featuredCampaign && (
        <CampaignSection campaign={featuredCampaign} attributes={attributes} />
      )}

      {/* Discounted products — heritage treasury */}
      {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <div id="discount" className="py-8">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
              <div className="kolam-divider mb-3" />
              <div className="text-center mb-5">
                <h2 className="text-xl lg:text-2xl font-bold gold-text">
                  <CMSkeletonTwo
                    count={1}
                    height={24}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.latest_discount_title}
                  />
                </h2>
                <p className="text-[rgba(216,163,96,0.5)] mt-2 max-w-lg mx-auto text-sm">
                  <CMSkeletonTwo
                    count={1}
                    height={14}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.latest_discount_description}
                  />
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                {discountedProducts
                  ?.slice(
                    0,
                    storeCustomizationSetting?.home?.popular_product_limit || 16,
                  )
                  .map((product) => (
                    <div key={product._id} className="heritage-card rounded-lg p-2.5">
                      <DiscountedCard
                        product={product}
                        attributes={attributes}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      {/* Kolam bottom border */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-10 pb-4">
        <div className="kolam-border-top" />
      </div>
    </div>
  );
};

export default HomeHeritage;
