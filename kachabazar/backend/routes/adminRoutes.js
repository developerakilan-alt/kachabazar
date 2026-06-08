const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  assignRole,
  unassignRole,
} = require("../controller/adminController");

const { isAuth, isAdmin } = require("../config/auth");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");
const {
  validateAdminLogin,
  validateAdminRegister,
  validateAddStaff,
  validateUpdateStaff,
  validateAdminForgetPassword,
  validateAdminResetPassword,
  validateAssignRole,
  validateUpdateStatus,
} = require("../middleware/validators");

/**
 * Admin Authentication (Public)
 */
// Admin login
router.post("/login", validateAdminLogin, loginAdmin);
// Forget password
router.put(
  "/forget-password",
  passwordVerificationLimit,
  validateAdminForgetPassword,
  forgetPassword,
);
// Reset password
router.put("/reset-password", validateAdminResetPassword, resetPassword);

/**
 * Staff Management (Protected — requires admin auth)
 */
// Register admin/staff (only authenticated admins can create new accounts)
router.post("/register", isAuth, isAdmin, validateAdminRegister, registerAdmin);
// Add a staff
router.post("/add", isAuth, isAdmin, validateAddStaff, addStaff);
// Get all staff
router.get("/", isAuth, isAdmin, getAllStaff);
// Get a single staff by ID
router.get("/:id", isAuth, isAdmin, getStaffById);
// Update a staff by ID
router.put("/:id", isAuth, isAdmin, validateUpdateStaff, updateStaff);
// Update staff status by ID
router.put(
  "/update-status/:id",
  isAuth,
  isAdmin,
  validateUpdateStatus,
  updatedStatus,
);
// Assign role to a staff member
router.put("/assign-role/:id", isAuth, isAdmin, validateAssignRole, assignRole);
// Unassign role from a staff member
router.put("/unassign-role/:id", isAuth, isAdmin, unassignRole);
// Delete a staff by ID
router.delete("/:id", isAuth, isAdmin, deleteStaff);

module.exports = router;
