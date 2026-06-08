const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  refreshToken,
  registerCustomer,
  verifyPhoneNumber,
  confirmPhoneOtp,
  resendPhoneOtp,
  sendEmailOtp,
  confirmEmailOtp,
  resendEmailOtp,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  deleteManyCustomers,
  addAllCustomers,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} = require("../controller/customerController");
const {
  passwordVerificationLimit,
  emailVerificationLimit,
  phoneVerificationLimit,
  otpConfirmLimit,
} = require("../lib/email-sender/sender");
const {
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
  validateShippingAddress,
  validateDeleteMany,
} = require("../middleware/validators");

// ===========================================
// EMAIL VERIFICATION ROUTES
// ===========================================

// Verify email (link-based - legacy)
router.post(
  "/verify-email",
  emailVerificationLimit,
  validateCustomerEmailVerify,
  verifyEmailAddress,
);

// Send email OTP (OTP-based - new)
router.post(
  "/send-email-otp",
  emailVerificationLimit,
  validateEmailOtp,
  sendEmailOtp,
);

// Confirm email OTP and login/register
router.post(
  "/confirm-email-otp",
  otpConfirmLimit,
  validateOtpConfirm,
  confirmEmailOtp,
);

// Resend email OTP
router.post("/resend-email-otp", emailVerificationLimit, resendEmailOtp);

// ===========================================
// PHONE VERIFICATION ROUTES
// ===========================================

// Verify phone number (send OTP)
router.post(
  "/verify-phone",
  phoneVerificationLimit,
  validatePhoneVerification,
  verifyPhoneNumber,
);

// Confirm phone OTP and login/register
router.post(
  "/confirm-phone-otp",
  otpConfirmLimit,
  validateOtpConfirm,
  confirmPhoneOtp,
);

// Resend phone OTP
router.post("/resend-phone-otp", phoneVerificationLimit, resendPhoneOtp);

// ===========================================
// SHIPPING ADDRESS ROUTES
// ===========================================

// shipping address send to array
router.post(
  "/shipping/address/:id",
  validateShippingAddress,
  addShippingAddress,
);

// get all shipping address
router.get("/shipping/address/:id", getShippingAddress);

// shipping address update
router.put(
  "/shipping/address/:userId/:shippingId",
  validateShippingAddress,
  updateShippingAddress,
);

// shipping address delete
router.delete("/shipping/address/:userId/:shippingId", deleteShippingAddress);

//register a user
router.post("/register/:token", registerCustomer);

//login a user
router.post("/login", validateCustomerLogin, loginCustomer);

// refresh token
router.post("/refresh", validateRefreshToken, refreshToken);

//register or login with google and fb
router.post("/signup/oauth", validateOAuthSignUp, signUpWithOauthProvider);

//forget-password
router.put(
  "/forget-password",
  passwordVerificationLimit,
  validateCustomerForgetPassword,
  forgetPassword,
);

//reset-password
router.put("/reset-password", validateCustomerResetPassword, resetPassword);

//change password
router.post("/change-password", validateCustomerChangePassword, changePassword);

//add all users
router.post("/add/all", addAllCustomers);

//get all user
router.get("/", getAllCustomers);

//delete many users
router.patch("/delete/many", validateDeleteMany, deleteManyCustomers);

//get a user
router.get("/:id", getCustomerById);

//update a user
router.put("/:id", validateUpdateCustomer, updateCustomer);

//delete a user
router.delete("/:id", deleteCustomer);

module.exports = router;
