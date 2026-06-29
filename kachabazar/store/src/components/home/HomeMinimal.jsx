import { Suspense } from "react";
import Link from "next/link";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import DiscountedCard from "@components/product/DiscountedCard";
import CampaignSection from "@components/campaign/CampaignSection";
import OfferCard from "@components/offer/OfferCard";

const HomeMinimal = ({
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
  return (
    <div className="min-h-screen bg-background">
      <StickyCart />

      {/* Temple hero — warm glow, sacred geometry feel */}
      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-10 py-20 lg:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 temple-glow opacity-30 pointer-events-none" />
        <div className="temple-ornament" />
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4 temple-section-title">
          {globalSetting?.shop_name || "Welcome to Our Store"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {globalSetting?.site_description ||
            "Discover quality products curated just for you."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 temple-btn rounded-lg font-semibold tracking-wide"
          >
            Shop All Products
          </Link>
          <Link
            href="#popular"
            className="inline-flex items-center px-8 py-3 border border-[rgba(216,163,96,0.3)] rounded-lg font-medium hover:bg-[rgba(216,163,96,0.08)] transition-all"
          >
            Browse Popular
          </Link>
        </div>
      </div>

      {/* Coupon Offer Section */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-10 py-3 sm:py-6">
        <Suspense fallback={null}>
          <OfferCard />
        </Suspense>
      </div>

      {/* Category pills */}
      {storeCustomizationSetting?.home?.featured_status && (
        <div className="border-y border-border py-10">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-10">
            <h2 className="text-lg font-semibold mb-6 text-center">
              <CMSkeletonTwo
                count={1}
                height={24}
                loading={false}
                error={storeCustomizationError}
                data={storeCustomizationSetting?.home?.feature_title}
              />
            </h2>
            <Suspense fallback={<p>Loading categories...</p>}>
              <FeatureCategory
                categories={categories}
                products={categoryProducts || popularProducts}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Popular products — temple treasure grid */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <div id="popular" className="py-16">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-10">
            <div className="temple-divider mb-4" />
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold temple-section-title">
                <CMSkeletonTwo
                  count={1}
                  height={30}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_title}
                />
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                <CMSkeletonTwo
                  count={1}
                  height={16}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_description}
                />
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {popularProducts
                ?.slice(
                  0,
                  storeCustomizationSetting?.home
                    ?.latest_discount_product_limit || 9,
                )
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    attributes={attributes}
                  />
                ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Campaign / Flash Sale Section */}
      {featuredCampaign && (
        <CampaignSection campaign={featuredCampaign} attributes={attributes} />
      )}

      {/* Discounted products — temple treasury */}
      {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <div
            id="discount"
            className="py-16"
          >
            <div className="mx-auto max-w-screen-xl px-4 sm:px-10">
              <div className="temple-divider mb-4" />
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold temple-section-title">
                  <CMSkeletonTwo
                    count={1}
                    height={30}
                    loading={false}
                    error={storeCustomizationError}
                    data={
                      storeCustomizationSetting?.home?.latest_discount_title
                    }
                  />
                </h2>
                <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                  <CMSkeletonTwo
                    count={1}
                    height={16}
                    loading={false}
                    error={storeCustomizationError}
                    data={
                      storeCustomizationSetting?.home
                        ?.latest_discount_description
                    }
                  />
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {discountedProducts
                  ?.slice(
                    0,
                    storeCustomizationSetting?.home?.popular_product_limit || 9,
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
          </div>
        )}
    </div>
  );
};

export default HomeMinimal;
