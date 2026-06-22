import { Suspense } from "react";
import Link from "next/link";
import Banner from "@components/banner/Banner";
import CardTwo from "@components/cta-card/CardTwo";
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import DiscountedCard from "@components/product/DiscountedCard";
import CampaignSection from "@components/campaign/CampaignSection";
import { getCategoryProductImage } from "@utils/categoryProductImages";
import {
  FiTruck,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";

const HomeDefault = ({
  popularProducts,
  categoryProducts,
  discountedProducts,
  attributes,
  storeCustomizationSetting,
  storeCustomizationError,
  featuredCampaign,
  categories: categoryData,
  globalSetting,
}) => {
  const t = (obj) => obj?.en || obj || "";
  const home = storeCustomizationSetting?.home || {};
  const promoActive = home?.feature_promo_status !== false;

  const featurePromo = promoActive
    ? [
        {
          id: 1,
          title: t(home?.quick_delivery_title) || "Quick Delivery",
          desc: t(home?.quick_delivery_description) || "Fast and reliable delivery service.",
          icon: FiTruck,
        },
        {
          id: 2,
          title: t(home?.promotion_title) || "Special Offers",
          desc: t(home?.promotion_description) || "Exclusive deals and promotions.",
          icon: FiShield,
        },
        {
          id: 3,
          title: t(home?.popular_title) || "Popular Products",
          desc: t(home?.popular_description) || "Trending items chosen by customers.",
          icon: FiCreditCard,
        },
      ]
    : [];

  const rootCategories = categoryData?.filter?.(
    (c) => c?.name?.en && !["Uncategorized"].includes(c?.name?.en)
  ) || [];
  const collections = rootCategories.length > 0
    ? rootCategories.map((c) => ({
        title: c?.name?.en || "",
        id: c._id,
        img: getCategoryProductImage(c, categoryProducts || popularProducts),
        slug: c?.slug || "",
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* sticky cart section */}
      <StickyCart />

      {/* Hero Section - Full width banner */}
      <div className="w-full bg-background">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-5">
          <div className="flex w-full">
            <div className="flex-shrink-0 xl:pr-6 lg:block w-full lg:w-3/5">
              <Suspense fallback={<p>Loading carousel...</p>}>
                <MainCarousel />
              </Suspense>
            </div>
            <div className="w-full hidden lg:flex">
              <Suspense fallback={<p>Loading coupons...</p>}>
                <OfferCard />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Our Collections */}
      {collections.length > 0 && (
        <div className="w-full py-12 bg-muted/30">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2 text-foreground">
                {t(home?.feature_title) || "Explore Our Collections"}
              </h2>
              <div className="text-3xl text-primary mt-2">✦</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((col) => (
                <Link
                  key={col.slug || col.id}
                  href={col.id ? `/search?category=${col.slug}&_id=${col.id}` : `/search?query=${encodeURIComponent(col.title)}`}
                  className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className="aspect-[16/9] bg-cover bg-center bg-muted"
                    style={{ backgroundImage: `url(${col.img})` }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                      <span className="text-white text-xl md:text-2xl font-serif font-semibold drop-shadow-lg">
                        {col.title}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Latest Collections - Tabbed Products */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <div className="bg-background lg:py-16 py-10">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="mb-10 flex justify-center">
              <div className="text-center w-full lg:w-2/5">
                <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold text-foreground">
                  <CMSkeletonTwo
                    count={1}
                    height={30}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.popular_title}
                  />
                </h2>
                <div className="text-2xl text-primary mt-1">✦</div>
                <p className="text-base font-sans text-muted-foreground leading-6 mt-2">
                  <CMSkeletonTwo
                    count={5}
                    height={10}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.popular_description}
                  />
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                  {popularProducts
                    ?.slice(
                      0,
                      storeCustomizationSetting?.home
                        ?.latest_discount_product_limit || 12,
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
            </div>
          </div>
        </div>
      )}

      {/* Campaign / Flash Sale Section */}
      {featuredCampaign && (
        <CampaignSection campaign={featuredCampaign} attributes={attributes} />
      )}

      {/* promotional banner card */}
      {/* {storeCustomizationSetting?.home?.delivery_status && (
        <div className="block mx-auto max-w-screen-2xl px-4 sm:px-10 mb-8">
          <div
            className="lg:p-16 p-6 shadow-sm rounded-2xl"
            style={{ backgroundColor: "#D8A360" }}
          >
            <CardTwo />
          </div>
        </div>
      )} */}

      {/* discounted products */}
      {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <div
            id="discount"
            className="bg-background lg:py-16 py-10"
          >
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <div className="mb-10 flex justify-center">
                <div className="text-center w-full lg:w-2/5">
                  <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold text-foreground">
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
                  <div className="text-2xl text-primary mt-1">✦</div>
                  <p className="text-base font-sans text-muted-foreground leading-6 mt-2">
                    <CMSkeletonTwo
                      count={5}
                      height={20}
                      loading={false}
                      error={storeCustomizationError}
                      data={
                        storeCustomizationSetting?.home
                          ?.latest_discount_description
                      }
                    />
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                    {discountedProducts
                      ?.slice(
                        0,
                        storeCustomizationSetting?.home?.popular_product_limit || 12,
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
            </div>
          </div>
        )}

      {/* Feature / Service Cards — using store settings */}
      {promoActive && featurePromo.length > 0 && (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{featurePromo.map((promo) => {
              const Icon = promo.icon;
              return (
                <div
                  key={promo.id}
                  className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {promo.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-5">
                      {promo.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDefault;
