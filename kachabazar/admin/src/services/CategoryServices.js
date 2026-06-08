import requests from "./httpService";

const CategoryServices = {
  getAllCategory: async ({
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
    parentOnly,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (parentOnly !== undefined) params.append("parentOnly", parentOnly);
    const qs = params.toString();
    return requests.get(`/category${qs ? `?${qs}` : ""}`);
  },

  getAllCategories: async () => {
    return requests.get("/category/all");
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}`);
  },

  addCategory: async (body) => {
    return requests.post("/category/add", body);
  },

  addAllCategory: async (body) => {
    return requests.post("/category/add/all", body);
  },

  updateCategory: async (id, body) => {
    return requests.put(`/category/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/category/status/${id}`, body);
  },

  deleteCategory: async (id, body) => {
    return requests.delete(`/category/${id}`, body);
  },

  updateManyCategory: async (body) => {
    return requests.patch("/category/update/many", body);
  },

  deleteManyCategory: async (body) => {
    return requests.patch("/category/delete/many", body);
  },
};

export default CategoryServices;
