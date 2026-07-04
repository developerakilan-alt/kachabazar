const router = require("express").Router();
const { handleWebhook } = require("../controller/shiprocketController");

router.get("/courier-status", (req, res) => {
  res.json({ status: "active" });
});
router.post("/courier-status", handleWebhook);

module.exports = router;
