const Order = require("../models/Order");
const shiprocket = require("../lib/shiprocket");

const createShiprocketOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).send({ message: "orderId is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send({ message: "Order not found" });

    if (order.shiprocket?.orderId) {
      return res.status(400).send({ message: "Order already pushed to ShipRocket" });
    }

    const result = await shiprocket.createOrder(order);

    order.shiprocket = {
      orderId: result.order_id,
      shipmentId: result.shipment_id,
      awb: result.awb || "",
      status: result.status || "created",
    };
    await order.save();

    res.status(201).send({ success: true, shiprocket: order.shiprocket, raw: result });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getShippingRates = async (req, res) => {
  try {
    const { deliveryPostcode, cod, weight } = req.query;
    if (!deliveryPostcode) {
      return res.status(400).send({ message: "deliveryPostcode is required" });
    }

    const storeSetting = require("../models/Setting");
    const setting = await storeSetting.findOne({ name: "storeSetting" });
    const pickupPostcode = setting?.setting?.shiprocket_pickup_pincode || process.env.SHIPROCKET_PICKUP_PINCODE || "600001";

    const result = await shiprocket.checkServiceability({
      pickupPostcode,
      deliveryPostcode,
      cod: cod === "true" || cod === "1",
      weight: Number(weight) || 0.5,
    });

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const trackShipmentByAWB = async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) return res.status(400).send({ message: "AWB is required" });

    const result = await shiprocket.trackShipment(awb);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getOrderShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).send({ message: "Order not found" });

    let tracking = null;
    if (order.shiprocket?.awb) {
      try {
        tracking = await shiprocket.trackShipment(order.shiprocket.awb);
      } catch {
        // ShipRocket tracking may fail silently
      }
    }

    res.send({
      shiprocket: order.shiprocket || null,
      tracking,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createShiprocketOrder,
  getShippingRates,
  trackShipmentByAWB,
  getOrderShippingStatus,
};
