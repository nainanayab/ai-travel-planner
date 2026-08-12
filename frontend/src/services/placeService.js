import API from "../api";

export const getPlaces = async () => {
  const response = await API.get("/places/");

  return response.data;
};

export const getPlace = async (id) => {
  const response = await API.get(`/places/${id}`);

  return response.data;
};

export const searchPlaces = async (search) => {
  const response = await API.get("/places/search", {
    params: {
      q: search,
    },
  });

  return response.data;
};