import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to attach the token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("abilitymap-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
