import requests from "./httpService";

const CouponServices = {
  addCoupon: async (body) => {
    return requests.post("/coupon/add", body);
  },
  addAllCoupon: async (body) => {
    return requests.post("/coupon/add/all", body);
  },
  getAllCoupons: async ({
    page,
    limit,
    search,
    status,
    couponStatus,
    sortBy,
    sortOrder,
  } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (couponStatus) params.append("couponStatus", couponStatus);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const qs = params.toString();
    return requests.get(`/coupon${qs ? `?${qs}` : ""}`);
  },
  getCouponById: async (id) => {
    return requests.get(`/coupon/${id}`);
  },
  updateCoupon: async (id, body) => {
    return requests.put(`/coupon/${id}`, body);
  },
  updateManyCoupons: async (body) => {
    return requests.patch("/coupon/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/coupon/status/${id}`, body);
  },
  deleteCoupon: async (id) => {
    return requests.delete(`/coupon/${id}`);
  },
  deleteManyCoupons: async (body) => {
    return requests.patch(`/coupon/delete/many`, body);
  },
};

export default CouponServices;
