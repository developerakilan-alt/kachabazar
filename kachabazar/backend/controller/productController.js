const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Review = require("../models/Review");
const { languageCodes } = require("../utils/data");

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      // productId: cname + (count + 1),
      productId: req.body.productId
        ? req.body.productId
        : new mongoose.Types.ObjectId(),
    });

    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    // SAFETY: Block in production — this endpoint deletes ALL products
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send({
        message:
          "Bulk product replacement is disabled in production. Use individual add/update endpoints instead.",
      });
    }
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: "Product Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [products, totalDoc] = await Promise.all([
      Product.find({ status: "show" })
        .select(
          "title slug image prices stock status category categories isCombination variants average_rating total_reviews",
        )
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .maxTimeMS(10000)
        .lean(),
      Product.countDocuments({ status: "show" }),
    ]);

    res.send({
      products,
      totalDoc,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;

  // console.log("getAllProducts");

  let queryObject = {};
  let sortObject = {};
  if (title) {
    const titleQueries = languageCodes.map((lang) => ({
      [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
    }));
    queryObject.$or = titleQueries;
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits)
      .maxTimeMS(15000)
      .lean();

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    // console.log("error", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  // console.log("slug", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" });

    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  // console.log('update product')
  // console.log('variant',req.body.variants)
  try {
    const product = await Product.findById(req.params.id);
    // console.log("product", product);

    if (product) {
      product.title = { ...product.title, ...req.body.title };
      product.description = {
        ...product.description,
        ...req.body.description,
      };

      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.image = req.body.image;
      product.tag = req.body.tag;

      // Update SEO fields if provided
      if (req.body.seo) {
        product.seo = {
          meta_title: req.body.seo.meta_title || product.seo?.meta_title,
          meta_description:
            req.body.seo.meta_description || product.seo?.meta_description,
          meta_keywords:
            req.body.seo.meta_keywords || product.seo?.meta_keywords,
          og_image: req.body.seo.og_image || product.seo?.og_image,
        };
      }

      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
    // console.log('err',err)
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      },
    );
    res.send({
      message: "Products update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    res.status(200).send({
      message: `Product ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Product Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingStoreProducts = async (req, res) => {
  try {
    const queryObject = { status: "show" };

    const { category, title, slug } = req.query;

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
      }));

      queryObject.$or = titleQueries;
    }
    if (slug) {
      queryObject.slug = { $regex: slug, $options: "i" };
    }

    // Use .lean() for all read-only queries — avoids Mongoose hydration overhead
    const selectFields =
      "title slug image prices stock status category categories isCombination variants average_rating total_reviews sales seo description";

    let products = [];
    let popularProducts = [];
    let discountedProducts = [];
    let relatedProducts = [];
    let reviews = [];

    if (slug) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .select(selectFields + " description")
        .sort({ _id: -1 })
        .limit(100)
        .maxTimeMS(10000)
        .lean();
      if (products.length > 0) {
        // Fetch related products and reviews in parallel
        const [relatedRes, reviewsRes] = await Promise.all([
          Product.find({
            category: products[0]?.category,
            _id: { $ne: products[0]._id },
            status: "show",
          })
            .populate({ path: "category", select: "_id name" })
            .select(selectFields)
            .limit(12)
            .lean(),
          Review.find({ product: products[0]._id })
            .populate({ path: "user", select: "name image" })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean(),
        ]);
        relatedProducts = relatedRes;
        reviews = reviewsRes;
      }
    } else if (title || category) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .select(selectFields)
        .sort({ _id: -1 })
        .limit(100)
        .maxTimeMS(10000)
        .lean();
    } else {
      // Homepage — fetch popular and discounted products in parallel
      const [productsRes, popularRes, discountedRes] = await Promise.all([
        Product.find({ status: "show" })
          .populate({ path: "category", select: "name _id" })
          .select(selectFields)
          .sort({ _id: -1 })
          .limit(200)
          .lean(),
        Product.find({ status: "show" })
          .populate({ path: "category", select: "name _id" })
          .select(selectFields)
          .sort({ sales: -1 })
          .limit(20)
          .lean(),
        Product.find({
          status: "show",
          $or: [
            {
              $and: [
                { isCombination: true },
                {
                  variants: {
                    $elemMatch: {
                      discount: { $gt: "0.00" },
                    },
                  },
                },
              ],
            },
            {
              $and: [
                { isCombination: false },
                {
                  $expr: {
                    $gt: [{ $toDouble: "$prices.discount" }, 0],
                  },
                },
              ],
            },
          ],
        })
          .populate({ path: "category", select: "name _id" })
          .select(selectFields)
          .sort({ _id: -1 })
          .limit(20)
          .lean(),
      ]);
      products = productsRes;
      popularProducts = popularRes;
      discountedProducts = discountedRes;
    }

    res.send({
      reviews,
      products,
      popularProducts,
      relatedProducts,
      discountedProducts,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: { $in: req.body.ids } });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
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
};
