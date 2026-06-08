import requests from "./httpService";

const CustomerServices = {
  getAllCustomers: async ({
    searchText = "",
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search || searchText) params.append("search", search || searchText);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/customer${qs ? `?${qs}` : ""}`);
  },

  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    return requests.post(`/customer/create`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },

  deleteManyCustomers: async (body) => {
    return requests.patch("/customer/delete/many", body);
  },
};

export default CustomerServices;
