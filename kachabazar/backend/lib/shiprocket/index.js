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

/**
 * Get full order details from ShipRocket by their order ID.
 * Useful for orders that haven't been assigned a courier/AWB yet.
 */
const getShiprocketOrder = async (orderId) => {
  return api("GET", `/orders/show/${orderId}`);
};

const tryExtractTrackingData = (data) => {
  try {
    if (!data) return null;
    const td = data.tracking_data || data.data || data;
    if (!td || typeof td !== "object") {
      console.error("ShipRocket: unexpected response type:", typeof td, td);
      return null;
    }
    const result = {
      status: td.shipment_status || td.status || td.order_status || td.status_code || null,
      currentStatus: td.current_status || td.currentStatus || null,
      courierName: td.courier_name || td.courierName || null,
      awb: td.awb || td.awb_code || null,
      shipmentId: td.shipment_id || td.shipmentId || null,
    };
    if (!result.status) {
      console.error("ShipRocket: unrecognized response — top keys:", Object.keys(data), "inner keys:", Object.keys(td));
    }
    return result;
  } catch (err) {
    console.error("ShipRocket: tryExtractTrackingData error:", err.message);
    return null;
  }
};

const refreshOrderStatus = async (order) => {
  try {
    const { awb, orderId, shipmentId, status: currentStatus } = order.shiprocket || {};

    // Helper: try to extract and return, or null if no status found
    const attempt = (label, result) => {
      if (!result) return null;
      try {
        const extracted = tryExtractTrackingData(result);
        if (extracted?.status) {
          return {
            status: extracted.status,
            currentStatus: extracted.currentStatus,
            courierName: extracted.courierName,
            awb: extracted.awb || awb,
            shipmentId: extracted.shipmentId || shipmentId,
            updated: extracted.status !== currentStatus,
          };
        }
        if (!extracted?.status && label !== "awb") {
          console.error(`ShipRocket: ${label} returned no recognizable status, keys:`, Object.keys(result));
        }
      } catch (innerErr) {
        console.error(`ShipRocket: attempt ${label} crashed:`, innerErr.message);
      }
      return null;
    };

    // 1) AWB-based tracking (most reliable)
    if (awb) {
      try {
        const tracking = await trackShipment(awb);
        const hit = attempt("awb", tracking);
        if (hit) return hit;
      } catch (err) {
        console.error(`ShipRocket: AWB track failed for ${awb}:`, err.message);
      }
    }

    if (orderId) {
      const errors = [];

      // 2) Track by orderId
      try {
        const tracking = await trackShipmentByOrder(orderId);
        const hit = attempt("trackByOrder", tracking);
        if (hit) return hit;
      } catch (err) {
        errors.push(`trackByOrder: ${err.message}`);
      }

      // 3) /orders/show/{orderId}
      try {
        const data = await api("GET", `/orders/show/${orderId}`);
        const hit = attempt("orders/show", data);
        if (hit) return hit;
      } catch (err) {
        errors.push(`orders/show: ${err.message}`);
      }

      // 4) /orders/{orderId}
      try {
        const data = await api("GET", `/orders/${orderId}`);
        const hit = attempt("orders/", data);
        if (hit) return hit;
      } catch (err) {
        errors.push(`orders/: ${err.message}`);
      }

      // 5) /courier/track?order_id={orderId}
      try {
        const data = await api("GET", `/courier/track?order_id=${orderId}`);
        const hit = attempt("track?order_id", data);
        if (hit) return hit;
      } catch (err) {
        errors.push(`track?order_id: ${err.message}`);
      }

      console.error(`ShipRocket: all order lookups failed for orderId=${orderId}`, errors.join(" | "));
    }

    return { status: currentStatus || "created", updated: false, currentStatus: null, courierName: null, awb, shipmentId };
  } catch (err) {
    console.error("ShipRocket: refreshOrderStatus unexpected error:", err.message, err.stack);
    const { awb, orderId, shipmentId, status } = order?.shiprocket || {};
    return { status: status || "created", updated: false, currentStatus: null, courierName: null, awb, shipmentId };
  }
};

const SHIPROCKET_STATUS_MAP = {
  DELIVERED: "delivered",
  CANCELLED: "cancel",
  RTO: "cancel",
  RETURNED: "cancel",
  ON_HOLD: "processing",
  PICKUP_SCHEDULED: "processing",
  PICKED_UP: "out-for-delivery",
  IN_TRANSIT: "out-for-delivery",
  OUT_FOR_DELIVERY: "out-for-delivery",
  REACHED_DESTINATION: "out-for-delivery",
  SHIPPED: "processing",
  MANIFEST_GENERATED: "processing",
  NEW: "processing",
  READY_TO_SHIP: "processing",
  REQUESTED: "processing",
  UNDELIVERED: "processing",
  AWAITING_PICKUP: "processing",
  RTO_ORIGIN: "cancel",
  IN_TRANSIT_RTO: "cancel",
  RTO_DELIVERED: "cancel",
  ON_HOLD_CAUSED_BY_CUSTOMER: "processing",
  LOST: "cancel",
  DAMAGED: "cancel",
};

const mapShiprocketToOrderStatus = (srStatus) => {
  return SHIPROCKET_STATUS_MAP[srStatus] || "processing";
};

const mapShiprocketToTrackingStatus = (srStatus) => {
  const trackingMap = {
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RTO: "returned",
    RETURNED: "returned",
    ON_HOLD: "confirmed",
    PICKUP_SCHEDULED: "confirmed",
    PICKED_UP: "picked-up",
    IN_TRANSIT: "on-the-way",
    OUT_FOR_DELIVERY: "on-the-way",
    REACHED_DESTINATION: "nearby",
    SHIPPED: "confirmed",
    MANIFEST_GENERATED: "confirmed",
    NEW: "confirmed",
    READY_TO_SHIP: "confirmed",
    REQUESTED: "confirmed",
    UNDELIVERED: "on-the-way",
    AWAITING_PICKUP: "ready-for-pickup",
    RTO_ORIGIN: "returned",
    IN_TRANSIT_RTO: "returned",
    RTO_DELIVERED: "returned",
    ON_HOLD_CAUSED_BY_CUSTOMER: "confirmed",
    LOST: "cancelled",
    DAMAGED: "cancelled",
  };
  return trackingMap[srStatus] || "confirmed";
};

module.exports = {
  getAuthToken,
  createOrder,
  checkServiceability,
  trackShipment,
  trackShipmentByOrder,
  getShiprocketOrder,
  generateLabel,
  generateManifest,
  refreshOrderStatus,
  mapShiprocketToOrderStatus,
  mapShiprocketToTrackingStatus,
  SHIPROCKET_STATUS_MAP,
};
