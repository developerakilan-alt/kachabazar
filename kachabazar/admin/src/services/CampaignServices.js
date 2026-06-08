import requests from "./httpService";

const CampaignServices = {
  addCampaign: async (body) => {
    return requests.post("/campaign/add", body);
  },

  getAllCampaigns: async ({
    page,
    limit,
    search,
    status,
    campaignStatus,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (campaignStatus) params.append("campaignStatus", campaignStatus);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/campaign${qs ? `?${qs}` : ""}`);
  },

  getCampaignById: async (id) => {
    return requests.get(`/campaign/${id}`);
  },

  updateCampaign: async (id, body) => {
    return requests.put(`/campaign/${id}`, body);
  },

  updateManyCampaigns: async (body) => {
    return requests.patch("/campaign/update/many", body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/campaign/status/${id}`, body);
  },

  deleteCampaign: async (id) => {
    return requests.delete(`/campaign/${id}`);
  },

  deleteManyCampaigns: async (body) => {
    return requests.patch("/campaign/delete/many", body);
  },
};

export default CampaignServices;
