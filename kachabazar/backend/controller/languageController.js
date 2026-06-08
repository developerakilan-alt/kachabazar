const Language = require("../models/Language");
const { mongo_connection } = require("../config/db"); // CCDev

const addLanguage = async (req, res) => {
  try {
    const { name, code, flag } = req.body;
    const exist = await Language.findOne({ name, code, flag });
    if (exist) {
      return res.status(400).send({
        message: "Language already exists!",
      });
    }
    const newLanguage = new Language(req.body);
    await newLanguage.save();
    res.send({
      message: "Language added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllLanguage = async (req, res) => {
  try {
    await Language.insertMany(req.body);
    res.send({ message: "All zones added successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllLanguages = async (req, res) => {
  try {
    const { page, limit, search, status, sortBy, sortOrder } = req.query;

    // If no page/limit, return all (legacy behavior)
    if (!page && !limit) {
      const languages = await Language.find({});
      return res.send(languages);
    }

    // Server-side paginated query
    const queryObject = {};

    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      queryObject.status = status;
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Language.countDocuments(queryObject);
    const languages = await Language.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({ languages, totalDoc, limits, pages });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingLanguage = async (req, res) => {
  try {
    // console.log("getShowingLanguage");

    // console.log('get showing language')
    const languages = await Language.find({ status: "show" }).sort({
      _id: -1,
    });
    res.send(languages);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    res.send(language);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (language) {
      language.name = req.body.name;
      language.code = req.body.code;
      language.flag = req.body.flag;
      language.status = req.body.status;
    }
    await language.save();
    res.send({
      message: "Language update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateManyLanguage = async (req, res) => {
  try {
    await Language.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        multi: true,
      },
    );

    res.send({
      message: "Languages update successfully!",
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

    await Language.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    res.status(200).send({
      message: `Language ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteLanguage = async (req, res) => {
  try {
    await Language.deleteOne({ _id: req.params.id });
    res.send({
      message: "Delete language successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyLanguage = async (req, res) => {
  try {
    await Language.deleteMany({ _id: req.body.ids });
    res.send({
      message: `Language Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addLanguage,
  addAllLanguage,
  getAllLanguages,
  getShowingLanguage,
  getLanguageById,
  updateLanguage,
  updateStatus,
  deleteLanguage,
  updateManyLanguage,
  deleteManyLanguage,
};
