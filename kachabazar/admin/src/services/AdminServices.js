import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },
  getAllStaff: async ({
    email,
    page,
    limit,
    search,
    role,
    status,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (status) params.append("status", status);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/admin${qs ? `?${qs}` : ""}`);
  },
  getStaffById: async (id, body) => {
    return requests.get(`/admin/${id}`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  assignRole: async (id, body) => {
    return requests.put(`/admin/assign-role/${id}`, body);
  },

  unassignRole: async (id) => {
    return requests.put(`/admin/unassign-role/${id}`);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },
};

export default AdminServices;
