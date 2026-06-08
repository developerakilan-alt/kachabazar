import requests from "./httpService";

const CurrencyServices = {
  getAllCurrency: async ({
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
    return requests.get(`/currency${qs ? `?${qs}` : ""}`);
  },

  getShowingCurrency: async () => {
    return requests.get("/currency/show");
  },

  getCurrencyById: async (id) => {
    return requests.get(`/currency/${id}`);
  },

  addCurrency: async (body) => {
    return requests.post("/currency/add", body);
  },

  addAllCurrency: async (body) => {
    return requests.post("/currency/add/all", body);
  },

  updateCurrency: async (id, body) => {
    return requests.put(`/currency/${id}`, body);
  },

  updateManyCurrencies: async (body) => {
    return requests.patch("currency/update/many", body);
  },

  updateEnabledStatus: async (id, body) => {
    return requests.put(`/currency/status/enabled/${id}`, body);
  },

  updateLiveExchangeRateStatus: async (id, body) => {
    return requests.put(`/currency/status/live-exchange-rates/${id}`, body);
  },

  deleteCurrency: async (id, body) => {
    return requests.delete(`/currency/${id}`, body);
  },

  deleteManyCurrency: async (body) => {
    return requests.patch("/currency/delete/many", body);
  },
};

export default CurrencyServices;
