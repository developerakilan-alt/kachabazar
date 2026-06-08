require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const Coupon = require("../models/Coupon");

connectDB();
const cleanup = async () => {
  try {
    const { deletedCount: products } = await Product.deleteMany({});
    const { deletedCount: categories } = await Category.deleteMany({});
    const { deletedCount: reviews } = await Review.deleteMany({});
    const { deletedCount: coupons } = await Coupon.deleteMany({});
    console.log(`Deleted: ${products} products, ${categories} categories, ${reviews} reviews, ${coupons} coupons`);
    process.exit(0);
  } catch (err) {
    console.error("Cleanup error:", err);
    process.exit(1);
  }
};
cleanup();
