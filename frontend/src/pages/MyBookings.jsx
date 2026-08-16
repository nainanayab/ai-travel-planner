import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [showCancelled, setShowCancelled] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] =
    useState(null);

  // =====================================================
  // LOAD PLACE BOOKINGS ONLY
  // =====================================================

  const loadBookings = useCallback(async () => {
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

      // ONLY PLACE BOOKINGS
      const response = await API.get("/bookings/");

      const data = response.data || [];

      // Only place bookings
      const placeBookings = data.filter(
        (booking) =>
          booking.place_id !== null &&
          booking.place_id !== undefined
      );

      console.log(
        "My Place Bookings:",
        placeBookings
      );

      setBookings(placeBookings);
    } catch (err) {
      console.error(
        "My Place Bookings Error:",
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
          "Unable to load your place bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================================
  // LOAD BOOKINGS ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

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
    if (!date) return "N/A";

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
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (
      value === "cancelled" ||
      value === "rejected"
    ) {
      return "badge bg-danger";
    }

    if (
      value === "approved" ||
      value === "confirmed"
    ) {
      return "badge bg-success";
    }

    return "badge bg-warning text-dark";
  };

  // =====================================================
  // CANCEL PLACE BOOKING
  // =====================================================

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this place booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancelling(bookingId);
      setError("");

      // Backend changes booking status to Cancelled
      const response = await API.delete(
        `/bookings/${bookingId}`
      );

      console.log(
        "Cancelled Booking:",
        response.data
      );

      // Booking remains in state for history
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      );
    } catch (err) {
      console.error(
        "Cancel Place Booking Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to cancel place booking."
        );
      }
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
        />

        <h5 className="mt-3">
          Loading your place bookings...
        </h5>
      </div>
    );
  }

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() !==
      "cancelled"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() ===
      "cancelled"
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
            📍 My Place Bookings
          </h1>

          <p className="text-muted mb-0">
            View and manage your tourist place visits.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">

          {cancelledBookings.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                setShowCancelled(
                  (current) => !current
                )
              }
            >
              {showCancelled
                ? "Hide Cancelled History"
                : "Show Cancelled History"}
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/places")}
          >
            + Book a Visit
          </button>

        </div>
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
          CANCELLED HISTORY INFO
      ================================================= */}

      {showCancelled &&
        cancelledBookings.length > 0 && (
          <div className="alert alert-secondary mb-4">
            <strong>
              Cancelled History
            </strong>

            <div className="small mt-1">
              These bookings were cancelled previously.
              They are kept in your booking history.
            </div>
          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!error &&
        visibleBookings.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">

              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                📍
              </div>

              <h3 className="fw-bold">
                {showCancelled
                  ? "No Cancelled Bookings"
                  : "No Place Bookings Yet"}
              </h3>

              <p className="text-muted">
                {showCancelled
                  ? "You do not have any cancelled place bookings."
                  : "You have not booked a visit to any tourist place yet."}
              </p>

              {!showCancelled && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/places")
                  }
                >
                  Explore Places
                </button>
              )}

            </div>
          </div>
        )}

      {/* =================================================
          PLACE BOOKINGS
      ================================================= */}

      <div className="row g-4">

        {visibleBookings.map((booking) => {
          const status =
            booking.status?.toLowerCase() ||
            "pending";

          const isCancelled =
            status === "cancelled";

          const isRejected =
            status === "rejected";

          const persons =
            Number(booking.persons || 1);

          const ticketPrice = Number(
            booking.place_ticket_price ??
              booking.ticket_price ??
              booking.price_per_person ??
              0
          );

          const total = Number(
            booking.place_total_price ??
              booking.total_price ??
              ticketPrice * persons
          );

          return (
            <div
              className="col-md-6 col-lg-4"
              key={booking.id}
            >
              <div
                className={`card border-0 shadow-sm h-100 ${
                  isCancelled
                    ? "opacity-75"
                    : ""
                }`}
              >
                <div className="card-body">

                  {/* HEADER */}

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>
                      <small className="text-muted">
                        📍 Place Booking
                      </small>

                      <h5 className="fw-bold mb-0">
                        Booking #{booking.id}
                      </h5>
                    </div>

                    <span
                      className={getStatusClass(
                        booking.status
                      )}
                    >
                      {booking.status ||
                        "Pending"}
                    </span>

                  </div>

                  <hr />

                  {/* PLACE NAME */}

                  <h4 className="fw-bold text-primary">
                    📍{" "}
                    {booking.place_name ||
                      booking.place?.name ||
                      "Tourist Place"}
                  </h4>

                  {booking.place_location && (
                    <p className="text-muted mb-3">
                      📌 {booking.place_location}
                    </p>
                  )}

                  {/* VISIT DETAILS */}

                  <div className="bg-light rounded p-3 my-3">

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        Visit Date
                      </span>

                      <strong>
                        {formatDate(
                          booking.visit_date
                        )}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">
                        Visitors
                      </span>

                      <strong>
                        👥 {persons}
                      </strong>
                    </div>

                  </div>

                  {/* TICKET PRICE */}

                  <div className="d-flex justify-content-between mb-2">

                    <span className="text-muted">
                      🎟️ Ticket / Person
                    </span>

                    <strong>
                      Rs.{" "}
                      {formatPrice(
                        ticketPrice
                      )}
                    </strong>

                  </div>

                  {/* TOTAL */}

                  <div className="d-flex justify-content-between border-top pt-3">

                    <strong>
                      Total Ticket
                    </strong>

                    <strong className="text-success">
                      Rs.{" "}
                      {formatPrice(total)}
                    </strong>

                  </div>

                  {/* BOOKING DATE */}

                  <small className="text-muted d-block mt-3">
                    Booked on:{" "}
                    {formatCreatedDate(
                      booking.created_at
                    )}
                  </small>

                  {/* CANCEL */}

                  {!isCancelled &&
                    !isRejected && (
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100 mt-3"
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