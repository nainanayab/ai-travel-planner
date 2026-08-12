import API from "../api";

export const getHotels = async () => {
  const response = await API.get("/hotels/");
  return response.data;
};

export const getHotel = async (id) => {
  const response = await API.get(`/hotels/${id}`);
  return response.data;
};