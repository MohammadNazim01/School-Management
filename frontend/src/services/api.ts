import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error("You don't have permission to do that.");
    } else if (status === 422) {
      toast.error("Validation error. Please check your inputs.");
    } else if (status === 409) {
      toast.error(detail ?? "Conflict: resource already exists.");
    } else if (status === 404) {
      // handled by caller
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
