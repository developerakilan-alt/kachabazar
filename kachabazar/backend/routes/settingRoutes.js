const router = require("express").Router();
const {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
  addStoreSetting,
  getStoreSetting,
  getStoreSecretKeys,
  updateStoreSetting,
  getStoreSeoSetting,
  addStoreCustomizationSetting,
  getStoreCustomizationSetting,
  updateStoreCustomizationSetting,
} = require("../controller/settingController");
const { isAuth, isAdmin } = require("../config/auth");
const { validateSettingUpdate } = require("../middleware/validators");

/**
 * Global Settings
 */
router.get("/global", getGlobalSetting); // Public read
router.post(
  "/global",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  addGlobalSetting,
); // Admin write
router.put(
  "/global",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  updateGlobalSetting,
); // Admin write

/**
 * Store Settings
 */
router.get("/store-setting", getStoreSetting); // Public read
router.get("/store-setting/seo", getStoreSeoSetting); // Public read
router.get("/store-setting/keys", isAuth, isAdmin, getStoreSecretKeys); // Admin only
router.post(
  "/store-setting",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  addStoreSetting,
); // Admin write
router.put(
  "/store-setting",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  updateStoreSetting,
); // Admin write

/**
 * Store Customization
 */
router.get("/store/customization", getStoreCustomizationSetting); // Public read
router.post(
  "/store/customization",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  addStoreCustomizationSetting,
); // Admin write
router.put(
  "/store/customization",
  isAuth,
  isAdmin,
  validateSettingUpdate,
  updateStoreCustomizationSetting,
); // Admin write

module.exports = router;
