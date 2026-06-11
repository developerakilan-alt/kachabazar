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
import {
  FiTruck,
  FiCreditCard,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

const HomeDefault = ({
  popularProducts,
  discountedProducts,
  attributes,
  storeCustomizationSetting,
  storeCustomizationError,
  featuredCampaign,
  categories: categoryData,
}) => {
  const featurePromo = [
    {
      id: 1,
      title: "Quick Delivery",
      desc: "Within Tamil Nadu, 3-5 day delivery; other states: 6-8 day delivery.",
      icon: FiTruck,
    },
    {
      id: 2,
      title: "Important Order Policy",
      desc: "No Cash on Delivery (COD). Re-shipping charges applicable for returned couriers.",
      icon: FiShield,
    },
    {
      id: 3,
      title: "Exchange Policy",
      desc: "No Refunds. 360° Unboxing Video mandatory for replacement requests (damaged only).",
      icon: FiCreditCard,
    },
  ];

  const rootCategories = categoryData?.filter?.(
    (c) => c?.name?.en && !["Uncategorized"].includes(c?.name?.en)
  ) || [];
  const collections = rootCategories.length > 0
    ? rootCategories.map((c) => ({
        title: c?.name?.en || "",
        id: c._id,
        img: `/collections/${c?.slug || c?.name?.en?.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        slug: c?.slug || "",
      }))
    : [
        { title: "Imitation Jewels", slug: "imitation-jewels", id: "", img: "/collections/imitation-jewels.jpg" },
        { title: "Diamond Look Like", slug: "diamond-look-like", id: "", img: "/collections/diamond-look-like.jpg" },
        { title: "Accessories", slug: "accessories", id: "", img: "/collections/accessories.jpg" },
      ];

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
      <div
        className="w-full py-12"
        style={{ backgroundColor: "#F8E6D0" }}
      >
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="text-center mb-8">
            <h2
              className="text-2xl md:text-3xl font-serif font-semibold mb-2"
              style={{ color: "#EB8B10" }}
            >
              Explore Our Collections
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
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{
                    backgroundColor: "#EBD1B0",
                    backgroundImage: `url(${col.img})`,
                  }}
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

      {/* Customers Reviews Section */}
      <div
        className="w-full py-12"
        style={{ backgroundColor: "#F8E6D0" }}
      >
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-2" style={{ color: "#EB8B10" }}>
            Customers Reviews
          </h2>
          <div className="text-3xl text-primary mt-2 mb-8">✦</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ananya R.", excerpt: "Elegant & Timeless", text: "Absolutely in love with these hoops! The design is elegant and they instantly elevate any outfit." },
              { name: "Priya S.", excerpt: "Premium Look & Comfort", text: "Mesmerizing is the right word! The finish is premium and they feel super comfortable to wear all day." },
              { name: "Sneha K.", excerpt: "Perfect Statement Piece", text: "These hoops are classy and trendy at the same time. I've received so many compliments already." },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <div className="text-4xl text-primary mb-3">✦</div>
                <h4 className="text-lg font-serif font-semibold text-foreground mb-2">{review.excerpt}</h4>
                <p className="text-sm text-muted-foreground mb-4 italic">&ldquo;{review.text}&rdquo;</p>
                <p className="text-sm font-semibold text-foreground">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature / Service Cards */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featurePromo.map((promo) => (
            <div
              key={promo.id}
              className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: "#F8E6D0" }}>
                <promo.icon className="h-5 w-5" style={{ color: "#dd8e25" }} />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDefault;
