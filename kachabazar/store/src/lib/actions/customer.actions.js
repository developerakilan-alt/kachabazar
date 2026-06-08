"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import { getAuthToken, getAuthSession } from "@lib/auth-server";

// Validation schema
const shippingAddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact: z.string().min(5, "Contact must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
});

/**
 * Get customer shipping address
 */
export async function getShippingAddress(id = "") {
  try {
    const token = await getAuthToken();
    const session = await getAuthSession();
    const userId = session?.user?.id;

    if (!token || !userId) {
      return {
        success: false,
        shippingAddress: null,
        error: "Unauthorized",
      };
    }

    // Backend route is /customer/shipping/address/:userId
    const response = await resilientFetch(
      `${baseURL}/customer/shipping/address/${userId}${id ? `?id=${id}` : ""}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const shippingAddress = await handleResponse(response);

    return {
      success: true,
      shippingAddress,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      shippingAddress: null,
      error: error.message,
    };
  }
}

/**
 * Add shipping address
 */
export async function addShippingAddress(addressData) {
  try {
    const token = await getAuthToken();
    const session = await getAuthSession();
    const userId = session?.user?.id;

    if (!token || !userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Backend route: POST /customer/shipping/address/:userId
    const response = await resilientFetch(
      `${baseURL}/customer/shipping/address/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      shippingAddress: data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update shipping address
 */
export async function updateShippingAddress(shippingId, addressData) {
  try {
    const token = await getAuthToken();
    const session = await getAuthSession();
    const userId = session?.user?.id;

    if (!token || !userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Backend route: PUT /customer/shipping/address/:userId/:shippingId
    const response = await resilientFetch(
      `${baseURL}/customer/shipping/address/${userId}/${shippingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      },
    );

    const data = await handleResponse(response);

    return {
      success: true,
      shippingAddress: data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete shipping address
 */
export async function deleteShippingAddress(shippingId) {
  try {
    const token = await getAuthToken();
    const session = await getAuthSession();
    const userId = session?.user?.id;

    if (!token || !userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Backend route: DELETE /customer/shipping/address/:userId/:shippingId
    const response = await resilientFetch(
      `${baseURL}/customer/shipping/address/${userId}/${shippingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await handleResponse(response);

    return {
      success: true,
      message: "Address deleted successfully",
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Add or Update shipping address form action (for use with useActionState)
 */
export async function addShippingAddressAction(prevState, formData) {
  const token = await getAuthToken();
  const session = await getAuthSession();

  if (!token) {
    return {
      success: false,
      error: "Unauthorized",
      errors: null,
    };
  }

  // Validate input
  const validatedFields = shippingAddressSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    contact: formData.get("contact"),
    country: formData.get("country"),
    city: formData.get("city"),
    area: formData.get("area") || "",
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  const shippingAddressId = formData.get("shippingAddressId") || "";
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      error: "User not found",
      errors: null,
    };
  }

  const isUpdate = !!shippingAddressId;

  try {
    // Use PUT for update, POST for add
    const url = isUpdate
      ? `${baseURL}/customer/shipping/address/${userId}/${shippingAddressId}`
      : `${baseURL}/customer/shipping/address/${userId}`;

    const response = await resilientFetch(url, {
      cache: "no-cache",
      method: isUpdate ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    const updatedData = await handleResponse(response);

    // Revalidate all user-related paths
    revalidatePath("/user/shipping-address");
    revalidatePath("/user/my-account");
    revalidatePath("/user/dashboard");
    revalidatePath("/checkout");

    return {
      success: true,
      message: isUpdate
        ? "Shipping address updated successfully!"
        : "Shipping address added successfully!",
      shippingAddress: updatedData?.shippingAddress || validatedFields.data,
      error: null,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errors: null,
    };
  }
}
