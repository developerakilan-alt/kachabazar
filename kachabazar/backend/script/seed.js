// ⚠️  DANGER — This script DELETES ALL EXISTING DATA and replaces it with demo data.
// It will destroy any products, categories, orders, customers, and settings you've added
// through the admin panel. Only run this on a fresh/empty database.

require("dotenv").config();
const { connectDB } = require("../config/db");
const readline = require("readline");

const Admin = require("../models/Admin");
const adminData = require("../utils/admin");

const Customer = require("../models/Customer");
const customerData = require("../utils/customers");

const Coupon = require("../models/Coupon");
const couponData = require("../utils/coupon");

const Product = require("../models/Product");
const productData = require("../utils/products");
const productsWithReviews = require("../utils/product-with-reviews");

const Order = require("../models/Order");
const orderData = require("../utils/orders");

const Category = require("../models/Category");
const categoryData = require("../utils/categories");

const Language = require("../models/Language");
const languageData = require("../utils/language");

const Currency = require("../models/Currency");
const currencyData = require("../utils/currency");

const Attribute = require("../models/Attribute");
const attributeData = require("../utils/attributes");

const Setting = require("../models/Setting");
const settingData = require("../utils/settings");

const Review = require("../models/Review");
const reviewsData = require("../utils/reviews");

const Theme = require("../models/Theme");
const themeData = require("../utils/themes");

const DeliveryBoy = require("../models/DeliveryBoy");
const deliveryBoyData = require("../utils/deliveryBoys");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

connectDB();
const importData = async () => {
  try {
    const answer = await ask(
      "\n⚠️  WARNING: This will DELETE ALL DATA and replace it with demo data.\n" +
        "Are you sure you want to continue? Type 'yes' to confirm: ",
    );

    if (answer.toLowerCase() !== "yes") {
      console.log("Seed cancelled.");
      process.exit(0);
    }

    const answer2 = await ask(
      "\n☠️  Final warning: ALL products, categories, orders, customers, and settings will be PERMANENTLY DELETED.\n" +
        "Type 'DELETE EVERYTHING' to proceed: ",
    );

    if (answer2 !== "DELETE EVERYTHING") {
      console.log("Seed cancelled.");
      process.exit(0);
    }

    await Language.deleteMany();
    await Language.insertMany(languageData);

    await Currency.deleteMany();
    await Currency.insertMany(currencyData);

    await Attribute.deleteMany();
    await Attribute.insertMany(attributeData);

    await Customer.deleteMany();
    await Customer.insertMany(customerData);

    await Admin.deleteMany();
    await Admin.insertMany(adminData);

    await Category.deleteMany();
    await Category.insertMany(categoryData);

    await Product.deleteMany();
    // await Product.insertMany(productData);
    await Product.insertMany(productsWithReviews);

    await Review.deleteMany();
    await Review.insertMany(reviewsData);

    await Coupon.deleteMany();
    await Coupon.insertMany(couponData);

    await Theme.deleteMany();
    await Theme.insertMany(themeData);

    await DeliveryBoy.deleteMany();
    await DeliveryBoy.insertMany(deliveryBoyData);

    await Order.deleteMany();
    await Order.insertMany(orderData);

    await Setting.deleteMany();
    await Setting.insertMany(settingData);

    console.log("data inserted successfully!");
    process.exit();
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

importData();
