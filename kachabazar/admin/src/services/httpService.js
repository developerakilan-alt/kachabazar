import axios from "axios";
import Cookies from "js-cookie";
import { getAdminInfoFromCookie } from "@/utils/adminCookie";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token
instance.interceptors.request.use(
  async (config) => {
    let adminInfo = getAdminInfoFromCookie();
    let company = Cookies.get("company") || null;

    if (adminInfo?.token) {
      config.headers.authorization = `Bearer ${adminInfo.token}`;
    }
    if (company) {
      config.headers.company = company;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 (token expired) globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials and redirect to login
      Cookies.remove("adminInfo");
      // Only redirect if we're in the browser and not already on login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;
