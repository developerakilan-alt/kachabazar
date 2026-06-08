"use server";

import { cookies } from "next/headers";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import { getAuthToken } from "@lib/auth-server";

/**
 * Get product reviews
 */
export async function getProductReviews(productId) {
  try {
    const response = await resilientFetch(
      `${baseURL}/review/product/${productId}`,
      {
        next: { revalidate: 60, tags: ["reviews", `review-${productId}`] },
      },
    );

    const reviews = await handleResponse(response);

    return {
      success: true,
      reviews: reviews || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      reviews: [],
      error: error.message,
    };
  }
}

/**
 * Add product review
 */
export async function addReview(reviewData) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: "Please login to submit a review",
      };
    }

    const response = await resilientFetch(`${baseURL}/review/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const review = await handleResponse(response);

    return {
      success: true,
      review,
      message: "Review submitted successfully",
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to submit review",
    };
  }
}

/**
 * Get customer reviews
 */
export async function getCustomerReviews() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        reviews: [],
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(`${baseURL}/review/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    const reviews = await handleResponse(response);

    return {
      success: true,
      reviews: reviews || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      reviews: [],
      error: error.message,
    };
  }
}

/**
 * Get user purchased products for review
 */
export async function getUserPurchasedProducts({ page = 1, limit = 30 } = {}) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        reviews: [],
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(
      `${baseURL}/reviews/purchased-products?page=${page}&limit=${limit}`,
      {
        next: {
          revalidate: 60,
          tags: ["reviewed_products"],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const reviews = await handleResponse(response);

    return {
      success: true,
      reviews: reviews || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      reviews: [],
      error: error.message,
    };
  }
}
