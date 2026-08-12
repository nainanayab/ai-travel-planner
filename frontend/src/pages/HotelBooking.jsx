
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
  });

  // ==========================================
  // LOAD HOTEL
  // ==========================================

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await API.get(`/hotels/${id}`);

        console.log("Hotel:", response.data);

        setHotel(response.data);
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

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // CALCULATE NIGHTS
  // ==========================================

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

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const pricePerNight =
    Number(hotel?.price_per_night || 0);

  const rooms = Number(form.rooms || 1);

  const totalPrice =
    nights * pricePerNight * rooms;

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ==========================================
  // HANDLE FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

  const submitBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!token) {
      setMessage("Please login first.");
      setMessageType("warning");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // ==========================================
    // DATE VALIDATION
    // ==========================================

    if (!form.check_in) {
      setMessage(
        "Please select a check-in date."
      );
      setMessageType("warning");
      return;
    }

    if (!form.check_out) {
      setMessage(
        "Please select a check-out date."
      );
      setMessageType("warning");
      return;
    }

    if (form.check_out <= form.check_in) {
      setMessage(
        "Check-out date must be after check-in date."
      );
      setMessageType("warning");
      return;
    }

    // ==========================================
    // PERSON VALIDATION
    // ==========================================

    if (Number(form.persons) < 1) {
      setMessage(
        "At least 1 person is required."
      );
      setMessageType("warning");
      return;
    }

    // ==========================================
    // ROOM VALIDATION
    // ==========================================

    if (Number(form.rooms) < 1) {
      setMessage(
        "At least 1 room is required."
      );
      setMessageType("warning");
      return;
    }

    // ==========================================
    // PRICE VALIDATION
    // ==========================================

    if (pricePerNight <= 0) {
      setMessage(
        "Hotel price is currently unavailable."
      );
      setMessageType("danger");
      return;
    }

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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Hotel Booking Created:",
        response.data
      );

      setMessage(
        `Hotel booking successful! 🎉 Booking ID: ${response.data.id}`
      );

      setMessageType("success");

      // ==========================================
      // GO TO MY BOOKINGS
      // ==========================================

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);

    } catch (error) {
      console.error(
        "Hotel Booking Error:",
        error.response?.data ||
          error.message
      );

      if (error.response?.status === 401) {
        setMessage(
          "Your login session is invalid. Please login again."
        );

        setMessageType("danger");

        localStorage.removeItem("token");

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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading hotel...
        </p>

      </div>
    );
  }

  // ==========================================
  // HOTEL NOT FOUND
  // ==========================================

  if (!hotel) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger text-center">
          {message || "Hotel not found."}
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

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow border-0">

            <div className="card-body p-4 p-md-5">

              {/* ==================================
                  HEADER
              ================================== */}

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

              {/* ==================================
                  MESSAGE
              ================================== */}

              {message && (
                <div
                  className={`alert alert-${messageType}`}
                >
                  {message}
                </div>
              )}

              {/* ==================================
                  BOOKING FORM
              ================================== */}

              <form onSubmit={submitBooking}>

                {/* CHECK IN */}

                <div className="mb-4">

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

                {/* CHECK OUT */}

                <div className="mb-4">

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

                {/* PERSONS */}

                <div className="mb-4">

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

                {/* ROOMS */}

                <div className="mb-4">

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

                {/* ==================================
                    BOOKING SUMMARY
                ================================== */}

                {nights > 0 && (
                  <div className="card bg-light border-0 mb-4">

                    <div className="card-body">

                      <h5 className="fw-bold mb-3">
                        💰 Booking Summary
                      </h5>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Price per night
                        </span>

                        <strong>
                          PKR{" "}
                          {formatPrice(
                            pricePerNight
                          )}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Number of nights
                        </span>

                        <strong>
                          {nights}
                        </strong>

                      </div>

                      <div className="d-flex justify-content-between mb-2">

                        <span>
                          Number of rooms
                        </span>

                        <strong>
                          {rooms}
                        </strong>

                      </div>

                      <hr />

                      <div className="d-flex justify-content-between">

                        <span className="fw-bold">
                          Total
                        </span>

                        <span className="fw-bold text-success fs-5">

                          PKR{" "}
                          {formatPrice(
                            totalPrice
                          )}

                        </span>

                      </div>

                    </div>

                  </div>
                )}

                {/* ==================================
                    BUTTONS
                ================================== */}

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
                      ? "Booking..."
                      : "Confirm Hotel Booking"}
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


