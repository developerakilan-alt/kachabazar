const router = require("express").Router();
const {
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
} = require("../controller/themeController");

// Public routes
router.get("/show", getShowingThemes);
router.get("/default", getDefaultTheme);

// Seed / import demo themes
router.post("/seed", seedDemoThemes);

// CRUD routes
router.post("/add", addTheme);
router.get("/", getAllThemes);
router.get("/:id", getThemeById);
router.put("/:id", updateTheme);
router.delete("/:id", deleteTheme);
router.patch("/delete/many", deleteManyThemes);
router.put("/status/:id", updateThemeStatus);
router.put("/default/:id", setDefaultTheme);

module.exports = router;
