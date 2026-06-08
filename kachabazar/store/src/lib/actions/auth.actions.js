"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  baseURL,
  handleResponse,
  resilientFetch,
} from "@services/CommonService";
import {
  getAuthToken,
  getAuthSession,
  isUserAuthenticated,
  getUserServerSession,
} from "@lib/auth-server";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  imageUrl: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Login action
 */
export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectUrl = formData.get("redirectUrl") || "/user/dashboard";

  // Validate input
  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  try {
    const response = await resilientFetch(`${baseURL}/customer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  } catch (error) {
    return {
      success: false,
      error: error.message || "Invalid credentials",
      errors: null,
    };
  }

  redirect(redirectUrl);
}

/**
 * Register action
 */
export async function registerAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  // Validate input
  const validatedFields = registerSchema.safeParse({
    name,
    email,
    password,
    phone,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  try {
    const response = await resilientFetch(`${baseURL}/customer/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await handleResponse(response);

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  } catch (error) {
    return {
      success: false,
      error: error.message || "Registration failed",
      errors: null,
    };
  }

  redirect("/user/dashboard");
}

/**
 * Logout action
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("_token");
  cookieStore.delete("_userInfo");
  redirect("/login");
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const user = await getUserServerSession();
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  return await isUserAuthenticated();
}

/**
 * Update user profile
 */
export async function updateProfileAction(prevState, formData) {
  const token = await getAuthToken();
  const session = await getAuthSession();

  if (!token || !session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const userId = session.user.id;
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const imageUrl = formData.get("imageUrl");

  // Validate input
  const validatedFields = updateProfileSchema.safeParse({
    name,
    email,
    phone,
    address,
    imageUrl,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: "Please fix the validation errors",
    };
  }

  try {
    // Backend route is PUT /customer/:id
    const response = await resilientFetch(`${baseURL}/customer/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
        image: imageUrl,
      }),
    });

    const data = await handleResponse(response);

    // Revalidate paths to get updated data
    revalidatePath("/user/update-profile");
    revalidatePath("/user/my-account");
    revalidatePath("/user/dashboard");

    return {
      success: true,
      message: "Profile updated successfully",
      user: data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

/**
 * Change password action
 */
export async function changePasswordAction(prevState, formData) {
  const token = await getAuthToken();
  const session = await getAuthSession();

  if (!token || !session?.user?.email) {
    return {
      success: false,
      error: "Unauthorized",
      errors: null,
    };
  }

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");

  // Validate input with Zod
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: "Please fix the validation errors",
    };
  }

  try {
    // Backend route is POST /customer/change-password
    const response = await resilientFetch(
      `${baseURL}/customer/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: session.user.email,
          currentPassword,
          newPassword,
        }),
      },
    );

    await handleResponse(response);

    return {
      success: true,
      message: "Password changed successfully",
      error: null,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to change password",
      errors: null,
    };
  }
}

/**
 * Verify email address for registration
 */
export async function verifyEmailAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate input
  const validatedFields = registerSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
      user: null,
    };
  }

  try {
    const response = await resilientFetch(`${baseURL}/customer/verify-email`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const user = await handleResponse(response);

    return {
      success: true,
      user,
      error: null,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      error: error.message || "Verification failed",
      errors: null,
    };
  }
}

/**
 * Handle login with redirect
 */
export async function handleLoginAction(prevState, formData) {
  const email = formData.get("email") || formData.get("registerEmail");
  const password = formData.get("password");
  const redirectUrl = formData.get("redirectUrl") || "user/dashboard";

  // Validate input
  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  try {
    const response = await resilientFetch(`${baseURL}/customer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  } catch (error) {
    return {
      success: false,
      error: error.message || "Invalid credentials",
      errors: null,
    };
  }

  redirect(`/${redirectUrl}`);
}

// ==========================================
// OTP Login Actions
// ==========================================

/**
 * Send OTP to phone number
 */
export async function sendPhoneOtpAction(prevState, formData) {
  const phone = formData.get("phone");

  if (!phone || phone.trim().length < 8) {
    return {
      success: false,
      error: "Please enter a valid phone number with country code",
      step: "phone",
    };
  }

  try {
    const response = await resilientFetch(`${baseURL}/customer/verify-phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone.trim() }),
    });
    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message || "OTP sent successfully",
      step: "otp",
      phone: phone.trim(),
      error: null,
      // Dev mode: backend sends OTP in response for testing
      otp: data.otp || null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send OTP",
      step: "phone",
    };
  }
}

/**
 * Verify phone OTP and login/register
 */
export async function confirmPhoneOtpAction(phone, otp, redirectUrl) {
  if (!phone || !otp || otp.length < 4) {
    return {
      success: false,
      error: "Please enter a valid OTP",
    };
  }

  try {
    const response = await resilientFetch(
      `${baseURL}/customer/confirm-phone-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      },
    );
    const data = await handleResponse(response);

    // Set auth cookies
    const cookieStore = await cookies();
    cookieStore.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return {
      success: true,
      message: "Login successful",
      redirectUrl: redirectUrl || "/user/dashboard",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Invalid OTP",
    };
  }
}

/**
 * Resend phone OTP
 */
export async function resendPhoneOtpAction(phone) {
  if (!phone) {
    return { success: false, error: "Phone number is required" };
  }

  try {
    const response = await resilientFetch(
      `${baseURL}/customer/resend-phone-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      },
    );
    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message || "OTP resent successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to resend OTP",
    };
  }
}

/**
 * Send OTP to email
 */
export async function sendEmailOtpAction(prevState, formData) {
  const email = formData.get("email");

  const emailSchema = z.string().email("Invalid email address");
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return {
      success: false,
      error: "Please enter a valid email address",
      step: "email",
    };
  }

  try {
    const response = await resilientFetch(
      `${baseURL}/customer/send-email-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      },
    );
    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message || "OTP sent to your email",
      step: "otp",
      email: email.trim(),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send OTP",
      step: "email",
    };
  }
}

/**
 * Verify email OTP and login/register
 */
export async function confirmEmailOtpAction(email, otp, redirectUrl) {
  if (!email || !otp || otp.length < 4) {
    return {
      success: false,
      error: "Please enter a valid OTP",
    };
  }

  try {
    const response = await resilientFetch(
      `${baseURL}/customer/confirm-email-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      },
    );
    const data = await handleResponse(response);

    // Set auth cookies
    const cookieStore = await cookies();
    cookieStore.set("_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(
      "_userInfo",
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return {
      success: true,
      message: "Login successful",
      redirectUrl: redirectUrl || "/user/dashboard",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Invalid OTP",
    };
  }
}

/**
 * Resend email OTP
 */
export async function resendEmailOtpAction(email) {
  if (!email) {
    return { success: false, error: "Email is required" };
  }

  try {
    const response = await resilientFetch(
      `${baseURL}/customer/resend-email-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const data = await handleResponse(response);

    return {
      success: true,
      message: data.message || "OTP resent successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to resend OTP",
    };
  }
}
