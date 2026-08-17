import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";
import { BACKEND_URL } from "../config";

function MyHotelBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  // Show cancelled history only when user asks
  const [showCancelled, setShowCancelled] = useState(false);

  // =====================================================
  // LOAD HOTEL BOOKINGS
  // =====================================================

  useEffect(() => {
    const loadHotelBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const [bookingsResponse, hotelsResponse] =
          await Promise.all([
            API.get("/bookings/"),
            API.get("/hotels/"),
          ]);

        const allBookings = bookingsResponse.data || [];
        const hotelData = hotelsResponse.data || [];

        // ONLY HOTEL BOOKINGS
        const hotelBookings = allBookings.filter(
          (booking) =>
            booking.hotel_id !== null &&
            booking.hotel_id !== undefined
        );

        console.log("All Bookings:", allBookings);
        console.log("Hotel Bookings:", hotelBookings);

        setBookings(hotelBookings);
        setHotels(hotelData);
      } catch (err) {
        console.error(
          "Hotel Bookings Error:",
          err.response?.data || err.message
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");

          setError(
            "Your login session has expired. Please login again."
          );

          setTimeout(() => {
            navigate("/login");
          }, 1000);

          return;
        }

        setError(
          err.response?.data?.detail ||
            "Unable to load your hotel bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHotelBookings();
  }, [navigate]);

  // =====================================================
  // FIND HOTEL
  // =====================================================

  const getHotel = (hotelId) => {
    return hotels.find(
      (hotel) =>
        Number(hotel.id) === Number(hotelId)
    );
  };

  // =====================================================
  // HOTEL NAME
  // =====================================================

  const getHotelName = (booking) => {
    if (booking.hotel_name) {
      return booking.hotel_name;
    }

    const hotel = getHotel(booking.hotel_id);

    return hotel?.name || "Hotel";
  };

  // =====================================================
  // HOTEL IMAGE
  // =====================================================

  const getHotelImage = (hotel) => {
    if (!hotel?.image_url) {
      return null;
    }

    // Backend already returned a full URL
    if (
      hotel.image_url.startsWith("http://") ||
      hotel.image_url.startsWith("https://")
    ) {
      return hotel.image_url;
    }

    // Backend returned an absolute path
    if (hotel.image_url.startsWith("/")) {
      return `${BACKEND_URL}${hotel.image_url}`;
    }

    // Backend returned only the filename
    return `${BACKEND_URL}/static/hotels/${hotel.image_url}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT CREATED DATE
  // =====================================================

  const formatCreatedDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-PK",
      {
        maximumFractionDigits: 0,
      }
    );
  };

  // =====================================================
  // CANCEL HOTEL BOOKING
  // =====================================================

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this hotel booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(bookingId);
      setError("");

      const response = await API.delete(
        `/bookings/${bookingId}`
      );

      // Update booking with backend response.
      // It remains in database for admin/history,
      // but will be hidden from active user view.
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      );
    } catch (err) {
      console.error(
        "Cancel Hotel Booking Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Unable to cancel hotel booking."
      );
    } finally {
      setCancelling(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <h5 className="mt-3">
          Loading your hotel bookings...
        </h5>

      </div>
    );
  }

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() !== "cancelled"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "cancelled"
  );

  const visibleBookings = showCancelled
    ? bookings
    : activeBookings;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container py-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

        <div>
          <h1 className="fw-bold mb-2">
            🏨 My Hotel Bookings
          </h1>

          <p className="text-muted mb-0">
            View and manage your hotel reservations.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/hotels")}
        >
          + Find Hotels
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* =================================================
          CANCELLED HISTORY BUTTON
      ================================================= */}

      {cancelledBookings.length > 0 && (
        <div className="d-flex justify-content-end mb-4">

          <button
            type="button"
            className={
              showCancelled
                ? "btn btn-outline-secondary"
                : "btn btn-outline-danger"
            }
            onClick={() =>
              setShowCancelled(
                (current) => !current
              )
            }
          >
            {showCancelled
              ? "Hide Cancelled History"
              : `Show Cancelled History (${cancelledBookings.length})`}
          </button>

        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!error && visibleBookings.length === 0 && (
        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: "55px",
              }}
            >
              🏨
            </div>

            <h3 className="fw-bold mt-3">
              {showCancelled
                ? "No Hotel Booking History"
                : "No Hotel Bookings Yet"}
            </h3>

            <p className="text-muted">
              {showCancelled
                ? "You do not have any cancelled hotel bookings."
                : "You have not reserved any hotel yet."}
            </p>

            {!showCancelled && (
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() =>
                  navigate("/hotels")
                }
              >
                Explore Hotels
              </button>
            )}

          </div>

        </div>
      )}

      {/* =================================================
          HOTEL BOOKINGS
      ================================================= */}

      <div className="row g-4">

        {visibleBookings.map((booking) => {

          const hotel = getHotel(
            booking.hotel_id
          );

          const status =
            booking.status?.toLowerCase() ||
            "pending";

          const isCancelled =
            status === "cancelled";

          const isRejected =
            status === "rejected";

          const isApproved =
            status === "approved" ||
            status === "confirmed";

          const imageUrl =
            getHotelImage(hotel);

          return (
            <div
              className="col-md-6 col-xl-4"
              key={booking.id}
            >

              <div
                className={`card h-100 border-0 shadow-sm ${
                  isCancelled
                    ? "opacity-75"
                    : ""
                }`}
              >

                {/* =================================================
                    HOTEL IMAGE
                ================================================= */}

                {imageUrl && (
                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={getHotelName(booking)}
                    style={{
                      height: "210px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}

                <div className="card-body p-4">

                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>

                      <small className="text-muted">
                        🏨 Hotel Reservation
                      </small>

                      <h4 className="fw-bold mb-1">
                        {getHotelName(booking)}
                      </h4>

                      {hotel?.location && (
                        <small className="text-muted">
                          📍 {hotel.location}
                        </small>
                      )}

                    </div>

                    <span
                      className={
                        isCancelled ||
                        isRejected
                          ? "badge bg-danger"
                          : isApproved
                          ? "badge bg-success"
                          : "badge bg-warning text-dark"
                      }
                    >
                      {booking.status ||
                        "Pending"}
                    </span>

                  </div>

                  <hr />

                  {/* =================================================
                      BOOKING ID
                  ================================================= */}

                  <div className="mb-3">

                    <small className="text-muted">
                      Booking ID
                    </small>

                    <div className="fw-bold">
                      #{booking.id}
                    </div>

                  </div>

                  {/* =================================================
                      DATES
                  ================================================= */}

                  <div className="row mb-4">

                    <div className="col-6">

                      <small className="text-muted">
                        Check-in
                      </small>

                      <div className="fw-bold">
                        {formatDate(
                          booking.check_in
                        )}
                      </div>

                    </div>

                    <div className="col-6">

                      <small className="text-muted">
                        Check-out
                      </small>

                      <div className="fw-bold">
                        {formatDate(
                          booking.check_out
                        )}
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      GUEST DETAILS
                  ================================================= */}

                  <div className="row mb-4">

                    <div className="col-4">

                      <small className="text-muted">
                        Guests
                      </small>

                      <div className="fw-bold">
                        👥{" "}
                        {booking.persons || 0}
                      </div>

                    </div>

                    <div className="col-4">

                      <small className="text-muted">
                        Rooms
                      </small>

                      <div className="fw-bold">
                        🛏️{" "}
                        {booking.rooms || 0}
                      </div>

                    </div>

                    <div className="col-4">

                      <small className="text-muted">
                        Nights
                      </small>

                      <div className="fw-bold">
                        🌙{" "}
                        {booking.nights || 0}
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      MEAL + WIFI
                  ================================================= */}

                  <div className="bg-light rounded-3 p-3 mb-4">

                    <div className="d-flex justify-content-between mb-2">

                      <span className="text-muted">
                        🍽️ Meal Plan
                      </span>

                      <strong>
                        {booking.meal_plan ||
                          "none"}
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between">

                      <span className="text-muted">
                        📶 WiFi
                      </span>

                      <strong>
                        {booking.wifi_required
                          ? "Required"
                          : "Not Required"}
                      </strong>

                    </div>

                  </div>

                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="bg-light rounded-3 p-3 mb-4">

                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Price / night
                      </span>

                      <strong>
                        PKR{" "}
                        {formatPrice(
                          booking.price_per_night
                        )}
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Nights
                      </span>

                      <strong>
                        {booking.nights || 0}
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Rooms
                      </span>

                      <strong>
                        {booking.rooms || 0}
                      </strong>

                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">

                      <span className="fw-bold">
                        Total Amount
                      </span>

                      <strong className="text-primary fs-5">
                        PKR{" "}
                        {formatPrice(
                          booking.total_price
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* =================================================
                      PAYMENT
                  ================================================= */}

                  {booking.payment_status && (
                    <div className="d-flex justify-content-between mb-3">

                      <span className="text-muted">
                        Payment
                      </span>

                      <span
                        className={
                          booking.payment_status ===
                          "paid"
                            ? "badge bg-success"
                            : booking.payment_status ===
                              "refunded"
                            ? "badge bg-secondary"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {booking.payment_status}
                      </span>

                    </div>
                  )}

                  {/* =================================================
                      BOOKED DATE
                  ================================================= */}

                  {booking.created_at && (
                    <small className="text-muted d-block mb-3">
                      Booked on:{" "}
                      {formatCreatedDate(
                        booking.created_at
                      )}
                    </small>
                  )}

                  {/* =================================================
                      CANCEL
                  ================================================= */}

                  {!isCancelled &&
                    !isRejected && (
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          cancelBooking(
                            booking.id
                          )
                        }
                        disabled={
                          cancelling ===
                          booking.id
                        }
                      >
                        {cancelling ===
                        booking.id
                          ? "Cancelling..."
                          : "Cancel Hotel Booking"}
                      </button>
                    )}

                  {/* =================================================
                      CANCELLED MESSAGE
                  ================================================= */}

                  {isCancelled && (
                    <div className="alert alert-danger mb-0 mt-3 text-center">
                      This hotel booking was cancelled.
                    </div>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default MyHotelBookings;