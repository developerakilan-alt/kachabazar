"use server";

import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";

/**
 * Get showing attributes
 */
export async function getAttributes() {
  try {
    const response = await resilientFetch(`${baseURL}/attributes/show`, {
      next: { revalidate: 60, tags: ["attributes", "settings"] },
    });

    const attributes = await handleResponse(response);

    return {
      success: true,
      attributes: attributes || [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      attributes: [],
      error: error.message,
    };
  }
}
