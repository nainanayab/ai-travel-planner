import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
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