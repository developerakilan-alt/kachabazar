const router = require("express").Router();
const {
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
} = require("../controller/storeLayoutController");

router.get("/show", getShowingLayouts);
router.get("/default", getDefaultLayout);
router.post("/seed", seedLayouts);
router.post("/add", addLayout);
router.get("/", getAllLayouts);
router.get("/:id", getLayoutById);
router.put("/:id", updateLayout);
router.delete("/:id", deleteLayout);
router.put("/status/:id", updateLayoutStatus);
router.put("/default/:id", setDefaultLayout);

module.exports = router;
