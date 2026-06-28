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
  if (!email || !password) throw new Error("ShipRocket API user credentials not configured");

  const { data } = await axios.post(`${BASE}/auth/login`, { email, password });

  cachedToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken;
};

const api = async (method, path, body = null) => {
  const token = await getAuthToken();
  try {
    const { data } = await axios({
      method,
      url: `${BASE}${path}`,
      data: body,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    const detail =
      err.response?.data?.message ||
      err.response?.data?.error ||
      JSON.stringify(err.response?.data || {});
    throw new Error(`ShipRocket API error (${err.response?.status}): ${detail}`);
  }
};

const createOrder = async (order) => {
  const globalSetting = await Setting.findOne({ name: "globalSetting" });
  const storeContact = globalSetting?.setting?.contact || "";
  const nameParts = (order.user_info?.name || "Customer").split(/\s+/);
  const billingFirstName = nameParts[0] || "Customer";
  const billingLastName = nameParts.slice(1).join(" ") || "N/A";
  const pincode = (order.user_info?.zipCode || "").replace(/\s/g, "");
  const phone = (order.user_info?.contact || storeContact || "").replace(/\D/g, "").slice(-10);

  const itemId = (item) => {
    if (item.sku) return item.sku;
    if (item._id && typeof item._id === "object" && item._id.toString) return item._id.toString().slice(-8);
    if (typeof item._id === "string") return item._id.slice(-8);
    if (item.id) return item.id.toString().slice(-8);
    return "SKU";
  };

  const payload = {
    order_id: order.trackingId || order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().split("T")[0],
    pickup_location: "primary",
    billing_customer_name: billingFirstName,
    billing_last_name: billingLastName,
    billing_address: order.user_info?.address || "Address",
    billing_city: order.user_info?.city || "City",
    billing_pincode: pincode || "600001",
    billing_state: order.user_info?.state || "Tamil Nadu",
    billing_country: "India",
    billing_email: order.user_info?.email || "customer@example.com",
    billing_phone: phone || "9999999999",
    shipping_is_billing: true,
    order_items: (order.cart || []).map((item) => ({
      name: item.title || item.name || "Item",
      sku: itemId(item),
      units: item.quantity || 1,
      selling_price: Math.round(item.price || 0),
      discount: Math.round(item.discount || 0),
      tax: Math.round(item.tax || 0),
    })),
    payment_method:
      order.paymentStatus === "captured" ? "Prepaid" : "COD",
    sub_total: Math.round(order.subTotal || 0),
    length: 10,
    breadth: 10,
    height: 10,
    weight: Math.max(order.totalWeight || 0.5, 0.1),
  };

  console.error("ShipRocket payload sent:", JSON.stringify(payload, null, 2));

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

const trackShipmentByOrder = async (orderId) => {
  return api("GET", `/courier/track/orders/${orderId}`);
};

const refreshOrderStatus = async (order) => {
  let tracking = null;
  if (order.shiprocket?.awb) {
    tracking = await trackShipment(order.shiprocket.awb);
  } else if (order.shiprocket?.orderId) {
    try {
      tracking = await trackShipmentByOrder(order.shiprocket.orderId);
    } catch {
      return { status: order.shiprocket?.status || "created", updated: false, currentStatus: null, courierName: null };
    }
  } else {
    return { status: order.shiprocket?.status || "created", updated: false, currentStatus: null, courierName: null };
  }
  const srStatus = tracking?.tracking_data?.shipment_status || order.shiprocket.status;
  return {
    status: srStatus,
    currentStatus: tracking?.tracking_data?.current_status || null,
    courierName: tracking?.tracking_data?.courier_name || null,
    updated: srStatus !== order.shiprocket.status,
  };
};

const SHIPROCKET_STATUS_MAP = {
  DELIVERED: "delivered",
  CANCELLED: "cancel",
  RTO: "cancel",
  RETURNED: "cancel",
  ON_HOLD: "processing",
  PICKED_UP: "out-for-delivery",
  IN_TRANSIT: "out-for-delivery",
  OUT_FOR_DELIVERY: "out-for-delivery",
  REACHED_DESTINATION: "out-for-delivery",
  SHIPPED: "processing",
  MANIFEST_GENERATED: "processing",
  NEW: "processing",
  UNDELIVERED: "processing",
};

const mapShiprocketToOrderStatus = (srStatus) => {
  return SHIPROCKET_STATUS_MAP[srStatus] || "processing";
};

module.exports = {
  getAuthToken,
  createOrder,
  checkServiceability,
  trackShipment,
  generateLabel,
  generateManifest,
  refreshOrderStatus,
  mapShiprocketToOrderStatus,
};
