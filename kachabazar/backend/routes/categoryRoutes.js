const express = require("express");
const router = express.Router();
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getAllCategories,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory,
  applyCategoryScope,
  flattenCategories,
} = require("../controller/categoryController");
const { isAuth, isAdmin } = require("../config/auth");
const {
  validateAddCategory,
  validateUpdateCategory,
  validateCategoryStatus,
  validateDeleteMany,
} = require("../middleware/validators");

// ── Public Routes ──

//get only showing category (storefront)
router.get("/show", getShowingCategory);

//get all categories (storefront)
router.get("/all", getAllCategories);

// ── Admin-Protected Routes ──

//add a category
router.post("/add", isAuth, isAdmin, validateAddCategory, addCategory);

//add all category
router.post("/add/all", isAuth, isAdmin, addAllCategory);

//get all category (admin)
router.get("/", isAuth, isAdmin, getAllCategory);

// apply scope: show only scoped categories, hide all others
router.put("/apply-scope", isAuth, isAdmin, applyCategoryScope);

// flatten categories: merge duplicates, clear parentId, remove non-jewelry
router.put("/flatten", isAuth, isAdmin, flattenCategories);

//get a category
router.get("/:id", isAuth, isAdmin, getCategoryById);

//update a category
router.put("/:id", isAuth, isAdmin, validateUpdateCategory, updateCategory);

//show/hide a category
router.put(
  "/status/:id",
  isAuth,
  isAdmin,
  validateCategoryStatus,
  updateStatus,
);

//delete a category
router.delete("/:id", isAuth, isAdmin, deleteCategory);

// delete many category
router.patch(
  "/delete/many",
  isAuth,
  isAdmin,
  validateDeleteMany,
  deleteManyCategory,
);

// update many category
router.patch("/update/many", isAuth, isAdmin, updateManyCategory);

module.exports = router;
