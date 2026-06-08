"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import { getAuthToken } from "@lib/auth-server";

/**
 * Get customer orders
 */
export async function getCustomerOrders({ page = 1, limit = 10 } = {}) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        data: null,
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(
      `${baseURL}/order?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 }, // No cache for orders
      },
    );

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
 * Get order by ID
 */
export async function getOrderById(orderId) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        order: null,
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(`${baseURL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    const order = await handleResponse(response);

    return {
      success: true,
      order,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      order: null,
      error: error.message,
    };
  }
}

/**
 * Create new order
 */
export async function createOrder(orderData) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        order: null,
        error: "Unauthorized",
      };
    }

    const response = await resilientFetch(`${baseURL}/order/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const order = await handleResponse(response);

    return {
      success: true,
      order,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      order: null,
      error: error.message,
    };
  }
}
