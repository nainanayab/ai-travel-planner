import API from "../api";

export const registerUser = async (userData) => {
  const response = await API.post("/users/register", userData);

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await API.post("/users/login", loginData);

  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/users/profile");

  return response.data;
};