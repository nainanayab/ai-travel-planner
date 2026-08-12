
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function MyTransportBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD MY TRANSPORT BOOKINGS
  // =====================================================

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const token = localStorage.getItem("token");

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!token) {
      setError("Please login to view your transport bookings.");
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

      console.log(
        "My Transport Bookings:",
        response.data
      );

      setBookings(response.data);

    } catch (err) {
      console.error(
        "Transport bookings error:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      if (
        err.response?.status === 401
      ) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1000);

      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load your transport bookings."
        );
      }

    } finally {
      setLoading(false);
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

        <p className="mt-3">
          Loading your transport bookings...
        </p>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger text-center">
          {error}
        </div>

        <div className="text-center">

          <button
            className="btn btn-primary"
            onClick={loadBookings}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container py-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-5">

        <div>

          <h1 className="fw-bold mb-2">
            My Transport Bookings
          </h1>

          <p className="text-muted mb-0">
            View all your booked transport services.
          </p>

        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/transport")}
        >
          Book More Transport
        </button>

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {bookings.length === 0 ? (

        <div className="card shadow-sm border-0">

          <div className="card-body text-center py-5">

            <h3 className="fw-bold">
              No Transport Bookings
            </h3>

            <p className="text-muted">
              You have not booked any transport yet.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/transport")}
            >
              Find Transport
            </button>

          </div>

        </div>

      ) : (

        <div className="row g-4">

          {bookings.map((booking) => (

            <div
              className="col-lg-6"
              key={booking.id}
            >

              <div className="card shadow-sm h-100 border-0">

                <div className="card-body">

                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>

                      <h5 className="fw-bold mb-1">
                        Transport Booking
                      </h5>

                      <small className="text-muted">
                        Booking #{booking.id}
                      </small>

                    </div>

                    <span
                      className={`badge ${
                        booking.status === "Confirmed"
                          ? "bg-success"
                          : booking.status === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {booking.status || "Pending"}
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

                    <p className="fw-semibold mb-0">
                      #{booking.transport_id}
                    </p>

                  </div>

                  {/* =================================================
                      PASSENGERS
                  ================================================= */}

                  <div className="row mb-3">

                    <div className="col-6">

                      <small className="text-muted">
                        Passengers
                      </small>

                      <p className="fw-semibold mb-0">
                        {booking.passengers}
                      </p>

                    </div>

                    <div className="col-6">

                      <small className="text-muted">
                        Price / Person
                      </small>

                      <p className="fw-semibold mb-0">
                        Rs.{" "}
                        {Number(
                          booking.price_per_person || 0
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      TOTAL
                  ================================================= */}

                  <div className="p-3 bg-light rounded mb-3">

                    <div className="d-flex justify-content-between">

                      <span className="fw-semibold">
                        Total Price
                      </span>

                      <strong className="text-primary">
                        Rs.{" "}
                        {Number(
                          booking.total_price || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                  </div>

                  {/* =================================================
                      DATE
                  ================================================= */}

                  <small className="text-muted">
                    Booking Date
                  </small>

                  <p className="mb-0">

                    {booking.created_at
                      ? new Date(
                          booking.created_at
                        ).toLocaleString()
                      : "Not available"}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyTransportBookings;

