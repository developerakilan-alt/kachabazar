const Category = require("../models/Category");
const Product = require("../models/Product");

const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple category
const addAllCategory = async (req, res) => {
  try {
    // SAFETY: Block in production — this endpoint deletes ALL categories
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send({
        message:
          "Bulk category replacement is disabled in production. Use individual add/update endpoints instead.",
      });
    }
    await Category.deleteMany();

    await Category.insertMany(req.body);

    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show category
const getShowingCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "show" }).sort({
      _id: -1,
    });

    const counts = await Product.aggregate([
      { $match: { status: "show" } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const buildCategoryTree = (cats, parentId = null) => {
      const categoryList = [];
      const filtered = cats.filter((cat) =>
        parentId ? cat.parentId == parentId : !cat.parentId,
      );

      for (let cate of filtered) {
        const children = buildCategoryTree(cats, cate._id.toString());
        // Parent total is its own direct products + all children's products
        const myCount = countMap.get(cate._id.toString()) || 0;
        const childrenCount = children.reduce(
          (sum, child) => sum + (child.productCount || 0),
          0,
        );

        categoryList.push({
          _id: cate._id,
          name: cate.name,
          slug: cate.slug,
          parentId: cate.parentId,
          parentName: cate.parentName,
          description: cate.description,
          icon: cate.icon,
          status: cate.status,
          productCount: myCount + childrenCount,
          children: children,
        });
      }
      return categoryList;
    };

    const categoryList = buildCategoryTree(categories);
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all category parent and child
const getAllCategory = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      status: catStatus,
      sortBy,
      sortOrder,
      parentOnly, // New param: if "true", only return parent categories (no parentId)
    } = req.query;

    // If no page/limit provided, return tree (legacy behavior for store-front / dropdowns)
    if (!page && !limit) {
      const categories = await Category.find({}).sort({ _id: -1 });
      const categoryList = readyToParentAndChildrenCategory(categories);
      return res.send(categoryList);
    }

    // Server-side paginated flat query for admin table
    const queryObject = {};

    // Filter to show only top-level categories (children of "Home" root) unless searching or parentOnly=false
    if (parentOnly === "true" && !search) {
      // First, find the root "Home" category
      const rootCategory = await Category.findOne({
        $or: [
          { parentId: { $exists: false } },
          { parentId: null },
          { parentId: "" },
        ],
      });

      if (rootCategory) {
        // Show categories that are direct children of the root "Home" category
        queryObject.parentId = rootCategory._id.toString();
      }
    }

    // Published status filter
    if (catStatus) {
      queryObject.status = catStatus;
    }

    // Search across name and description (multilingual Object fields)
    if (search) {
      const { languageCodes } = require("../utils/data");
      const nameQueries = languageCodes.map((lang) => ({
        [`name.${lang}`]: { $regex: search, $options: "i" },
      }));
      const descQueries = languageCodes.map((lang) => ({
        [`description.${lang}`]: { $regex: search, $options: "i" },
      }));
      queryObject.$or = [...nameQueries, ...descQueries];
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Category.countDocuments(queryObject);
    const categories = await Category.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    // Build parent-child data for display (only the children of each returned category)
    const allCategories = await Category.find({}).select(
      "_id parentId name status",
    );
    const categoriesWithChildren = categories.map((cat) => {
      const children = allCategories.filter(
        (c) => c.parentId && c.parentId.toString() === cat._id.toString(),
      );
      return {
        ...cat.toObject(),
        children,
      };
    });

    res.send({
      categories: categoriesWithChildren,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = { ...category.name, ...req.body.name };
      category.description = {
        ...category.description,
        ...req.body.description,
      };
      category.icon = req.body.icon;
      category.status = req.body.status;
      category.parentId = req.body.parentId
        ? req.body.parentId
        : category.parentId;
      category.parentName = req.body.parentName;

      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many category
const updateManyCategory = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Category.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      },
    );

    res.send({
      message: "Categories update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    res.status(200).send({
      message: `Category ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single category delete
const deleteCategory = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children category
  // Category.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Category Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple category delete
const deleteManyCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    await Category.deleteMany({ parentId: req.body.ids });
    await Category.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenCategory = (categories, parentId = null) => {
  const categoryList = [];
  let Categories;
  if (parentId == null) {
    Categories = categories.filter((cat) => cat.parentId == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate._id),
    });
  }

  return categoryList;
};

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  updateManyCategory,
};
