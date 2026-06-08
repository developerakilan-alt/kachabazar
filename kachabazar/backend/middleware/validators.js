/**
 * Express-Validator — Centralized Input Validation Middleware
 *
 * Enterprise-grade input validation for all POST/PUT/PATCH endpoints.
 * Each validator chain is exported and applied as route-level middleware.
 */

const { body, param, query, validationResult } = require("express-validator");

// ── Validation Result Handler ──────────────────────────────────────────
/**
 * Middleware that checks for validation errors and returns 400 with details.
 * Must be placed AFTER the validation chains in the route definition.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

// ── Helper: sanitize strings ───────────────────────────────────────────
const trimAndEscape = (field) => body(field).optional().trim().escape();

// ── Param Validators ───────────────────────────────────────────────────
const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// ADMIN VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAdminLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const validateAdminRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase, one lowercase, and one number",
    ),
  body("role")
    .optional()
    .isIn([
      "admin",
      "super admin",
      "manager",
      "cashier",
      "accountant",
      "driver",
    ])
    .withMessage("Invalid role"),
  validate,
];

const validateAddStaff = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([
      "admin",
      "super admin",
      "manager",
      "cashier",
      "accountant",
      "driver",
    ])
    .withMessage("Invalid role"),
  body("phone").optional().trim(),
  body("joiningDate").optional().isISO8601().withMessage("Invalid date format"),
  validate,
];

const validateUpdateStaff = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn([
      "admin",
      "super admin",
      "manager",
      "cashier",
      "accountant",
      "driver",
    ])
    .withMessage("Invalid role"),
  validate,
];

const validateAdminForgetPassword = [
  body("verifyEmail")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  validate,
];

const validateAdminResetPassword = [
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validate,
];

const validateAssignRole = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([
      "admin",
      "super admin",
      "manager",
      "cashier",
      "accountant",
      "driver",
    ])
    .withMessage("Invalid role"),
  body("access_list")
    .optional()
    .isArray()
    .withMessage("Access list must be an array"),
  validate,
];

const validateUpdateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Status must be 'active' or 'inactive'"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// CUSTOMER VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateCustomerLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const validateCustomerEmailVerify = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const validateCustomerForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  validate,
];

const validateCustomerResetPassword = [
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const validateCustomerChangePassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  validate,
];

const validateUpdateCustomer = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number is too long"),
  validate,
];

const validateOAuthSignUp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("name").notEmpty().withMessage("Name is required"),
  validate,
];

const validatePhoneVerification = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),
  validate,
];

const validateOtpConfirm = [
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 8 })
    .withMessage("OTP must be between 4 and 8 digits"),
  validate,
];

const validateEmailOtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

const validateRefreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// PRODUCT VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddProduct = [
  body("title").notEmpty().withMessage("Product title is required"),
  body("slug")
    .notEmpty()
    .withMessage("Product slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be lowercase alphanumeric with hyphens"),
  body("prices").notEmpty().withMessage("Prices are required"),
  body("prices.originalPrice")
    .notEmpty()
    .withMessage("Original price is required")
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("prices.price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("prices.discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
  validate,
];

const validateUpdateProduct = [
  body("slug")
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be lowercase alphanumeric with hyphens"),
  body("prices.originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("prices.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("prices.discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

const validateUpdateManyProducts = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("At least one product ID is required"),
  body("ids.*").isMongoId().withMessage("Invalid product ID format"),
  validate,
];

const validateProductStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// CATEGORY VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddCategory = [
  body("name").notEmpty().withMessage("Category name is required"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  body("parentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID"),
  validate,
];

const validateUpdateCategory = [
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  body("parentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID"),
  validate,
];

const validateCategoryStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

const validateDeleteMany = [
  body("ids").isArray({ min: 1 }).withMessage("At least one ID is required"),
  body("ids.*").isMongoId().withMessage("Invalid ID format"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// COUPON VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddCoupon = [
  body("title").notEmpty().withMessage("Coupon title is required"),
  body("couponCode")
    .notEmpty()
    .withMessage("Coupon code is required")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Coupon code must be between 3 and 30 characters"),
  body("endTime").notEmpty().withMessage("End time is required"),
  body("discountType")
    .optional()
    .isObject()
    .withMessage("Discount type must be an object"),
  body("minimumAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be a positive number"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

const validateUpdateCoupon = [
  body("couponCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Coupon code must be between 3 and 30 characters"),
  body("minimumAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be a positive number"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// CAMPAIGN VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddCampaign = [
  body("title").notEmpty().withMessage("Campaign title is required"),
  body("slug")
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase alphanumeric with hyphens (e.g. summer-sale)",
    ),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date"),
  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),
  body("products.*.product")
    .notEmpty()
    .withMessage("Product ID is required for each campaign product"),
  body("products.*.campaignPrice")
    .isFloat({ min: 0 })
    .withMessage("Campaign price must be a positive number"),
  body("products.*.originalPrice")
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("products.*.discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be 'percentage' or 'fixed'"),
  body("products.*.discountValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a positive number"),
  body("products.*.stockLimit")
    .isInt({ min: 1 })
    .withMessage("Stock limit must be at least 1"),
  body("showSection")
    .optional()
    .isIn(["home_top", "home_middle", "home_bottom", "sidebar", "none"])
    .withMessage("Invalid display section"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

const validateUpdateCampaign = [
  body("slug")
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase alphanumeric with hyphens (e.g. summer-sale)",
    ),
  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date"),
  body("products")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),
  body("products.*.product")
    .optional()
    .notEmpty()
    .withMessage("Product ID is required for each campaign product"),
  body("products.*.campaignPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Campaign price must be a positive number"),
  body("products.*.originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("products.*.discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be 'percentage' or 'fixed'"),
  body("products.*.discountValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a positive number"),
  body("products.*.stockLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Stock limit must be at least 1"),
  body("showSection")
    .optional()
    .isIn(["home_top", "home_middle", "home_bottom", "sidebar", "none"])
    .withMessage("Invalid display section"),
  body("status")
    .optional()
    .isIn(["show", "hide"])
    .withMessage("Status must be 'show' or 'hide'"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// ORDER VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddOrder = [
  body("cart")
    .isArray({ min: 1 })
    .withMessage("Cart must be a non-empty array"),
  body("user_info").notEmpty().withMessage("User info is required"),
  body("user_info.name").notEmpty().withMessage("Customer name is required"),
  body("user_info.contact")
    .notEmpty()
    .withMessage("Customer contact is required"),
  body("user_info.address")
    .notEmpty()
    .withMessage("Delivery address is required"),
  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn([
      "Cash",
      "Card",
      "Credit",
      "cod",
      "stripe",
      "razorpay",
      "paypal",
      "Cash on Delivery",
    ])
    .withMessage("Invalid payment method"),
  body("subTotal")
    .notEmpty()
    .withMessage("Subtotal is required")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number"),
  body("total")
    .notEmpty()
    .withMessage("Total is required")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
  body("shippingCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be a positive number"),
  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be a positive number"),
  validate,
];

const validateGuestOrder = [
  body("cart")
    .isArray({ min: 1 })
    .withMessage("Cart must be a non-empty array"),
  body("user_info").notEmpty().withMessage("User info is required"),
  body("user_info.name").notEmpty().withMessage("Customer name is required"),
  body("user_info.contact")
    .notEmpty()
    .withMessage("Customer contact is required"),
  body("user_info.address")
    .notEmpty()
    .withMessage("Delivery address is required"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
  body("subTotal")
    .notEmpty()
    .withMessage("Subtotal is required")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number"),
  body("total")
    .notEmpty()
    .withMessage("Total is required")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
  validate,
];

const validateUpdateOrder = [
  body("status")
    .optional()
    .isIn([
      "pending",
      "processing",
      "delivered",
      "cancel",
      "cancelled",
      "deleted",
      "shipped",
      "out-for-delivery",
    ])
    .withMessage("Invalid order status"),
  validate,
];

const validatePaymentIntent = [
  body("total")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// SETTING VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateSettingUpdate = [
  body().notEmpty().withMessage("Setting data is required"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// ATTRIBUTE VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateAddAttribute = [
  body("title").notEmpty().withMessage("Attribute title is required"),
  body("name").notEmpty().withMessage("Attribute name is required"),
  body("option")
    .notEmpty()
    .withMessage("Attribute option is required")
    .isIn(["dropdown", "radio", "checkbox"])
    .withMessage("Option must be dropdown, radio, or checkbox"),
  validate,
];

const validateUpdateAttribute = [
  body("title").optional(),
  body("name").optional(),
  body("option")
    .optional()
    .isIn(["dropdown", "radio", "checkbox"])
    .withMessage("Option must be dropdown, radio, or checkbox"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// SHIPPING ADDRESS VALIDATORS
// ══════════════════════════════════════════════════════════════════════

const validateShippingAddress = [
  body("name")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Name is too long"),
  body("address")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Address is too long"),
  body("contact")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Contact is too long"),
  validate,
];

// ══════════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════════

module.exports = {
  validate,
  validateMongoId,

  // Admin
  validateAdminLogin,
  validateAdminRegister,
  validateAddStaff,
  validateUpdateStaff,
  validateAdminForgetPassword,
  validateAdminResetPassword,
  validateAssignRole,
  validateUpdateStatus,

  // Customer
  validateCustomerLogin,
  validateCustomerEmailVerify,
  validateCustomerForgetPassword,
  validateCustomerResetPassword,
  validateCustomerChangePassword,
  validateUpdateCustomer,
  validateOAuthSignUp,
  validatePhoneVerification,
  validateOtpConfirm,
  validateEmailOtp,
  validateRefreshToken,

  // Product
  validateAddProduct,
  validateUpdateProduct,
  validateUpdateManyProducts,
  validateProductStatus,

  // Category
  validateAddCategory,
  validateUpdateCategory,
  validateCategoryStatus,
  validateDeleteMany,

  // Coupon
  validateAddCoupon,
  validateUpdateCoupon,

  // Campaign
  validateAddCampaign,
  validateUpdateCampaign,

  // Order
  validateAddOrder,
  validateGuestOrder,
  validateUpdateOrder,
  validatePaymentIntent,

  // Settings
  validateSettingUpdate,

  // Attribute
  validateAddAttribute,
  validateUpdateAttribute,

  // Shipping
  validateShippingAddress,
};
