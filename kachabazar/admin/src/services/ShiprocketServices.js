import requests from "./httpService";

const ShiprocketServices = {
  createOrder: async (orderId) => {
    return requests.post("/shiprocket/create-order", { orderId });
  },

  trackShipment: async (awb) => {
    return requests.get(`/shiprocket/track/${awb}`);
  },

  getOrderStatus: async (id) => {
    return requests.get(`/shiprocket/order/${id}/status`);
  },

  refreshStatus: async (orderId) => {
    return requests.post(`/shiprocket/order/${orderId}/refresh`);
  },
};

export default ShiprocketServices;
