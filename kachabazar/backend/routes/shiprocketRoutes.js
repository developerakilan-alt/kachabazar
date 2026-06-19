const router = require("express").Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  createShiprocketOrder,
  getShippingRates,
  trackShipmentByAWB,
  getOrderShippingStatus,
} = require("../controller/shiprocketController");

router.post("/create-order", isAuth, isAdmin, createShiprocketOrder);
router.get("/rates", getShippingRates);
router.get("/track/:awb", trackShipmentByAWB);
router.get("/order/:id/status", isAuth, getOrderShippingStatus);

module.exports = router;
