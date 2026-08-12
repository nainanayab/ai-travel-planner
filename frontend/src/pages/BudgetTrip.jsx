
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function BudgetTrip() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location: "",
    days: 3,
    persons: 2,
    budget: 30000,
    travel_style: "Budget",
    include_hotel: true,
    include_transport: true,
    include_food: true,
    include_activities: true,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  // =====================================================
  // CREATE BUDGET TRIP
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first to create your AI trip plan.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    if (!form.location.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (Number(form.days) < 1) {
      setError("Trip must be at least 1 day.");
      return;
    }

    if (Number(form.persons) < 1) {
      setError("Please enter at least 1 traveler.");
      return;
    }

    if (Number(form.budget) <= 0) {
      setError("Please enter a valid budget.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await API.post(
        "/budget-trip/plan",
        {
          location: form.location.trim(),

          days: Number(form.days),

          persons: Number(form.persons),

          budget: Number(form.budget),

          travel_style: form.travel_style,

          include_hotel: form.include_hotel,

          include_transport: form.include_transport,

          include_food: form.include_food,

          include_activities: form.include_activities,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("AI Budget Trip:", response.data);

      setResult(response.data);
    } catch (err) {
      console.error(
        "Budget Trip Error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else if (detail?.error) {
        setError(detail.error);
      } else {
        setError(
          "Unable to create your AI budget trip. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-PK");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container py-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-5">

        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
          style={{
            width: "70px",
            height: "70px",
            fontSize: "32px",
          }}
        >
          🤖
        </div>

        <h1 className="fw-bold">
          AI Budget Trip Planner
        </h1>

        <p className="text-muted">
          Tell us your destination and budget. AI will
          create a complete trip plan for you.
        </p>

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
          FORM
      ================================================= */}

      {!result && (
        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div className="card shadow border-0">

              <div className="card-body p-4 p-md-5">

                <form onSubmit={handleSubmit}>

                  {/* DESTINATION */}

                  <div className="mb-4">

                    <label className="form-label fw-bold">
                      📍 Destination
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Bahawalpur"
                      required
                    />

                  </div>

                  {/* DAYS + PERSONS */}

                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-bold">
                        📅 Number of Days
                      </label>

                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="days"
                        min="1"
                        max="30"
                        value={form.days}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-bold">
                        👥 Travelers
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

                  </div>

                  {/* BUDGET */}

                  <div className="mb-4">

                    <label className="form-label fw-bold">
                      💰 Total Budget (PKR)
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg"
                      name="budget"
                      min="1"
                      value={form.budget}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* TRAVEL STYLE */}

                  <div className="mb-4">

                    <label className="form-label fw-bold">
                      🎒 Travel Style
                    </label>

                    <select
                      className="form-select form-select-lg"
                      name="travel_style"
                      value={form.travel_style}
                      onChange={handleChange}
                    >
                      <option value="Budget">
                        Budget
                      </option>

                      <option value="Standard">
                        Standard
                      </option>

                      <option value="Luxury">
                        Luxury
                      </option>
                    </select>

                  </div>

                  {/* SERVICES */}

                  <div className="mb-4">

                    <h5 className="fw-bold mb-3">
                      Include in my trip
                    </h5>

                    <div className="row">

                      <div className="col-md-6">

                        <div className="form-check mb-3">

                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="include_hotel"
                            checked={form.include_hotel}
                            onChange={handleChange}
                            id="includeHotel"
                          />

                          <label
                            className="form-check-label"
                            htmlFor="includeHotel"
                          >
                            🏨 Hotel
                          </label>

                        </div>

                        <div className="form-check mb-3">

                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="include_transport"
                            checked={form.include_transport}
                            onChange={handleChange}
                            id="includeTransport"
                          />

                          <label
                            className="form-check-label"
                            htmlFor="includeTransport"
                          >
                            🚌 Transport
                          </label>

                        </div>

                      </div>

                      <div className="col-md-6">

                        <div className="form-check mb-3">

                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="include_food"
                            checked={form.include_food}
                            onChange={handleChange}
                            id="includeFood"
                          />

                          <label
                            className="form-check-label"
                            htmlFor="includeFood"
                          >
                            🍽️ Food
                          </label>

                        </div>

                        <div className="form-check mb-3">

                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="include_activities"
                            checked={form.include_activities}
                            onChange={handleChange}
                            id="includeActivities"
                          />

                          <label
                            className="form-check-label"
                            htmlFor="includeActivities"
                          >
                            🎟️ Activities
                          </label>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "🤖 Creating your AI trip..."
                      : "✨ Create My AI Budget Trip"}
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          RESULT
      ================================================= */}

      {result && (

        <div className="row justify-content-center">

          <div className="col-lg-10">

            {/* SUMMARY */}

            <div className="card shadow border-0 mb-4">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center flex-wrap">

                  <div>

                    <h2 className="fw-bold mb-1">
                      🌍 {result.location}
                    </h2>

                    <p className="text-muted mb-0">
                      {result.days} days ·{" "}
                      {result.persons} travelers
                    </p>

                  </div>

                  <div className="text-end mt-3 mt-md-0">

                    <small className="text-muted">
                      Total Budget
                    </small>

                    <h3 className="fw-bold text-primary mb-0">
                      Rs. {formatMoney(result.budget)}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* BUDGET BREAKDOWN */}

            <div className="card shadow-sm border-0 mb-4">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  💰 Budget Breakdown
                </h4>

                <div className="row g-3">

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted">
                        🏨 Hotel
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs. {formatMoney(result.hotel_cost)}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted">
                        🚌 Transport
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs. {formatMoney(result.transport_cost)}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted">
                        🍽️ Food
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs. {formatMoney(result.food_cost)}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted">
                        🎟️ Activities
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs. {formatMoney(result.activities_cost)}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded">
                      <small className="text-muted">
                        🧾 Miscellaneous
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs.{" "}
                        {formatMoney(
                          result.miscellaneous_cost
                        )}
                      </h5>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 bg-primary text-white rounded">
                      <small>
                        Total Cost
                      </small>
                      <h5 className="fw-bold mb-0">
                        Rs.{" "}
                        {formatMoney(
                          result.total_cost
                        )}
                      </h5>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* STATUS */}

            <div
              className={`alert ${
                result.budget_status === "Over Budget"
                  ? "alert-danger"
                  : result.budget_status ===
                    "Near Budget Limit"
                  ? "alert-warning"
                  : "alert-success"
              }`}
            >

              <strong>
                Budget Status:
              </strong>{" "}

              {result.budget_status}

              <span className="float-end">

                Remaining: Rs.{" "}
                {formatMoney(
                  result.remaining_budget
                )}

              </span>

            </div>

            {/* ITINERARY */}

            <div className="card shadow-sm border-0">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  🗓️ AI Trip Itinerary
                </h4>

                {result.itinerary.map(
                  (day) => (

                    <div
                      key={day.day}
                      className="mb-4"
                    >

                      <h5 className="fw-bold">
                        Day {day.day}
                      </h5>

                      {day.places.length === 0 ? (

                        <p className="text-muted">
                          No additional places
                          available for this day.
                        </p>

                      ) : (

                        <div className="row g-3">

                          {day.places.map(
                            (place) => (

                              <div
                                className="col-md-4"
                                key={place.id}
                              >

                                <div className="card h-100 border">

                                  <div className="card-body">

                                    <h6 className="fw-bold">
                                      📍 {place.name}
                                    </h6>

                                    <p className="small text-muted mb-1">
                                      {place.location}
                                    </p>

                                    <span className="badge bg-secondary">
                                      {place.category}
                                    </span>

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>

            {/* NEW PLAN */}

            <div className="text-center mt-4">

              <button
                className="btn btn-outline-primary"
                onClick={() => setResult(null)}
              >
                🔄 Create Another Trip
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default BudgetTrip;
