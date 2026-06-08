import requests from "./httpService";

const DeliveryBoyServices = {
  // Delivery boy login
  loginDeliveryBoy: async (body) => {
    return requests.post("/delivery-boy/login", body);
  },

  // Add a delivery boy
  addDeliveryBoy: async (body) => {
    return requests.post("/delivery-boy/add", body);
  },

  // Get all delivery boys with pagination
  getAllDeliveryBoys: async ({
    page,
    limit,
    search,
    status,
    availability,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (availability) params.append("availability", availability);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/delivery-boy${qs ? `?${qs}` : ""}`);
  },

  // Get delivery boy by ID
  getDeliveryBoyById: async (id) => {
    return requests.get(`/delivery-boy/${id}`);
  },

  // Update delivery boy
  updateDeliveryBoy: async (id, body) => {
    return requests.put(`/delivery-boy/${id}`, body);
  },

  // Update delivery boy status
  updateDeliveryBoyStatus: async (id, body) => {
    return requests.put(`/delivery-boy/update-status/${id}`, body);
  },

  // Delete delivery boy
  deleteDeliveryBoy: async (id) => {
    return requests.delete(`/delivery-boy/${id}`);
  },

  // Delete many delivery boys
  deleteManyDeliveryBoys: async (body) => {
    return requests.patch("/delivery-boy/delete/many", body);
  },

  // Get orders for a delivery boy
  getDeliveryBoyOrders: async (id, { page, limit, status } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status", status);
    const qs = params.toString();
    return requests.get(`/delivery-boy/${id}/orders${qs ? `?${qs}` : ""}`);
  },

  // Assign delivery boy to order
  assignDeliveryBoy: async (body) => {
    return requests.post("/delivery-boy/assign", body);
  },

  // Unassign delivery boy from order
  unassignDeliveryBoy: async (body) => {
    return requests.post("/delivery-boy/unassign", body);
  },

  // Get dashboard stats
  getDeliveryBoyDashboard: async () => {
    return requests.get("/delivery-boy/dashboard");
  },

  // Get order tracking history (admin)
  getOrderTrackingHistory: async (orderId) => {
    return requests.get(`/delivery-boy/tracking-history/${orderId}`);
  },

  // ==================== SELF-SERVICE (delivery boy logged in) ====================

  // Get my stats
  getMyStats: async () => {
    return requests.get("/delivery/my-stats");
  },

  // Get my orders
  getMyOrders: async ({ page, limit, status } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status", status);
    const qs = params.toString();
    return requests.get(`/delivery/my-orders${qs ? `?${qs}` : ""}`);
  },

  // Get current active order
  getCurrentOrder: async () => {
    return requests.get("/delivery/current-order");
  },

  // Update tracking status
  updateTrackingStatus: async (orderId, body) => {
    return requests.put(`/delivery/update-tracking/${orderId}`, body);
  },

  // Update availability
  updateAvailability: async (body) => {
    return requests.put("/delivery/update-availability", body);
  },

  // Get my profile
  getMyProfile: async () => {
    return requests.get("/delivery/my-profile");
  },

  // Update my profile (limited fields: name, phone, image, password)
  updateMyProfile: async (body) => {
    return requests.put("/delivery/update-profile", body);
  },

  // Get tracking history (self-service)
  getMyOrderTrackingHistory: async (orderId) => {
    return requests.get(`/delivery/tracking-history/${orderId}`);
  },
};

export default DeliveryBoyServices;
