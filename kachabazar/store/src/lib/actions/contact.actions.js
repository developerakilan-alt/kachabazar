"use server";

import { z } from "zod";
import { baseURL, handleResponse, resilientFetch } from "@services/CommonService";

// Contact form validation schema
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

/**
 * Submit contact form
 */
export async function submitContactForm(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Validate input
  const validatedFields = contactSchema.safeParse({
    name,
    email,
    subject,
    message,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  try {
    // Send to backend API
    const response = await resilientFetch(`${baseURL}/setting/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    await handleResponse(response);

    return {
      success: true,
      message:
        "Your message has been sent successfully! We will contact you shortly.",
      errors: null,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send message. Please try again.",
      errors: null,
    };
  }
}
