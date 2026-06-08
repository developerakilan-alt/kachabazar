"use server";

import { baseURL, handleResponse, resilientFetch } from "@services/CommonService";
import { getAuthToken } from "@lib/auth-server";

/**
 * Track order by tracking ID (public - no auth required)
 */
export async function trackOrder(trackingId) {
  try {
    const response = await resilientFetch(`${baseURL}/tracking/track/${trackingId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    const data = await handleResponse(response);

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
    };
  }
}

/**
 * Rate delivery boy for an order (requires auth)
 */
export async function rateDeliveryBoy({ orderId, rating, review }) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(`${baseURL}/customer-tracking/rate-delivery`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, rating, review }),
    });

    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
