const express = require("express");
const router = express.Router();
const {
  addCampaign,
  getAllCampaigns,
  getShowingCampaigns,
  getFeaturedCampaign,
  getAllShowingCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  updateStatus,
  recordCampaignSale,
  checkProductCampaign,
  deleteCampaign,
  deleteManyCampaigns,
  updateManyCampaigns,
} = require("../controller/campaignController");
const { isAuth, isAdmin } = require("../config/auth");
const {
  validateAddCampaign,
  validateUpdateCampaign,
  validateDeleteMany,
  validateCategoryStatus,
} = require("../middleware/validators");

// ── Public Routes (storefront) ──

// Get active campaigns for store display
router.get("/show", getShowingCampaigns);

// Get featured campaign for home page
router.get("/featured", getFeaturedCampaign);

// Get all showing campaigns (flash sale page)
router.get("/all", getAllShowingCampaigns);

// Get campaign by slug (store detail page)
router.get("/slug/:slug", getCampaignBySlug);

// Check if product is in active campaign
router.get("/check-product/:productId", checkProductCampaign);

// ── Admin-Protected Routes ──

// Add a campaign
router.post("/add", isAuth, isAdmin, validateAddCampaign, addCampaign);

// Get all campaigns (admin list)
router.get("/", isAuth, isAdmin, getAllCampaigns);

// Get campaign by ID
router.get("/:id", isAuth, isAdmin, getCampaignById);

// Update a campaign
router.put("/:id", isAuth, isAdmin, validateUpdateCampaign, updateCampaign);

// Update many campaigns
router.patch("/update/many", isAuth, isAdmin, updateManyCampaigns);

// Show/hide a campaign
router.put(
  "/status/:id",
  isAuth,
  isAdmin,
  validateCategoryStatus,
  updateStatus,
);

// Record a campaign sale
router.post("/sale", isAuth, recordCampaignSale);

// Delete a campaign
router.delete("/:id", isAuth, isAdmin, deleteCampaign);

// Delete many campaigns
router.patch(
  "/delete/many",
  isAuth,
  isAdmin,
  validateDeleteMany,
  deleteManyCampaigns,
);

module.exports = router;
