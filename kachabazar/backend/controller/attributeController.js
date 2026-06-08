const Attribute = require("../models/Attribute");
const { handleProductAttribute } = require("../lib/stock-controller/others");

const addAttribute = async (req, res) => {
  try {
    const newAttribute = new Attribute(req.body);
    await newAttribute.save();
    res.send({
      message: "Attribute Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: `Error occur when adding attribute ${err.message}`,
    });
  }
};
// add child attributes
const addChildAttributes = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);
    await Attribute.updateOne(
      { _id: attribute._id },
      { $push: { variants: req.body } },
    );
    res.send({
      message: "Attribute Value Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllAttributes = async (req, res) => {
  try {
    // SAFETY: Block in production — this endpoint deletes ALL attributes
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send({
        message:
          "Bulk attribute replacement is disabled in production. Use individual endpoints instead.",
      });
    }
    await Attribute.deleteMany();
    await Attribute.insertMany(req.body);
    res.send({
      message: "Added all attributes successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllAttributes = async (req, res) => {
  try {
    const {
      type,
      option,
      option1,
      page,
      limit,
      search,
      status: attrStatus,
      sortBy,
      sortOrder,
    } = req.query;

    // If no page/limit provided, return all (legacy behavior for store-front)
    if (!page && !limit) {
      const attributes = await Attribute.find({
        $or: [
          { type: type },
          { $or: [{ option: option }, { option: option1 }] },
        ],
      });
      return res.send(attributes);
    }

    // Server-side paginated query for admin
    const queryObject = {};

    // Type filter
    if (type) {
      queryObject.type = type;
    }

    // Option filter (Dropdown / Radio / Checkbox)
    if (option && option1) {
      queryObject.$or = [{ option: option }, { option: option1 }];
    } else if (option) {
      queryObject.option = option;
    }

    // Published status filter
    if (attrStatus) {
      queryObject.status = attrStatus;
    }

    // Search across title and name (multilingual Object fields)
    if (search) {
      const { languageCodes } = require("../utils/data");
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: search, $options: "i" },
      }));
      const nameQueries = languageCodes.map((lang) => ({
        [`name.${lang}`]: { $regex: search, $options: "i" },
      }));
      const searchCondition = { $or: [...titleQueries, ...nameQueries] };

      if (queryObject.$or) {
        // Merge with existing $or (option filters)
        queryObject.$and = [{ $or: queryObject.$or }, searchCondition];
        delete queryObject.$or;
      } else {
        queryObject.$or = searchCondition.$or;
      }
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Attribute.countDocuments(queryObject);
    const attributes = await Attribute.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      attributes,
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

const getShowingAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.aggregate([
      {
        $match: {
          status: "show",
          "variants.status": "show",
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          title: 1,
          name: 1,
          option: 1,
          createdAt: 1,
          updateAt: 1,
          variants: {
            $filter: {
              input: "$variants",
              cond: {
                $eq: ["$$this.status", "show"],
              },
            },
          },
        },
      },
    ]);
    console.log("getShowingAttributes", attributes.length);
    // console.log({ attributes });

    res.send(attributes);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingAttributesTest = async (req, res) => {
  try {
    const attributes = await Attribute.find({ status: "show" });
    res.send(attributes);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// update many attribute
const updateManyAttribute = async (req, res) => {
  try {
    await Attribute.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          option: req.body.option,
          status: req.body.status,
        },
      },
      {
        multi: true,
      },
    );

    res.send({
      message: "Attributes update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    // console.log(attribute);

    res.send(attribute);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getChildAttributeById = async (req, res) => {
  try {
    const { id, ids } = req.params;

    const attribute = await Attribute.findOne({
      _id: id,
    });

    const childAttribute = attribute.variants.find((attr) => {
      return attr._id == ids;
    });

    res.send(childAttribute);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateAttributes = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (attribute) {
      attribute.title = { ...attribute.title, ...req.body.title };
      attribute.name = { ...attribute.name, ...req.body.name };
      attribute._id = req.params.id;
      //attribute.title = req.body.title;
      // attribute.name = req.body.name;
      attribute.option = req.body.option;
      attribute.type = req.body.type;
      // attribute.variants = req.body.variants;
    }
    await attribute.save();
    res.send({
      message: "Attribute updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// update child attributes
const updateChildAttributes = async (req, res) => {
  try {
    const { attributeId, childId } = req.params;

    let attribute = await Attribute.findOne({
      _id: attributeId,
      "variants._id": childId,
    });

    if (attribute) {
      const att = attribute.variants.find((v) => v._id.toString() === childId);

      const name = {
        ...att.name,
        ...req.body.name,
      };

      await Attribute.updateOne(
        { _id: attributeId, "variants._id": childId },
        {
          $set: {
            "variants.$.name": name,
            "variants.$.status": req.body.status,
          },
        },
      );
    }

    res.send({
      message: "Attribute Value Updated Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// update many attribute
const updateManyChildAttribute = async (req, res) => {
  try {
    // select attribute value
    const childIdAttribute = await Attribute.findById(req.body.currentId);

    const final = childIdAttribute.variants.filter((value) =>
      req.body.ids.find((value1) => value1 == value._id),
    );

    const updateStatusAttribute = final.map((value) => {
      value.status = req.body.status;
      return value;
    });

    // group attribute
    let totalVariants = [];
    if (req.body.changeId) {
      const groupIdAttribute = await Attribute.findById(req.body.changeId);
      totalVariants = [...groupIdAttribute.variants, ...updateStatusAttribute];
    }

    if (totalVariants.length === 0) {
      await Attribute.updateOne(
        { _id: req.body.currentId },
        {
          $set: {
            variants: childIdAttribute.variants,
          },
        },
        {
          multi: true,
        },
      );
    } else {
      await Attribute.updateOne(
        { _id: req.body.changeId },
        {
          $set: {
            variants: totalVariants,
          },
        },
        {
          multi: true,
        },
      );

      await Attribute.updateOne(
        { _id: req.body.currentId },
        {
          $pull: { variants: { _id: req.body.ids } },
        },
        {
          multi: true,
        },
      );
    }

    res.send({
      message: "Attribute Values update successfully!",
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
    await Attribute.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    res.status(200).send({
      message: `Attribute ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateChildStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Attribute.updateOne(
      { "variants._id": req.params.id },
      {
        $set: {
          "variants.$.status": newStatus,
        },
      },
    );
    res.status(200).send({
      message: `Attribute Value ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteAttribute = async (req, res) => {
  try {
    await Attribute.deleteOne({ _id: req.params.id });
    res.send({
      message: "Attribute Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// delete child attribute
const deleteChildAttribute = async (req, res) => {
  try {
    const { attributeId, childId } = req.params;

    await Attribute.updateOne(
      { _id: attributeId },
      { $pull: { variants: { _id: childId } } },
    );

    await handleProductAttribute(attributeId, childId);
    res.send({
      message: "Attribute Value Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyAttribute = async (req, res) => {
  try {
    await Attribute.deleteMany({ _id: req.body.ids });
    // console.log('delete many attribute');
    res.send({
      message: `Attributes Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyChildAttribute = async (req, res) => {
  try {
    await Attribute.updateOne(
      { _id: req.body.id },
      {
        $pull: { variants: { _id: req.body.ids } },
      },
      {
        multi: true,
      },
    );

    await handleProductAttribute(req.body.id, req.body.ids, "multi");
    res.send({
      message: `Attribute Values Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addAttribute,
  addAllAttributes,
  getAllAttributes,
  getShowingAttributes,
  getAttributeById,
  updateAttributes,
  updateStatus,
  updateChildStatus,
  deleteAttribute,
  getShowingAttributesTest,
  deleteChildAttribute,
  addChildAttributes,
  updateChildAttributes,
  getChildAttributeById,
  updateManyAttribute,
  deleteManyAttribute,
  updateManyChildAttribute,
  deleteManyChildAttribute,
};
