
import API from "../api";

// Create a transport booking
export const createTransportBooking = async (
  transportId,
  passengers = 1
) => {
  const response = await API.post("/transport-bookings/", {
    transport_id: transportId,
    passengers: passengers,
  });

  return response.data;
};

// Get all transport bookings
export const getTransportBookings = async () => {
  const response = await API.get("/transport-bookings/");

  return response.data;
};

// Get one transport booking
export const getTransportBooking = async (bookingId) => {
  const response = await API.get(
    `/transport-bookings/${bookingId}`
  );

  return response.data;
};