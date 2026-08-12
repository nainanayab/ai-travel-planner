
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function Booking() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(true);

  const [form, setForm] = useState({
    place_id: "",
    visit_date: "",
    persons: 1,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("info");

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // LOAD PLACES
  // ==========================================

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setPlacesLoading(true);
        setMessage("");

        const response =
          await API.get("/places/");

        console.log(
          "Places:",
          response.data
        );

        setPlaces(response.data);

      } catch (error) {

        console.error(
          "Places Error:",
          error.response?.data ||
            error.message
        );

        setMessage(
          "Unable to load tourism places."
        );

        setMessageType("danger");

      } finally {

        setPlacesLoading(false);

      }
    };

    loadPlaces();
  }, []);

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
  // SELECTED PLACE
  // ==========================================

  const selectedPlace = places.find(
    (place) =>
      Number(place.id) ===
      Number(form.place_id)
  );

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

  const submitBooking = async (e) => {

    e.preventDefault();

    const token =
      localStorage.getItem("token");

    console.log(
      "TOKEN EXISTS:",
      !!token
    );

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!token) {

      setMessage(
        "Please login first."
      );

      setMessageType("warning");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // ==========================================
    // PLACE VALIDATION
    // ==========================================

    if (!form.place_id) {

      setMessage(
        "Please select a place."
      );

      setMessageType("warning");

      return;
    }

    // ==========================================
    // DATE VALIDATION
    // ==========================================

    if (!form.visit_date) {

      setMessage(
        "Please select a visit date."
      );

      setMessageType("warning");

      return;
    }

    if (form.visit_date < today) {

      setMessage(
        "Visit date cannot be in the past."
      );

      setMessageType("warning");

      return;
    }

    // ==========================================
    // PERSON VALIDATION
    // ==========================================

    if (
      !form.persons ||
      Number(form.persons) < 1
    ) {

      setMessage(
        "Please enter at least 1 person."
      );

      setMessageType("warning");

      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const response =
        await API.post(
          "/bookings/",
          {
            place_id:
              Number(form.place_id),

            visit_date:
              form.visit_date,

            persons:
              Number(form.persons),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Booking Response:",
        response.data
      );

      setMessage(
        "Place booking successful! 🎉"
      );

      setMessageType("success");

      // ==========================================
      // RESET FORM
      // ==========================================

      setForm({
        place_id: "",
        visit_date: "",
        persons: 1,
      });

      // ==========================================
      // GO TO MY BOOKINGS
      // ==========================================

      setTimeout(() => {

        navigate(
          "/my-bookings"
        );

      }, 1200);

    } catch (error) {

      console.error(
        "Booking Error:",
        error.response?.data ||
          error.message
      );

      console.error(
        "Booking Status:",
        error.response?.status
      );

      if (
        error.response?.status ===
        401
      ) {

        setMessage(
          "Your login session has expired. Please login again."
        );

        setMessageType("danger");

        localStorage.removeItem(
          "token"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);

      } else {

        const detail =
          error.response?.data?.detail;

        if (
          typeof detail ===
          "string"
        ) {

          setMessage(detail);

        } else if (
          detail?.error
        ) {

          setMessage(
            detail.error
          );

        } else {

          setMessage(
            "Booking failed. Please try again."
          );

        }

        setMessageType("danger");
      }

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container py-5">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          📅 Book Your Visit
        </h1>

        <p className="text-muted">
          Reserve your visit and keep
          your travel plans organized.
        </p>

      </div>

      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (

        <div
          className={`alert alert-${messageType} text-center`}
        >
          {message}
        </div>

      )}

      {/* ======================================
          BOOKING FORM
      ====================================== */}

      <div className="row justify-content-center">

        <div className="col-lg-7">

          <div className="card shadow border-0">

            <div className="card-body p-4 p-md-5">

              <form
                onSubmit={submitBooking}
              >

                {/* ==================================
                    PLACE
                ================================== */}

                <div className="mb-4">

                  <label className="form-label fw-bold">
                    Select Tourist Place
                  </label>

                  <select
                    className="form-select form-select-lg"
                    name="place_id"
                    value={form.place_id}
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      placesLoading
                    }
                  >

                    <option value="">

                      {placesLoading
                        ? "Loading places..."
                        : "Choose a place"}

                    </option>

                    {places.map(
                      (place) => (

                        <option
                          key={
                            place.id
                          }
                          value={
                            place.id
                          }
                        >

                          {place.name}

                          {place.location
                            ? ` — ${place.location}`
                            : ""}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ==================================
                    SELECTED PLACE INFORMATION
                ================================== */}

                {selectedPlace && (

                  <div className="alert alert-light border mb-4">

                    <h5 className="fw-bold text-primary">

                      📍{" "}
                      {selectedPlace.name}

                    </h5>

                    {selectedPlace.location && (

                      <p className="mb-1">

                        <strong>
                          Location:
                        </strong>{" "}

                        {
                          selectedPlace.location
                        }

                      </p>

                    )}

                    {selectedPlace.category && (

                      <p className="mb-1">

                        <strong>
                          Category:
                        </strong>{" "}

                        {
                          selectedPlace.category
                        }

                      </p>

                    )}

                    {selectedPlace.description && (

                      <p className="text-muted mb-0">

                        {
                          selectedPlace.description
                        }

                      </p>

                    )}

                  </div>

                )}

                {/* ==================================
                    VISIT DATE
                ================================== */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    Visit Date

                  </label>

                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="visit_date"
                    value={
                      form.visit_date
                    }
                    onChange={
                      handleChange
                    }
                    min={today}
                    required
                  />

                  <small className="text-muted">

                    Select the date you
                    plan to visit.

                  </small>

                </div>

                {/* ==================================
                    PERSONS
                ================================== */}

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
                    value={
                      form.persons
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <small className="text-muted">

                    Include everyone
                    visiting the place.

                  </small>

                </div>

                {/* ==================================
                    BOOKING SUMMARY
                ================================== */}

                {selectedPlace &&
                  form.visit_date && (

                    <div className="card bg-light border-0 mb-4">

                      <div className="card-body">

                        <h5 className="fw-bold mb-3">

                          📋 Visit Summary

                        </h5>

                        <div className="d-flex justify-content-between mb-2">

                          <span>
                            Destination
                          </span>

                          <strong>
                            {
                              selectedPlace.name
                            }
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between mb-2">

                          <span>
                            Visit date
                          </span>

                          <strong>
                            {
                              form.visit_date
                            }
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between">

                          <span>
                            Visitors
                          </span>

                          <strong>
                            {
                              form.persons
                            }
                          </strong>

                        </div>

                      </div>

                    </div>

                  )}

                {/* ==================================
                    CONFIRM
                ================================== */}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={
                    loading ||
                    placesLoading
                  }
                >

                  {loading
                    ? "Booking..."
                    : "Confirm Visit Booking"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Booking;



