const router = require("express").Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  createShiprocketOrder,
  getShippingRates,
  trackShipmentByAWB,
  getOrderShippingStatus,
  refreshShiprocketStatus,
  customerRefreshStatus,
} = require("../controller/shiprocketController");

router.post("/create-order", isAuth, isAdmin, createShiprocketOrder);
router.get("/rates", getShippingRates);
router.get("/track/:awb", trackShipmentByAWB);
router.get("/order/:id/status", isAuth, getOrderShippingStatus);
router.post("/order/:orderId/refresh", isAuth, isAdmin, refreshShiprocketStatus);
router.post("/order/:orderId/customer-refresh", isAuth, customerRefreshStatus);

module.exports = router;
