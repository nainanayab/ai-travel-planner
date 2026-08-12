
import { useEffect, useState } from "react";
import API from "../api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // API interceptor automatically sends:
      // Authorization: Bearer <token>

      const [
        bookingsResponse,
        hotelsResponse,
        placesResponse,
      ] = await Promise.all([
        API.get("/bookings/"),
        API.get("/hotels/"),
        API.get("/places/"),
      ]);

      setBookings(bookingsResponse.data || []);
      setHotels(hotelsResponse.data || []);
      setPlaces(placesResponse.data || []);
    } catch (err) {
      console.error(
        "My Bookings Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load your bookings."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FIND HOTEL
  // ==========================================

  const getHotel = (hotelId) => {
    return hotels.find(
      (hotel) =>
        Number(hotel.id) === Number(hotelId)
    );
  };

  // ==========================================
  // HOTEL NAME
  // ==========================================

  const getHotelName = (booking) => {
    if (booking.hotel_name) {
      return booking.hotel_name;
    }

    const hotel = getHotel(booking.hotel_id);

    return hotel?.name || "Hotel not found";
  };

  // ==========================================
  // PLACE NAME
  // ==========================================

  const getPlaceName = (booking) => {
    if (booking.place_name) {
      return booking.place_name;
    }

    const place = places.find(
      (item) =>
        Number(item.id) ===
        Number(booking.place_id)
    );

    return place?.name || "Place not found";
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      Number.isNaN(Number(price))
    ) {
      return "0";
    }

    return new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

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

  // ==========================================
  // FORMAT CREATED DATE
  // ==========================================

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

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(bookingId);
      setError("");

      // API interceptor sends authentication token
      const response = await API.delete(
        `/bookings/${bookingId}`
      );

      // Update cancelled booking
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      );
    } catch (err) {
      console.error(
        "Cancel Booking Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to cancel booking."
        );
      }
    } finally {
      setCancelling(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

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
          Loading your bookings...
        </h5>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="container py-5">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          📅 My Bookings
        </h1>

        <p className="text-muted">
          View and manage all your travel bookings.
        </p>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* ======================================
          NO BOOKINGS
      ====================================== */}

      {!error && bookings.length === 0 && (
        <div className="alert alert-info text-center">

          <h5>
            You have no bookings yet.
          </h5>

          <p className="mb-0">
            Start planning your next trip!
          </p>

        </div>
      )}

      {/* ======================================
          BOOKINGS
      ====================================== */}

      <div className="row g-4">

        {bookings.map((booking) => {

          const isHotel = Boolean(
            booking.hotel_id
          );

          const hotel = isHotel
            ? getHotel(booking.hotel_id)
            : null;

          const status =
            booking.status?.toLowerCase() ||
            "pending";

          const isCancelled =
            status === "cancelled";

          const isApproved =
            status === "approved";

          const isRejected =
            status === "rejected";

          return (
            <div
              className="col-md-6 col-lg-4"
              key={booking.id}
            >

              <div
                className={`card shadow-sm h-100 border-0 ${
                  isCancelled
                    ? "opacity-75"
                    : ""
                }`}
              >

                {/* ==================================
                    HOTEL IMAGE
                ================================== */}

                {isHotel &&
                  hotel?.image_url && (
                    <img
                      src={
                        hotel.image_url.startsWith(
                          "http"
                        )
                          ? hotel.image_url
                          : `/images/${hotel.image_url}`
                      }
                      className="card-img-top"
                      alt={getHotelName(booking)}
                      style={{
                        height: "190px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  )}

                <div className="card-body">

                  {/* ==================================
                      BOOKING HEADER
                  ================================== */}

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="fw-bold mb-0">
                      Booking #{booking.id}
                    </h5>

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

                  {/* ==================================
                      HOTEL BOOKING
                  ================================== */}

                  {isHotel ? (
                    <>

                      <div className="mb-3">

                        <small className="text-muted">
                          Hotel Booking
                        </small>

                        <h5 className="fw-bold text-primary mb-1">
                          🏨{" "}
                          {getHotelName(
                            booking
                          )}
                        </h5>

                        {hotel?.location && (
                          <small className="text-muted">
                            📍 {hotel.location}
                          </small>
                        )}

                      </div>

                      <hr />

                      {/* DATES */}

                      <div className="row mb-3">

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

                      {/* GUEST INFORMATION */}

                      <div className="row mb-3">

                        <div className="col-4">

                          <small className="text-muted">
                            Guests
                          </small>

                          <div className="fw-bold">
                            👥{" "}
                            {booking.persons ||
                              0}
                          </div>

                        </div>

                        <div className="col-4">

                          <small className="text-muted">
                            Rooms
                          </small>

                          <div className="fw-bold">
                            🛏️{" "}
                            {booking.rooms ||
                              0}
                          </div>

                        </div>

                        <div className="col-4">

                          <small className="text-muted">
                            Nights
                          </small>

                          <div className="fw-bold">
                            🌙{" "}
                            {booking.nights ||
                              0}
                          </div>

                        </div>

                      </div>

                      {/* HOTEL PRICE */}

                      <div className="bg-light rounded p-3 mb-3">

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
                            {booking.nights ||
                              0}
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between mb-2">

                          <span>
                            Rooms
                          </span>

                          <strong>
                            {booking.rooms ||
                              0}
                          </strong>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center">

                          <span className="fw-bold">
                            Total
                          </span>

                          <strong className="text-success fs-5">
                            PKR{" "}
                            {formatPrice(
                              booking.total_price
                            )}
                          </strong>

                        </div>

                      </div>

                    </>
                  ) : (

                    /* ==================================
                       PLACE BOOKING
                    ================================== */

                    <>

                      <div className="mb-3">

                        <small className="text-muted">
                          Tourist Place
                        </small>

                        <h5 className="fw-bold text-primary">
                          📍{" "}
                          {getPlaceName(
                            booking
                          )}
                        </h5>

                      </div>

                      <hr />

                      <div className="mb-2">

                        <strong>
                          Visit Date:
                        </strong>{" "}

                        {formatDate(
                          booking.visit_date
                        )}

                      </div>

                      <div className="mb-3">

                        <strong>
                          Persons:
                        </strong>{" "}

                        {booking.persons ||
                          0}

                      </div>

                    </>
                  )}

                  {/* ==================================
                      CREATED DATE
                  ================================== */}

                  {booking.created_at && (
                    <small className="text-muted d-block mb-3">

                      Booked on:{" "}

                      {formatCreatedDate(
                        booking.created_at
                      )}

                    </small>
                  )}

                  {/* ==================================
                      CANCEL BUTTON
                  ================================== */}

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
                          : "Cancel Booking"}

                      </button>
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

export default MyBookings;
