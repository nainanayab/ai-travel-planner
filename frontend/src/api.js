import axios from "axios";
import { BACKEND_URL } from "./config";

const API = axios.create({
  baseURL: BACKEND_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================================
// BUDGET TRANSPORT
// =========================================================

export const searchAffordableTransport = async (
  fromCity,
  toCity,
  budget
) => {
  const response = await API.get(
    "/budget-transports/search/affordable",
    {
      params: {
        from_city: fromCity,
        to_city: toCity,
        budget: budget,
      },
    }
  );

  return response.data;
};

export default API;