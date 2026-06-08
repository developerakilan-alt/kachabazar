import requests from "./httpService";

const LanguageServices = {
  getAllLanguages: async ({
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/language/all${qs ? `?${qs}` : ""}`);
  },

  getShowingLanguage: async () => {
    return requests.get("/language/show");
  },

  getLanguageById: async (id) => {
    return requests.get(`/language/${id}`);
  },

  addLanguage: async (body) => {
    return requests.post("/language/add", body);
  },

  addAllLanguage: async (body) => {
    return requests.post("/language/add/all", body);
  },

  updateLanguage: async (id, body) => {
    return requests.put(`/language/${id}`, body);
  },

  updateManyLanguage: async (body) => {
    return requests.patch("language/update/many", body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/language/status/${id}`, body);
  },

  deleteLanguage: async (id, body) => {
    return requests.patch(`/language/${id}`, body);
  },

  deleteManyLanguage: async (body) => {
    return requests.patch("/language/delete/many", body);
  },
};

export default LanguageServices;
