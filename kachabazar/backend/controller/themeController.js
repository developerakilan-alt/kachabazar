const Theme = require("../models/Theme");

// Generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Get all themes
const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find({}).sort({ createdAt: -1 });
    res.send(themes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get active/showing themes only
const getShowingThemes = async (req, res) => {
  try {
    const themes = await Theme.find({ status: "show" }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.send(themes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get a single theme by id
const getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return res.status(404).send({ message: "Theme not found!" });
    }
    res.send(theme);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get the default/active theme
const getDefaultTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne({ isDefault: true });
    if (!theme) {
      // Fallback: return the first showing theme or null
      theme = await Theme.findOne({ status: "show" });
    }
    res.send(theme || {});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Add a new theme
const addTheme = async (req, res) => {
  try {
    const slug = generateSlug(req.body.name);

    // Check for duplicate slug
    const existing = await Theme.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .send({ message: "A theme with this name already exists!" });
    }

    const newTheme = new Theme({
      ...req.body,
      slug,
    });

    await newTheme.save();
    res.status(201).send({
      data: newTheme,
      message: "Theme added successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a theme
const updateTheme = async (req, res) => {
  try {
    const slug = req.body.name ? generateSlug(req.body.name) : undefined;

    // Check for duplicate slug (if name changed)
    if (slug) {
      const existing = await Theme.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(400)
          .send({ message: "A theme with this name already exists!" });
      }
    }

    const updateData = { ...req.body };
    if (slug) updateData.slug = slug;

    const theme = await Theme.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!theme) {
      return res.status(404).send({ message: "Theme not found!" });
    }

    // If setting as default, unset others
    if (theme.isDefault) {
      await Theme.updateMany({ _id: { $ne: theme._id } }, { isDefault: false });
    }

    res.send({
      data: theme,
      message: "Theme updated successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a theme
const deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return res.status(404).send({ message: "Theme not found!" });
    }
    if (theme.isDefault) {
      return res
        .status(400)
        .send({ message: "Cannot delete the default theme!" });
    }
    await Theme.findByIdAndDelete(req.params.id);
    res.send({ message: "Theme deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete many themes
const deleteManyThemes = async (req, res) => {
  try {
    const defaultTheme = await Theme.findOne({
      _id: { $in: req.body.ids },
      isDefault: true,
    });
    if (defaultTheme) {
      return res
        .status(400)
        .send({ message: "Cannot delete the default theme!" });
    }

    await Theme.deleteMany({ _id: { $in: req.body.ids } });
    res.send({ message: "Themes deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update theme status
const updateThemeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const theme = await Theme.findByIdAndUpdate(id, { status }, { new: true });

    if (!theme) {
      return res.status(404).send({ message: "Theme not found!" });
    }

    res.send({
      data: theme,
      message: `Theme ${status === "show" ? "published" : "hidden"} successfully!`,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Set as default theme
const setDefaultTheme = async (req, res) => {
  try {
    const { id } = req.params;

    // Unset all defaults
    await Theme.updateMany({}, { isDefault: false });

    // Set this one as default
    const theme = await Theme.findByIdAndUpdate(
      id,
      { isDefault: true, status: "show" },
      { new: true },
    );

    if (!theme) {
      return res.status(404).send({ message: "Theme not found!" });
    }

    res.send({
      data: theme,
      message: "Theme set as default successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Seed / import demo themes from themes.json
const seedDemoThemes = async (req, res) => {
  try {
    const themeData = require("../utils/themes.json");

    let imported = 0;
    let updated = 0;

    for (const data of themeData) {
      const existing = await Theme.findOne({ slug: data.slug });
      if (existing) {
        // Update existing theme with new data (preserving _id)
        await Theme.findByIdAndUpdate(existing._id, {
          ...data,
          isDefault: existing.isDefault, // preserve user's default choice
        });
        updated++;
      } else {
        await Theme.create(data);
        imported++;
      }
    }

    // Ensure exactly one default theme exists
    const hasDefault = await Theme.findOne({ isDefault: true });
    if (!hasDefault) {
      const first = await Theme.findOne({ status: "show" });
      if (first) {
        first.isDefault = true;
        await first.save();
      }
    }

    res.send({
      message: `Demo themes imported! ${imported} new, ${updated} updated.`,
      imported,
      updated,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getAllThemes,
  getShowingThemes,
  getThemeById,
  getDefaultTheme,
  addTheme,
  updateTheme,
  deleteTheme,
  deleteManyThemes,
  updateThemeStatus,
  setDefaultTheme,
  seedDemoThemes,
};
