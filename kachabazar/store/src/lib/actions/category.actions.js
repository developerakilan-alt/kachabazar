"use server";

import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";

/**
 * Get showing categories
 */
export async function getCategories() {
  try {
    const response = await resilientFetch(`${baseURL}/category/show`, {
      next: { revalidate: 300, tags: ["categories"] },
    });

    const categories = await handleResponse(response);

    return {
      success: true,
      categories: categories || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      categories: [],
      error: error.message,
    };
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug) {
  try {
    const response = await resilientFetch(`${baseURL}/category/show`, {
      next: { revalidate: 300, tags: ["categories"] },
    });

    const categories = await handleResponse(response);
    const category = categories?.find((c) => c.slug === slug);

    return {
      success: true,
      category: category || null,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      category: null,
      error: error.message,
    };
  }
}
