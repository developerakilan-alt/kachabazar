const StoreLayout = require("../models/StoreLayout");
const storeLayouts = require("../utils/storeLayouts");

const getAllLayouts = async (req, res) => {
  try {
    const layouts = await StoreLayout.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.send(layouts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getShowingLayouts = async (req, res) => {
  try {
    const layouts = await StoreLayout.find({ status: "show" }).sort({
      sortOrder: 1,
      createdAt: -1,
    });
    res.send(layouts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getLayoutById = async (req, res) => {
  try {
    const layout = await StoreLayout.findById(req.params.id);
    if (!layout) {
      return res.status(404).send({ message: "Store layout not found!" });
    }
    res.send(layout);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getDefaultLayout = async (req, res) => {
  try {
    let layout = await StoreLayout.findOne({ isDefault: true });
    if (!layout) {
      layout = await StoreLayout.findOne({ status: "show" }).sort({ sortOrder: 1 });
    }
    res.send(layout || {});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addLayout = async (req, res) => {
  try {
    const existing = await StoreLayout.findOne({ value: req.body.value });
    if (existing) {
      return res.status(400).send({ message: "A layout with this value already exists!" });
    }

    const newLayout = new StoreLayout(req.body);
    await newLayout.save();
    res.status(201).send({
      data: newLayout,
      message: "Store layout added successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateLayout = async (req, res) => {
  try {
    const layout = await StoreLayout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!layout) {
      return res.status(404).send({ message: "Store layout not found!" });
    }
    res.send({
      data: layout,
      message: "Store layout updated successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteLayout = async (req, res) => {
  try {
    const layout = await StoreLayout.findByIdAndDelete(req.params.id);
    if (!layout) {
      return res.status(404).send({ message: "Store layout not found!" });
    }
    res.send({ message: "Store layout deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateLayoutStatus = async (req, res) => {
  try {
    const layout = await StoreLayout.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!layout) {
      return res.status(404).send({ message: "Store layout not found!" });
    }
    res.send({
      data: layout,
      message: `Layout ${req.body.status === "show" ? "shown" : "hidden"} successfully!`,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const setDefaultLayout = async (req, res) => {
  try {
    await StoreLayout.updateMany({}, { isDefault: false });
    const layout = await StoreLayout.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true },
    );
    if (!layout) {
      return res.status(404).send({ message: "Store layout not found!" });
    }
    res.send({
      data: layout,
      message: "Default layout set successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const seedLayouts = async (req, res) => {
  try {
    const existingCount = await StoreLayout.countDocuments();
    if (existingCount > 0) {
      return res.status(400).send({ message: "Layouts already seeded!" });
    }
    const seeded = await StoreLayout.insertMany(storeLayouts);
    res.status(201).send({
      data: seeded,
      message: `${seeded.length} store layouts seeded successfully!`,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getAllLayouts,
  getShowingLayouts,
  getLayoutById,
  getDefaultLayout,
  addLayout,
  updateLayout,
  deleteLayout,
  updateLayoutStatus,
  setDefaultLayout,
  seedLayouts,
};
