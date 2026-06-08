"use server";

import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import { getAuthToken } from "@lib/auth-server";

/**
 * Get customer notifications
 */
export async function getCustomerNotifications({ page = 1, limit = 20 } = {}) {
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
      `${baseURL}/customer-tracking/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 },
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
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await resilientFetch(
      `${baseURL}/customer-tracking/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message,
      error: null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await resilientFetch(
      `${baseURL}/customer-tracking/notifications/read-all`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message,
      error: null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
