const axios = require("axios");
const Setting = require("../../models/Setting");

const BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let tokenExpiry = 0;

const getCredentials = async () => {
  const storeSetting = await Setting.findOne({ name: "storeSetting" });
  const db = storeSetting?.setting || {};
  return {
    email:
      process.env.SHIPROCKET_EMAIL ||
      db.shiprocket_email ||
      "",
    password:
      process.env.SHIPROCKET_PASSWORD ||
      db.shiprocket_password ||
      "",
  };
};

const getAuthToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const { email, password } = await getCredentials();
  if (!email || !password) throw new Error("ShipRocket credentials not configured");

  const { data } = await axios.post(`${BASE}/auth/login`, { email, password });

  cachedToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken;
};

const api = async (method, path, body = null) => {
  const token = await getAuthToken();
  const { data } = await axios({
    method,
    url: `${BASE}${path}`,
    data: body,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const createOrder = async (order) => {
  const payload = {
    order_id: order.trackingId || order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().split("T")[0],
    pickup_location: "primary",
    channel_id: "",
    billing_customer_name: order.user_info?.name || "",
    billing_last_name: "",
    billing_address: order.user_info?.address || "",
    billing_city: order.user_info?.city || "",
    billing_pincode: order.user_info?.zipCode || "",
    billing_state: "",
    billing_country: order.user_info?.country || "India",
    billing_email: order.user_info?.email || "",
    billing_phone: order.user_info?.contact || "",
    shipping_is_billing: true,
    order_items: (order.cart || []).map((item) => ({
      name: item.name || "Item",
      sku: item.sku || item._id || "",
      units: item.quantity || 1,
      selling_price: item.price || 0,
      discount: 0,
      tax: 0,
    })),
    payment_method:
      order.paymentStatus === "captured" ? "Prepaid" : "COD",
    sub_total: order.subTotal || 0,
    length: 10,
    breadth: 10,
    height: 10,
    weight: order.totalWeight || 0.5,
  };

  return api("POST", "/orders/create/adhoc", payload);
};

const checkServiceability = async ({
  pickupPostcode,
  deliveryPostcode,
  cod = false,
  weight = 0.5,
}) => {
  const params = new URLSearchParams({
    pickup_postcode: pickupPostcode,
    delivery_postcode: deliveryPostcode,
    cod: cod ? "1" : "0",
    weight: String(weight),
  });
  return api("GET", `/courier/serviceability/?${params.toString()}`);
};

const trackShipment = async (awb) => {
  return api("GET", `/courier/track/shipment/awbs/${awb}`);
};

const generateLabel = async (shipmentId) => {
  return api("POST", "/courier/generate/label", { shipment_id: [shipmentId] });
};

const generateManifest = async (shipmentIds) => {
  return api("POST", "/manifests/generate", { shipment_id: shipmentIds });
};

module.exports = {
  getAuthToken,
  createOrder,
  checkServiceability,
  trackShipment,
  generateLabel,
  generateManifest,
};
