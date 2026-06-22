import requests from "./httpService";

const LayoutServices = {
  getAllLayouts: async () => {
    return requests.get("/store-layout");
  },

  getShowingLayouts: async () => {
    return requests.get("/store-layout/show");
  },

  getDefaultLayout: async () => {
    return requests.get("/store-layout/default");
  },

  getLayoutById: async (id) => {
    return requests.get(`/store-layout/${id}`);
  },

  addLayout: async (body) => {
    return requests.post("/store-layout/add", body);
  },

  updateLayout: async (id, body) => {
    return requests.put(`/store-layout/${id}`, body);
  },

  deleteLayout: async (id) => {
    return requests.delete(`/store-layout/${id}`);
  },

  updateLayoutStatus: async (id, body) => {
    return requests.put(`/store-layout/status/${id}`, body);
  },

  setDefaultLayout: async (id) => {
    return requests.put(`/store-layout/default/${id}`);
  },

  seedLayouts: async () => {
    return requests.post("/store-layout/seed");
  },
};

export default LayoutServices;
