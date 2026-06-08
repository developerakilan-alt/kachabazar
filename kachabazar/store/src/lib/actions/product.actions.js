"use server";

import { revalidateTag } from "next/cache";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";

/**
 * Get store products with filtering options
 */
export async function getStoreProducts({
  category = "",
  title = "",
  slug = "",
} = {}) {
  try {
    const response = await resilientFetch(
      `${baseURL}/products/store?category=${category}&title=${title}&slug=${slug}`,
      {
        next: {
          revalidate: 60,
          tags: ["store_products"],
        },
      },
    );

    const products = await handleResponse(response);

    return {
      success: true,
      error: null,
      reviews: products.reviews || [],
      products: products.products || [],
      relatedProducts: products.relatedProducts || [],
      popularProducts: products.popularProducts || [],
      discountedProducts: products.discountedProducts || [],
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      relatedProducts: [],
      popularProducts: [],
      discountedProducts: [],
      reviews: [],
      error: error.message,
    };
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug) {
  try {
    // Use the dedicated slug endpoint for reliable single product fetch
    const response = await resilientFetch(
      `${baseURL}/products/product/${slug}`,
      {
        next: {
          revalidate: 120,
          tags: ["product", `product-${slug}`],
        },
      },
    );

    const product = await handleResponse(response);

    // If no product found
    if (!product || !product._id) {
      return {
        success: false,
        product: null,
        reviews: [],
        relatedProducts: [],
        error: "Product not found",
      };
    }

    // Fetch related products and reviews in parallel
    const [relatedRes, reviewsRes] = await Promise.allSettled([
      resilientFetch(
        `${baseURL}/products/store?category=${product.category?._id || product.category || ""}`,
        {
          next: {
            revalidate: 120,
            tags: ["related_products", `product-${slug}-related`],
          },
        },
      ).then((r) => (r.ok ? r.json() : { products: [] })),
      // Reviews can be fetched from the store endpoint with slug
      resilientFetch(`${baseURL}/products/store?slug=${slug}`, {
        next: {
          revalidate: 120,
          tags: [`product-${slug}-reviews`],
        },
      }).then((r) => (r.ok ? r.json() : { reviews: [] })),
    ]);

    const relatedData =
      relatedRes.status === "fulfilled" ? relatedRes.value : { products: [] };
    const reviewsData =
      reviewsRes.status === "fulfilled" ? reviewsRes.value : { reviews: [] };

    return {
      success: true,
      product: product,
      reviews: reviewsData.reviews || [],
      relatedProducts:
        relatedData.relatedProducts || relatedData.products || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      product: null,
      reviews: [],
      relatedProducts: [],
      error: error.message,
    };
  }
}

/**
 * Search products
 */
export async function searchProducts({
  query = "",
  category = "",
  page = 1,
  limit = 20,
} = {}) {
  try {
    const response = await resilientFetch(
      `${baseURL}/products/store?category=${category}&title=${encodeURIComponent(
        query,
      )}`,
      {
        next: {
          revalidate: 30,
          tags: ["search_products"],
        },
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      products: data.products || [],
      totalDoc: data.totalDoc || 0,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      totalDoc: 0,
      error: error.message,
    };
  }
}

/**
 * Get discounted products
 */
export async function getDiscountedProducts() {
  try {
    const response = await resilientFetch(`${baseURL}/products/store`, {
      next: {
        revalidate: 120,
        tags: ["discounted_products"],
      },
    });

    const data = await handleResponse(response);

    return {
      success: true,
      products: data.discountedProducts || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error.message,
    };
  }
}

/**
 * Get popular products
 */
export async function getPopularProducts() {
  try {
    const response = await resilientFetch(`${baseURL}/products/store`, {
      next: {
        revalidate: 120,
        tags: ["popular_products"],
      },
    });

    const data = await handleResponse(response);

    return {
      success: true,
      products: data.popularProducts || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error.message,
    };
  }
}

/**
 * Get related products by category
 */
export async function getRelatedProducts(category) {
  try {
    const response = await resilientFetch(
      `${baseURL}/products/store?category=${category}`,
      {
        next: {
          revalidate: 120,
          tags: ["related_products", `category-${category}`],
        },
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      products: data.relatedProducts || data.products || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      error: error.message,
    };
  }
}

/**
 * Revalidate product cache
 */
export async function revalidateProducts() {
  revalidateTag("store_products");
  revalidateTag("product");
  revalidateTag("discounted_products");
  revalidateTag("popular_products");
  revalidateTag("related_products");
}
