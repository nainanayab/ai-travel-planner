import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function MyTransportBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  // Show cancelled history only when user asks
  const [showCancelled, setShowCancelled] =
    useState(false);

  // =====================================================
  // LOAD MY TRANSPORT BOOKINGS
  // =====================================================

  const loadBookings = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login to view your transport bookings."
      );

      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/transport-bookings/"
      );

      const data = response.data || [];

      console.log(
        "My Transport Bookings:",
        data
      );

      setBookings(data);
    } catch (err) {
      console.error(
        "Transport bookings error:",
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
          "Unable to load your transport bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // =====================================================
  // CANCEL TRANSPORT BOOKING
  // =====================================================

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this transport booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(bookingId);
      setError("");

      const response = await API.delete(
        `/transport-bookings/${bookingId}`
      );

      console.log(
        "Cancelled Transport Booking:",
        response.data
      );

      // Keep cancelled booking in state for history.
      // It will be hidden from active bookings unless
      // the user clicks "Show Cancelled History".
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      );
    } catch (err) {
      console.error(
        "Cancel Transport Booking Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Unable to cancel transport booking."
      );
    } finally {
      setCancelling(null);
    }
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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
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
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value =
      status?.toLowerCase() || "pending";

    if (
      value === "cancelled" ||
      value === "rejected"
    ) {
      return "badge bg-danger";
    }

    if (
      value === "confirmed" ||
      value === "approved"
    ) {
      return "badge bg-success";
    }

    return "badge bg-warning text-dark";
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

        <p className="mt-3">
          Loading your transport bookings...
        </p>

      </div>
    );
  }

  // =====================================================
  // ACTIVE / CANCELLED BOOKINGS
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
            🚌 My Transport Bookings
          </h1>

          <p className="text-muted mb-0">
            View and manage your booked transport
            services.
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/transport")
          }
        >
          + Book More Transport
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

      {!error &&
        visibleBookings.length === 0 && (
          <div className="card shadow-sm border-0">

            <div className="card-body text-center py-5">

              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                🚌
              </div>

              <h3 className="fw-bold">
                {showCancelled
                  ? "No Transport Booking History"
                  : "No Transport Bookings"}
              </h3>

              <p className="text-muted">
                {showCancelled
                  ? "You do not have any cancelled transport bookings."
                  : "You have not booked any transport yet."}
              </p>

              {!showCancelled && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/transport")
                  }
                >
                  Find Transport
                </button>
              )}

            </div>

          </div>
        )}

      {/* =================================================
          BOOKINGS
      ================================================= */}

      {visibleBookings.length > 0 && (
        <div className="row g-4">

          {visibleBookings.map((booking) => {

            const status =
              booking.status?.toLowerCase() ||
              "pending";

            const isCancelled =
              status === "cancelled";

            const isRejected =
              status === "rejected";

            const passengers =
              Number(
                booking.passengers || 1
              );

            const pricePerPerson =
              Number(
                booking.price_per_person || 0
              );

            const totalPrice =
              Number(
                booking.total_price ??
                  pricePerPerson *
                    passengers
              );

            return (
              <div
                className="col-md-6 col-xl-4"
                key={booking.id}
              >

                <div
                  className={`card shadow-sm h-100 border-0 ${
                    isCancelled
                      ? "opacity-75"
                      : ""
                  }`}
                >

                  <div className="card-body p-4">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>

                        <small className="text-muted">
                          🚌 Transport Booking
                        </small>

                        <h5 className="fw-bold mb-1">
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

                    {/* =================================================
                        TRANSPORT ID
                    ================================================= */}

                    <div className="mb-3">

                      <small className="text-muted">
                        Transport ID
                      </small>

                      <div className="fw-semibold">
                        #{booking.transport_id}
                      </div>

                    </div>

                    {/* =================================================
                        ROUTE
                    ================================================= */}

                    {(booking.transport_from ||
                      booking.transport_to) && (
                      <div className="bg-light rounded-3 p-3 mb-3">

                        {booking.transport_from && (
                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              From
                            </span>

                            <strong className="text-end">
                              {booking.transport_from}
                            </strong>

                          </div>
                        )}

                        <div className="text-center text-primary fw-bold my-2">
                          ↓
                        </div>

                        {booking.transport_to && (
                          <div className="d-flex justify-content-between">

                            <span className="text-muted">
                              To
                            </span>

                            <strong className="text-end">
                              {booking.transport_to}
                            </strong>

                          </div>
                        )}

                      </div>
                    )}

                    {/* =================================================
                        TRANSPORT DETAILS
                    ================================================= */}

                    {(booking.transport_company ||
                      booking.transport_type ||
                      booking.transport_vehicle) && (
                      <div className="mb-3">

                        {booking.transport_company && (
                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              Company
                            </span>

                            <strong>
                              {booking.transport_company}
                            </strong>

                          </div>
                        )}

                        {booking.transport_type && (
                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              Type
                            </span>

                            <strong>
                              {booking.transport_type}
                            </strong>

                          </div>
                        )}

                        {booking.transport_vehicle && (
                          <div className="d-flex justify-content-between">

                            <span className="text-muted">
                              Vehicle
                            </span>

                            <strong>
                              {booking.transport_vehicle}
                            </strong>

                          </div>
                        )}

                      </div>
                    )}

                    {/* =================================================
                        PASSENGERS
                    ================================================= */}

                    <div className="row mb-3">

                      <div className="col-6">

                        <small className="text-muted">
                          Passengers
                        </small>

                        <div className="fw-semibold">
                          👥 {passengers}
                        </div>

                      </div>

                      <div className="col-6">

                        <small className="text-muted">
                          Price / Person
                        </small>

                        <div className="fw-semibold">
                          Rs.{" "}
                          {formatPrice(
                            pricePerPerson
                          )}
                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div className="p-3 bg-light rounded-3 mb-3">

                      <div className="d-flex justify-content-between">

                        <span className="fw-semibold">
                          Total Price
                        </span>

                        <strong className="text-primary">
                          Rs.{" "}
                          {formatPrice(
                            totalPrice
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* =================================================
                        BOOKING DATE
                    ================================================= */}

                    <small className="text-muted">
                      Booking Date
                    </small>

                    <p className="mb-3">
                      {formatDate(
                        booking.created_at
                      )}
                    </p>

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
                            : "Cancel Transport Booking"}
                        </button>
                      )}

                    {/* =================================================
                        CANCELLED MESSAGE
                    ================================================= */}

                    {isCancelled && (
                      <div className="alert alert-danger mb-0 mt-3 text-center">
                        This transport booking was cancelled.
                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default MyTransportBookings;

