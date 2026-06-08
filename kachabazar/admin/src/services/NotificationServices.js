import requests from "@/services/httpService";

const NotificationServices = {
  addNotification: async (body) => {
    return requests.post("/notification/add", body);
  },

  getAllNotification: async ({
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
    return requests.get(`/notification${qs ? `?${qs}` : ""}`);
  },

  updateStatusNotification: async (id, body) => {
    return requests.put(`/notification/${id}`, body);
  },

  updateManyStatusNotification: async (body) => {
    return requests.patch("/notification/update/many", body);
  },

  deleteNotification: async (id) => {
    return requests.delete(`/notification/${id}`);
  },

  deleteNotificationByProductId: async (id) => {
    return requests.delete(`/notification/product-id/${id}`);
  },

  deleteManyNotification: async (body) => {
    return requests.patch(`/notification/delete/many`, body);
  },
};

export default NotificationServices;
