
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function Transport() {
  const navigate = useNavigate();

  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTransport, setSelectedTransport] =
    useState(null);

  const [passengers, setPassengers] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // =====================================================
  // LOAD TRANSPORTS
  // =====================================================

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/transports/");

      const uniqueTransports = response.data.filter(
        (transport, index, self) =>
          index ===
          self.findIndex(
            (item) => item.id === transport.id
          )
      );

      setTransports(uniqueTransports);
    } catch (err) {
      console.error(
        "Transport loading error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load transport information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN BOOKING
  // =====================================================

  const openBooking = (transport) => {
    setSelectedTransport(transport);
    setPassengers(1);
    setBookingMessage("");
  };

  // =====================================================
  // CLOSE BOOKING
  // =====================================================

  const closeBooking = () => {
    if (bookingLoading) return;

    setSelectedTransport(null);
    setPassengers(1);
    setBookingMessage("");
  };

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = selectedTransport
    ? passengers *
      Number(
        selectedTransport.price_per_person || 0
      )
    : 0;

  // =====================================================
  // PASSENGER CHANGE
  // =====================================================

  const handlePassengerChange = (value) => {
    if (!selectedTransport) return;

    let number = Number(value);

    if (Number.isNaN(number)) {
      number = 1;
    }

    const availableSeats = Number(
      selectedTransport.available_seats || 0
    );

    if (number < 1) {
      number = 1;
    }

    if (number > availableSeats) {
      number = availableSeats;
    }

    setPassengers(number);
    setBookingMessage("");
  };

  // =====================================================
  // CONFIRM BOOKING
  // =====================================================

  const handleConfirmBooking = async () => {
    if (!selectedTransport) return;

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    const token = localStorage.getItem("token");

    if (!token) {
      setBookingMessage(
        "Please login first to book transport."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // -------------------------------------------------
    // PASSENGER VALIDATION
    // -------------------------------------------------

    if (passengers < 1) {
      setBookingMessage(
        "Please select at least 1 passenger."
      );
      return;
    }

    const availableSeats = Number(
      selectedTransport.available_seats || 0
    );

    if (availableSeats <= 0) {
      setBookingMessage(
        "No seats are currently available."
      );
      return;
    }

    if (passengers > availableSeats) {
      setBookingMessage(
        "Not enough seats available."
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage("Booking transport...");

      // -------------------------------------------------
      // CREATE TRANSPORT BOOKING
      // -------------------------------------------------

      const response = await API.post(
        "/transport-bookings/",
        {
          transport_id: Number(
            selectedTransport.id
          ),
          passengers: Number(passengers),
        }
      );

      console.log(
        "Transport Booking Response:",
        response.data
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setBookingMessage(
        "Transport booking successful! 🎉"
      );

      // -------------------------------------------------
      // UPDATE AVAILABLE SEATS
      // -------------------------------------------------

      setTransports((previous) =>
        previous.map((item) => {
          if (
            item.id === selectedTransport.id
          ) {
            return {
              ...item,
              available_seats:
                Number(
                  item.available_seats || 0
                ) - Number(passengers),
            };
          }

          return item;
        })
      );

      // Update selected transport too
      setSelectedTransport((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          available_seats:
            Number(
              previous.available_seats || 0
            ) - Number(passengers),
        };
      });

      // -------------------------------------------------
      // GO TO MY TRANSPORT BOOKINGS
      // -------------------------------------------------

      setTimeout(() => {
        setSelectedTransport(null);
        setPassengers(1);
        setBookingMessage("");

        navigate(
          "/my-transport-bookings"
        );
      }, 1200);

    } catch (err) {
      console.error(
        "Transport booking error:",
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

      // -------------------------------------------------
      // UNAUTHORIZED
      // -------------------------------------------------

      if (
        err.response?.status === 401
      ) {
        localStorage.removeItem("token");

        setBookingMessage(
          "Your login session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      // -------------------------------------------------
      // OTHER ERRORS
      // -------------------------------------------------

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setBookingMessage(detail);
      } else if (detail?.error) {
        setBookingMessage(detail.error);
      } else {
        setBookingMessage(
          "Unable to book transport. Please try again."
        );
      }

    } finally {
      setBookingLoading(false);
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
          Loading transport...
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
            onClick={fetchTransports}
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
          PAGE HEADER
      ================================================= */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          Tourist Transport
        </h1>

        <p className="text-muted">
          Find transport services for your tourism trips
        </p>

      </div>

      {/* =================================================
          TRANSPORT LIST
      ================================================= */}

      {transports.length === 0 ? (

        <div className="alert alert-info text-center">
          No transport services are currently available.
        </div>

      ) : (

        <div className="row g-4">

          {transports.map((transport) => {

            const availableSeats = Number(
              transport.available_seats || 0
            );

            const isAvailable =
              availableSeats > 0 &&
              transport.is_active !== false &&
              transport.status !== "Cancelled";

            return (
              <div
                className="col-lg-6"
                key={transport.id}
              >

                <div className="card shadow-sm h-100">

                  <div className="card-body">

                    {/* COMPANY */}

                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>

                        <h4 className="fw-bold mb-1">

                          {transport.company_name ||
                            transport.company ||
                            "Transport Service"}

                        </h4>

                        <span className="badge bg-primary">

                          {transport.vehicle_type ||
                            transport.transport_type ||
                            "Tourist Transport"}

                        </span>

                      </div>

                      <span
                        className={`badge ${
                          isAvailable
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>

                    </div>

                    {/* ROUTE */}

                    <div className="mb-3">

                      <h6 className="fw-bold">
                        Route
                      </h6>

                      <p className="mb-0">
                        📍 {transport.from_location}
                        {" → "}
                        {transport.to_location}
                      </p>

                    </div>

                    {/* TIME */}

                    <div className="row mb-3">

                      <div className="col-6">

                        <small className="text-muted">
                          Departure
                        </small>

                        <p className="fw-semibold mb-0">
                          {transport.departure_time ||
                            "Not specified"}
                        </p>

                      </div>

                      <div className="col-6">

                        <small className="text-muted">
                          Arrival
                        </small>

                        <p className="fw-semibold mb-0">
                          {transport.arrival_time ||
                            "Not specified"}
                        </p>

                      </div>

                    </div>

                    {/* SEATS */}

                    <div className="row mb-3">

                      <div className="col-6">

                        <small className="text-muted">
                          Total Seats
                        </small>

                        <p className="fw-semibold mb-0">
                          {transport.total_seats || 0}
                        </p>

                      </div>

                      <div className="col-6">

                        <small className="text-muted">
                          Available Seats
                        </small>

                        <p
                          className={`fw-semibold mb-0 ${
                            availableSeats <= 5
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {availableSeats}
                        </p>

                      </div>

                    </div>

                    {/* JOURNEY */}

                    {transport.journey_type && (

                      <div className="mb-3">

                        <small className="text-muted">
                          Journey Type
                        </small>

                        <p className="mb-0 fw-semibold">
                          {transport.journey_type}
                        </p>

                      </div>

                    )}

                    <hr />

                    {/* PRICE */}

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <small className="text-muted">
                          Price per person
                        </small>

                        <h4 className="fw-bold mb-0">

                          Rs.{" "}

                          {Number(
                            transport.price_per_person || 0
                          ).toLocaleString()}

                        </h4>

                      </div>

                      <button
                        className="btn btn-primary"
                        disabled={!isAvailable}
                        onClick={() =>
                          openBooking(transport)
                        }
                      >
                        Book Transport
                      </button>

                    </div>

                    {/* PHONE */}

                    {transport.phone && (

                      <div className="mt-3">

                        <small className="text-muted">
                          Contact
                        </small>

                        <p className="mb-0">
                          📞 {transport.phone}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {selectedTransport && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* MODAL HEADER */}

              <div className="modal-header">

                <h5 className="modal-title">
                  Book Transport
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeBooking}
                  disabled={bookingLoading}
                />

              </div>

              {/* MODAL BODY */}

              <div className="modal-body">

                <h5 className="fw-bold">

                  {selectedTransport.company_name ||
                    selectedTransport.company ||
                    "Transport Service"}

                </h5>

                <p className="mb-1">

                  📍{" "}

                  {selectedTransport.from_location}

                  {" → "}

                  {selectedTransport.to_location}

                </p>

                <p className="text-muted">

                  🚌{" "}

                  {selectedTransport.vehicle_type ||
                    selectedTransport.transport_type}

                </p>

                <hr />

                {/* PASSENGERS */}

                <label className="form-label fw-semibold">

                  Number of Passengers

                </label>

                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max={
                    selectedTransport.available_seats
                  }
                  value={passengers}
                  onChange={(e) =>
                    handlePassengerChange(
                      e.target.value
                    )
                  }
                  disabled={bookingLoading}
                />

                <small className="text-muted">

                  Maximum available seats:{" "}

                  {selectedTransport.available_seats}

                </small>

                {/* PRICE */}

                <div className="mt-4 p-3 bg-light rounded">

                  <div className="d-flex justify-content-between">

                    <span>
                      Price per person
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        selectedTransport.price_per_person ||
                          0
                      ).toLocaleString()}
                    </strong>

                  </div>

                  <div className="d-flex justify-content-between mt-2">

                    <span>
                      Passengers
                    </span>

                    <strong>
                      {passengers}
                    </strong>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <strong>
                      Total Price
                    </strong>

                    <strong className="text-primary">

                      Rs.{" "}

                      {totalPrice.toLocaleString()}

                    </strong>

                  </div>

                </div>

                {/* BOOKING MESSAGE */}

                {bookingMessage && (

                  <div
                    className={`alert ${
                      bookingMessage.includes(
                        "successful"
                      )
                        ? "alert-success"
                        : "alert-info"
                    } mt-3 mb-0`}
                  >
                    {bookingMessage}
                  </div>

                )}

              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeBooking}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                >

                  {bookingLoading
                    ? "Booking..."
                    : "Confirm Booking"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transport;
