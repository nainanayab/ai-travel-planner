import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function HotelBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [form, setForm] = useState({
    check_in: "",
    check_out: "",
    persons: 1,
    rooms: 1,
    meal_plan: "none",
    wifi_required: true,
    payment_method: "online",
  });

  // =====================================================
  // LOAD HOTEL
  // =====================================================

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await API.get(`/hotels/${id}`);

        setHotel(response.data);

        // If hotel has no Wi-Fi, automatically disable it.
        setForm((previous) => ({
          ...previous,
          wifi_required:
            response.data?.wifi_included ?? true,
        }));
      } catch (error) {
        console.error(
          "Hotel Error:",
          error.response?.data || error.message
        );

        setMessage("Unable to load hotel.");
        setMessageType("danger");
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [id]);

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =====================================================
  // NIGHTS
  // =====================================================

  const calculateNights = () => {
    if (!form.check_in || !form.check_out) {
      return 0;
    }

    const checkIn = new Date(form.check_in);
    const checkOut = new Date(form.check_out);

    const difference =
      checkOut.getTime() - checkIn.getTime();

    const nights =
      difference / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  // =====================================================
  // PRICE
  // =====================================================

  const pricePerNight = Number(
    hotel?.price_per_night || 0
  );

  const rooms = Number(
    form.rooms || 1
  );

  const totalPrice =
    nights *
    pricePerNight *
    rooms;

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  // =====================================================
  // MEAL LABEL
  // =====================================================

  const getMealLabel = () => {
    switch (form.meal_plan) {
      case "breakfast":
        return "Breakfast";

      case "dinner":
        return "Dinner";

      case "both":
        return "Breakfast + Dinner";

      default:
        return "No Meal";
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage("");
  };

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const submitBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // ===================================================
    // LOGIN CHECK
    // ===================================================

    if (!token) {
      setMessage("Please login first.");
      setMessageType("warning");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // ===================================================
    // CHECK-IN DATE
    // ===================================================

    if (!form.check_in) {
      setMessage(
        "Please select a check-in date."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // CHECK-OUT DATE
    // ===================================================

    if (!form.check_out) {
      setMessage(
        "Please select a check-out date."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // DATE VALIDATION
    // ===================================================

    if (
      form.check_out <=
      form.check_in
    ) {
      setMessage(
        "Check-out date must be after check-in date."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // PERSONS VALIDATION
    // ===================================================

    if (Number(form.persons) < 1) {
      setMessage(
        "At least 1 person is required."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // ROOMS VALIDATION
    // ===================================================

    if (Number(form.rooms) < 1) {
      setMessage(
        "At least 1 room is required."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // PRICE VALIDATION
    // ===================================================

    if (pricePerNight <= 0) {
      setMessage(
        "Hotel price is currently unavailable."
      );

      setMessageType("danger");

      return;
    }

    // ===================================================
    // BREAKFAST VALIDATION
    // ===================================================

    if (
      (
        form.meal_plan === "breakfast" ||
        form.meal_plan === "both"
      ) &&
      !hotel.breakfast_included
    ) {
      setMessage(
        "Breakfast is not available at this hotel."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // DINNER VALIDATION
    // ===================================================

    if (
      (
        form.meal_plan === "dinner" ||
        form.meal_plan === "both"
      ) &&
      !hotel.dinner_included
    ) {
      setMessage(
        "Dinner is not available at this hotel."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // WIFI VALIDATION
    // ===================================================

    if (
      form.wifi_required &&
      !hotel.wifi_included
    ) {
      setMessage(
        "Wi-Fi is not available at this hotel."
      );

      setMessageType("warning");

      return;
    }

    // ===================================================
    // START BOOKING
    // ===================================================

    setBooking(true);
    setMessage("");

    try {
      const response = await API.post(
        "/bookings/hotel",
        {
          hotel_id: Number(id),

          check_in: form.check_in,

          check_out: form.check_out,

          persons: Number(form.persons),

          rooms: Number(form.rooms),

          meal_plan: form.meal_plan,

          wifi_required:
            form.wifi_required,

          payment_method:
            form.payment_method,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Hotel Booking Created:",
        response.data
      );

      // =================================================
      // BOOKING SUCCESS
      // =================================================

      if (
        form.payment_method === "online"
      ) {
        setMessage(
          `Booking created! 🎉 Booking #${response.data.id}. Redirecting to your hotel bookings...`
        );

        setMessageType("success");

        // =================================================
        // IMPORTANT:
        // HOTEL BOOKINGS PAGE
        // =================================================

        setTimeout(() => {
          navigate(
            "/my-hotel-bookings"
          );
        }, 1800);
      } else {
        setMessage(
          `Hotel booking successful! 🎉 Booking ID: ${response.data.id}`
        );

        setMessageType("success");

        setTimeout(() => {
          navigate(
            "/my-hotel-bookings"
          );
        }, 1500);
      }
    } catch (error) {
      console.error(
        "Hotel Booking Error:",
        error.response?.data ||
          error.message
      );

      // =================================================
      // SESSION EXPIRED
      // =================================================

      if (
        error.response?.status === 401
      ) {
        setMessage(
          "Your login session is invalid. Please login again."
        );

        setMessageType("danger");

        localStorage.removeItem(
          "token"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(
          error.response?.data?.detail ||
            "Hotel booking failed."
        );

        setMessageType("danger");
      }
    } finally {
      setBooking(false);
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

        <p className="mt-3">
          Loading hotel...
        </p>

      </div>
    );
  }

  // =====================================================
  // HOTEL NOT FOUND
  // =====================================================

  if (!hotel) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger text-center">
          {message ||
            "Hotel not found."}
        </div>

        <div className="text-center">

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/hotels")
            }
          >
            ← Back to Hotels
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

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card shadow border-0">

            <div className="card-body p-4 p-md-5">

              {/* =========================================
                  HEADER
              ========================================= */}

              <div className="text-center mb-4">

                <h1 className="fw-bold">
                  🏨 Book Hotel
                </h1>

                <h4 className="text-primary mt-3">
                  {hotel.name}
                </h4>

                <p className="text-muted mb-0">
                  📍 {hotel.location}
                </p>

                {hotel.rating && (
                  <p className="mt-2 mb-1">
                    ⭐ {hotel.rating}
                  </p>
                )}

                <p className="mt-2">

                  <strong>
                    PKR{" "}
                    {formatPrice(
                      pricePerNight
                    )}
                  </strong>

                  <span className="text-muted">
                    {" "}
                    per night
                  </span>

                </p>

              </div>

              {/* =========================================
                  MESSAGE
              ========================================= */}

              {message && (
                <div
                  className={
                    `alert alert-${messageType}`
                  }
                >
                  {message}
                </div>
              )}

              {/* =========================================
                  FORM
              ========================================= */}

              <form
                onSubmit={submitBooking}
              >

                {/* =======================================
                    DATES
                ======================================= */}

                <div className="row">

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Check-in Date
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="check_in"
                      value={form.check_in}
                      min={today}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Check-out Date
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg"
                      name="check_out"
                      value={form.check_out}
                      min={
                        form.check_in ||
                        today
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* =======================================
                    PERSONS + ROOMS
                ======================================= */}

                <div className="row">

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Number of Persons
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="persons"
                      min="1"
                      max="50"
                      value={form.persons}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-6 mb-4">

                    <label className="form-label fw-bold">
                      Number of Rooms
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="rooms"
                      min="1"
                      max="20"
                      value={form.rooms}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* =======================================
                    MEAL OPTIONS
                ======================================= */}

                <div className="card border mb-4">

                  <div className="card-body">

                    <h5 className="fw-bold mb-3">
                      🍽️ Meal Preference
                    </h5>

                    <p className="text-muted small">
                      Select the meal option you want
                      with your hotel booking.
                    </p>

                    <div className="row g-3">

                      {/* NO MEAL */}

                      <div className="col-md-6">

                        <label className="border rounded p-3 w-100 h-100">

                          <input
                            type="radio"
                            name="meal_plan"
                            value="none"
                            checked={
                              form.meal_plan ===
                              "none"
                            }
                            onChange={
                              handleChange
                            }
                            className="me-2"
                          />

                          🚫 No Meal

                        </label>

                      </div>

                      {/* BREAKFAST */}

                      <div className="col-md-6">

                        <label
                          className={
                            `border rounded p-3 w-100 h-100 ${
                              !hotel.breakfast_included
                                ? "bg-light text-muted"
                                : ""
                            }`
                          }
                        >

                          <input
                            type="radio"
                            name="meal_plan"
                            value="breakfast"
                            checked={
                              form.meal_plan ===
                              "breakfast"
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              !hotel.breakfast_included
                            }
                            className="me-2"
                          />

                          🍳 Breakfast

                          {hotel.breakfast_included && (
                            <small className="text-success d-block mt-1">
                              Included
                            </small>
                          )}

                        </label>

                      </div>

                      {/* DINNER */}

                      <div className="col-md-6">

                        <label
                          className={
                            `border rounded p-3 w-100 h-100 ${
                              !hotel.dinner_included
                                ? "bg-light text-muted"
                                : ""
                            }`
                          }
                        >

                          <input
                            type="radio"
                            name="meal_plan"
                            value="dinner"
                            checked={
                              form.meal_plan ===
                              "dinner"
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              !hotel.dinner_included
                            }
                            className="me-2"
                          />

                          🍽️ Dinner

                          {hotel.dinner_included && (
                            <small className="text-success d-block mt-1">
                              Included
                            </small>
                          )}

                        </label>

                      </div>

                      {/* BOTH */}

                      <div className="col-md-6">

                        <label
                          className={
                            `border rounded p-3 w-100 h-100 ${
                              !hotel.breakfast_included ||
                              !hotel.dinner_included
                                ? "bg-light text-muted"
                                : ""
                            }`
                          }
                        >

                          <input
                            type="radio"
                            name="meal_plan"
                            value="both"
                            checked={
                              form.meal_plan ===
                              "both"
                            }
                            onChange={
                              handleChange
                            }
                            disabled={
                              !hotel.breakfast_included ||
                              !hotel.dinner_included
                            }
                            className="me-2"
                          />

                          🍳🍽️ Breakfast + Dinner

                          {hotel.breakfast_included &&
                            hotel.dinner_included && (
                              <small className="text-success d-block mt-1">
                                Included
                              </small>
                            )}

                        </label>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =======================================
                    WIFI
                ======================================= */}

                <div className="card border mb-4">

                  <div className="card-body">

                    <h5 className="fw-bold mb-3">
                      📶 Internet / Wi-Fi
                    </h5>

                    {hotel.wifi_included ? (

                      <label className="border rounded p-3 d-flex align-items-center justify-content-between">

                        <div>

                          <strong>
                            📶 Wi-Fi
                          </strong>

                          <small className="text-success d-block">
                            Available / Included
                          </small>

                        </div>

                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="wifi_required"
                          checked={
                            form.wifi_required
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </label>

                    ) : (

                      <div className="alert alert-secondary mb-0">
                        📶 Wi-Fi is not available
                        at this hotel.
                      </div>

                    )}

                  </div>

                </div>

                {/* =======================================
                    PAYMENT
                ======================================= */}

                <div className="card border mb-4">

                  <div className="card-body">

                    <h5 className="fw-bold mb-3">
                      💳 Payment Method
                    </h5>

                    <label className="border rounded p-3 w-100">

                      <input
                        type="radio"
                        name="payment_method"
                        value="online"
                        checked={
                          form.payment_method ===
                          "online"
                        }
                        onChange={
                          handleChange
                        }
                        className="me-2"
                      />

                      <strong>
                        💳 Online Payment
                      </strong>

                      <small className="text-muted d-block mt-1 ms-4">
                        Pay securely online using
                        available payment methods.
                      </small>

                    </label>

                  </div>

                </div>

                {/* =======================================
                    BOOKING SUMMARY
                ======================================= */}

                {nights > 0 && (
                  <div className="card bg-light border-0 mb-4">

                    <div className="card-body">

                      <h5 className="fw-bold mb-4">
                        🧾 Booking Summary
                      </h5>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Hotel
                        </span>

                        <strong>
                          {hotel.name}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Check-in
                        </span>

                        <strong>
                          {form.check_in}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Check-out
                        </span>

                        <strong>
                          {form.check_out}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Persons
                        </span>

                        <strong>
                          {form.persons}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Rooms
                        </span>

                        <strong>
                          {rooms}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Nights
                        </span>

                        <strong>
                          {nights}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Meal
                        </span>

                        <strong>
                          {getMealLabel()}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Wi-Fi
                        </span>

                        <strong>
                          {form.wifi_required
                            ? "Yes"
                            : "No"}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Price / Night
                        </span>

                        <strong>
                          PKR{" "}
                          {formatPrice(
                            pricePerNight
                          )}
                        </strong>

                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">

                        <strong className="fs-5">
                          Total
                        </strong>

                        <strong className="text-success fs-4">
                          PKR{" "}
                          {formatPrice(
                            totalPrice
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>
                )}

                {/* =======================================
                    BUTTONS
                ======================================= */}

                <div className="d-grid gap-2">

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={
                      booking ||
                      nights <= 0
                    }
                  >

                    {booking
                      ? "Processing..."
                      : "💳 Continue to Online Payment"}

                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      navigate(
                        `/hotels/${hotel.id}`
                      )
                    }
                    disabled={booking}
                  >
                    ← Back to Hotel
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HotelBooking;