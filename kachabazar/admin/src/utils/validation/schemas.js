/**
 * Zod Validation Schemas
 *
 * Frontend validation schemas matching backend express-validator rules.
 * These are used with react-hook-form for client-side validation before API calls.
 */

import { z } from "zod";

// ══════════════════════════════════════════════════════════════════════
// COMMON VALIDATION HELPERS
// ══════════════════════════════════════════════════════════════════════

// MongoDB ObjectId pattern
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

// Slug pattern (lowercase alphanumeric with hyphens)
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ══════════════════════════════════════════════════════════════════════
// ATTRIBUTE SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const attributeSchema = z.object({
  title: z.string().min(1, "Attribute title is required"),
  name: z.string().min(1, "Display name is required"),
  option: z
    .enum(["Dropdown", "Radio", "Checkbox"], {
      errorMap: () => ({
        message: "Option must be Dropdown, Radio, or Checkbox",
      }),
    })
    .optional(),
  variants: z.array(z.any()).optional(),
});

export const attributeUpdateSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  option: z
    .enum(["Dropdown", "Radio", "Checkbox"], {
      errorMap: () => ({
        message: "Option must be Dropdown, Radio, or Checkbox",
      }),
    })
    .optional(),
});

export const childAttributeSchema = z.object({
  name: z.string().min(1, "Display name is required"),
  status: z.enum(["show", "hide"]).optional(),
});

// ══════════════════════════════════════════════════════════════════════
// CATEGORY SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  parentId: z
    .string()
    .regex(mongoIdPattern, "Invalid parent category ID")
    .optional()
    .or(z.literal("")),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
  icon: z.string().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  parentId: z
    .string()
    .regex(mongoIdPattern, "Invalid parent category ID")
    .optional()
    .or(z.literal("")),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// PRODUCT SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const productSchema = z
  .object({
    title: z.string().min(1, "Product title is required"),
    slug: z
      .string()
      .min(1, "Product slug is required")
      .regex(
        slugPattern,
        "Slug must be lowercase alphanumeric with hyphens (e.g., my-product)",
      ),
    description: z.string().optional(),
    originalPrice: z
      .number({ invalid_type_error: "Original price must be a number" })
      .min(0, "Original price must be a positive number"),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price must be a positive number"),
    stock: z
      .number({ invalid_type_error: "Stock must be a number" })
      .int("Stock must be a whole number")
      .min(0, "Stock must be a non-negative integer")
      .optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    status: z
      .enum(["show", "hide"], {
        errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
      })
      .optional(),
    categories: z.array(z.string()).optional(),
  })
  .refine((data) => data.price <= data.originalPrice, {
    message: "Sale price must be less than or equal to original price",
    path: ["price"],
  });

export const productUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z
    .string()
    .regex(slugPattern, "Slug must be lowercase alphanumeric with hyphens")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  originalPrice: z
    .number({ invalid_type_error: "Original price must be a number" })
    .min(0, "Original price must be a positive number")
    .optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be a positive number")
    .optional(),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock must be a non-negative integer")
    .optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// COUPON SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const couponSchema = z.object({
  title: z.string().min(1, "Coupon title is required"),
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code must be at most 30 characters"),
  endTime: z.string().min(1, "End time is required"),
  minimumAmount: z
    .number({ invalid_type_error: "Minimum amount must be a number" })
    .min(0, "Minimum amount must be a positive number")
    .optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

export const couponUpdateSchema = z.object({
  title: z.string().optional(),
  couponCode: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code must be at most 30 characters")
    .optional(),
  minimumAmount: z
    .number({ invalid_type_error: "Minimum amount must be a number" })
    .min(0, "Minimum amount must be a positive number")
    .optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// STAFF SCHEMAS
// ══════════════════════════════════════════════════════════════════════

const staffRoles = [
  "admin",
  "super admin",
  "manager",
  "cashier",
  "accountant",
  "driver",
];

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(staffRoles, {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  phone: z.string().optional(),
  joiningDate: z.string().optional(),
});

export const staffUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z
    .enum(staffRoles, {
      errorMap: () => ({ message: "Please select a valid role" }),
    })
    .optional(),
  phone: z.string().optional(),
});

// ══════════════════════════════════════════════════════════════════════
// ADMIN LOGIN SCHEMA
// ══════════════════════════════════════════════════════════════════════

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ══════════════════════════════════════════════════════════════════════
// CAMPAIGN SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const campaignProductSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  campaignPrice: z
    .number({ invalid_type_error: "Campaign price must be a number" })
    .min(0, "Campaign price must be a positive number"),
  originalPrice: z
    .number({ invalid_type_error: "Original price must be a number" })
    .min(0, "Original price must be a positive number"),
  discountType: z
    .enum(["percentage", "fixed"], {
      errorMap: () => ({
        message: "Discount type must be 'percentage' or 'fixed'",
      }),
    })
    .optional(),
  discountValue: z
    .number({ invalid_type_error: "Discount value must be a number" })
    .min(0, "Discount value must be a positive number")
    .optional(),
  stockLimit: z
    .number({ invalid_type_error: "Stock limit must be a number" })
    .int("Stock limit must be a whole number")
    .min(1, "Stock limit must be at least 1"),
});

export const campaignSchema = z.object({
  title: z.string().min(1, "Campaign title is required"),
  slug: z
    .string()
    .regex(
      slugPattern,
      "Slug must be lowercase alphanumeric with hyphens (e.g. summer-sale)",
    )
    .optional()
    .or(z.literal("")),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  products: z
    .array(campaignProductSchema)
    .min(1, "At least one product is required"),
  showSection: z
    .enum(["home_top", "home_middle", "home_bottom", "sidebar", "none"], {
      errorMap: () => ({ message: "Invalid display section" }),
    })
    .optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// CURRENCY SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const currencySchema = z.object({
  name: z.string().min(1, "Currency name is required"),
  symbol: z.string().min(1, "Currency symbol is required"),
  iso_code: z.string().min(1, "ISO code is required"),
  exchange_rate: z
    .number({ invalid_type_error: "Exchange rate must be a number" })
    .min(0, "Exchange rate must be a positive number")
    .optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// LANGUAGE SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  iso_code: z.string().min(1, "ISO code is required"),
  flag: z.string().optional(),
  status: z
    .enum(["show", "hide"], {
      errorMap: () => ({ message: "Status must be 'show' or 'hide'" }),
    })
    .optional(),
});

// ══════════════════════════════════════════════════════════════════════
// CUSTOMER SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().max(20, "Phone number is too long").optional(),
  address: z.string().optional(),
});

export const customerUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().max(20, "Phone number is too long").optional(),
});

// ══════════════════════════════════════════════════════════════════════
// DELIVERY BOY SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export const deliveryBoySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
});

export const deliveryBoyUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// ══════════════════════════════════════════════════════════════════════
// EXPORT ALL SCHEMAS
// ══════════════════════════════════════════════════════════════════════

export default {
  // Attribute
  attributeSchema,
  attributeUpdateSchema,
  childAttributeSchema,

  // Category
  categorySchema,
  categoryUpdateSchema,

  // Product
  productSchema,
  productUpdateSchema,

  // Coupon
  couponSchema,
  couponUpdateSchema,

  // Staff
  staffSchema,
  staffUpdateSchema,

  // Admin
  adminLoginSchema,

  // Campaign
  campaignSchema,

  // Currency
  currencySchema,

  // Language
  languageSchema,

  // Customer
  customerSchema,
  customerUpdateSchema,

  // Delivery Boy
  deliveryBoySchema,
  deliveryBoyUpdateSchema,
};
