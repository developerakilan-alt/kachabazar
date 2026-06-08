const express = require("express");
const router = express.Router();
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getShowingCoupons,
  getCouponById,
  verifyCoupon,
  updateCoupon,
  updateStatus,
  deleteCoupon,
  updateManyCoupons,
  deleteManyCoupons,
} = require("../controller/couponController");
const { isAuth, isAdmin } = require("../config/auth");
const {
  validateAddCoupon,
  validateUpdateCoupon,
  validateDeleteMany,
  validateCategoryStatus,
} = require("../middleware/validators");

// ── Public Routes ──

//get only enable coupon (storefront)
router.get("/show", getShowingCoupons);

//verify a coupon by code (storefront)
router.get("/verify/:couponCode", verifyCoupon);

// ── Admin-Protected Routes ──

//add a coupon
router.post("/add", isAuth, isAdmin, validateAddCoupon, addCoupon);

//add multiple coupon
router.post("/add/all", isAuth, isAdmin, addAllCoupon);

//get all coupon (admin)
router.get("/", isAuth, isAdmin, getAllCoupons);

//get a coupon
router.get("/:id", isAuth, isAdmin, getCouponById);

//update a coupon
router.put("/:id", isAuth, isAdmin, validateUpdateCoupon, updateCoupon);

//update many coupon
router.patch("/update/many", isAuth, isAdmin, updateManyCoupons);

//show/hide a coupon
router.put(
  "/status/:id",
  isAuth,
  isAdmin,
  validateCategoryStatus,
  updateStatus,
);

//delete a coupon
router.delete("/:id", isAuth, isAdmin, deleteCoupon);

//delete many coupon
router.patch(
  "/delete/many",
  isAuth,
  isAdmin,
  validateDeleteMany,
  deleteManyCoupons,
);

module.exports = router;
