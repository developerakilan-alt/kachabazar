const express = require("express");
const router = express.Router();
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} = require("../controller/productController");
const { isAuth, isAdmin } = require("../config/auth");
const {
  validateAddProduct,
  validateUpdateProduct,
  validateUpdateManyProducts,
  validateProductStatus,
  validateDeleteMany,
  validateMongoId,
} = require("../middleware/validators");

// ── Public Routes (storefront) ──

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get showing products only
router.get("/show", getShowingProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

// ── Admin-Protected Routes ──

//get all products (admin dashboard)
router.get("/", isAuth, isAdmin, getAllProducts);

//add a product (must be before /:id to avoid "add" being treated as an ID)
router.post("/add", isAuth, isAdmin, validateAddProduct, addProduct);

//add multiple products (DANGEROUS: deletes all first)
router.post("/all", isAuth, isAdmin, addAllProducts);

//get a product by id (admin)
router.post("/:id", isAuth, isAdmin, validateMongoId, getProductById);

//update a product
router.patch(
  "/:id",
  isAuth,
  isAdmin,
  validateMongoId,
  validateUpdateProduct,
  updateProduct,
);

//update many products
router.patch(
  "/update/many",
  isAuth,
  isAdmin,
  validateUpdateManyProducts,
  updateManyProducts,
);

//update a product status
router.put(
  "/status/:id",
  isAuth,
  isAdmin,
  validateMongoId,
  validateProductStatus,
  updateStatus,
);

//delete a product
router.delete("/:id", isAuth, isAdmin, validateMongoId, deleteProduct);

//delete many product
router.patch(
  "/delete/many",
  isAuth,
  isAdmin,
  validateDeleteMany,
  deleteManyProducts,
);

module.exports = router;
