import { Suspense } from "react";
import { notFound } from "next/navigation";

// Server Actions from lib
import { getProductBySlug } from "@lib/actions/product.actions";
import { getAttributes } from "@lib/actions/attribute.actions";
import { getGlobalSettings } from "@lib/actions/settings.actions";

// Client Component
import ProductClient from "./_components/product-client";
import ProductLoading from "../loading";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { product, error } = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }

  // Use product-level SEO fields with fallback to product title/description
  const productTitle =
    product?.seo?.meta_title?.en || product?.title?.en || "Product";
  const productDescription =
    product?.seo?.meta_description?.en ||
    product?.description?.en ||
    "Shop the best products";
  const ogImage =
    product?.seo?.og_image ||
    (product?.image?.length > 0 ? product.image[0] : "");
  const seoKeywords =
    product?.seo?.meta_keywords?.length > 0
      ? product.seo.meta_keywords
      : product?.tags || [];

  return {
    title: productTitle,
    description: productDescription,
    keywords: seoKeywords,
    openGraph: {
      title: productTitle,
      description: productDescription,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: productTitle,
      description: productDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

const ProductSlug = async ({ params }) => {
  const { slug } = await params;

  // Fetch all data in parallel
  const [
    { product, reviews, relatedProducts, error: productError },
    { attributes, error: attributesError },
    { globalSetting, error: settingsError },
  ] = await Promise.all([
    getProductBySlug(slug),
    getAttributes(),
    getGlobalSettings(),
  ]);

  // Handle product not found
  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductClient
        product={product}
        reviews={reviews || []}
        attributes={attributes || []}
        relatedProducts={relatedProducts || []}
        error={null}
      />
    </Suspense>
  );
};

export default ProductSlug;
