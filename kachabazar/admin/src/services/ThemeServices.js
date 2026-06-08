import requests from "./httpService";

const ThemeServices = {
  getAllThemes: async () => {
    return requests.get("/theme");
  },

  getShowingThemes: async () => {
    return requests.get("/theme/show");
  },

  getDefaultTheme: async () => {
    return requests.get("/theme/default");
  },

  getThemeById: async (id) => {
    return requests.get(`/theme/${id}`);
  },

  addTheme: async (body) => {
    return requests.post("/theme/add", body);
  },

  updateTheme: async (id, body) => {
    return requests.put(`/theme/${id}`, body);
  },

  deleteTheme: async (id) => {
    return requests.delete(`/theme/${id}`);
  },

  deleteManyThemes: async (body) => {
    return requests.patch("/theme/delete/many", body);
  },

  updateThemeStatus: async (id, body) => {
    return requests.put(`/theme/status/${id}`, body);
  },

  setDefaultTheme: async (id) => {
    return requests.put(`/theme/default/${id}`);
  },

  seedDemoThemes: async () => {
    return requests.post("/theme/seed");
  },
};

export default ThemeServices;
