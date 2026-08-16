import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaArrowLeft,
  FaCreditCard,
} from "react-icons/fa";

// =====================================================
// API
// =====================================================

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET SAVED TRIPS
  // =====================================================

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // -------------------------------------------------
      // LOGIN CHECK
      // -------------------------------------------------

      if (!token) {
        navigate("/login");
        return;
      }

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await API.get(
        "/trips/",
        getAuthConfig()
      );

      console.log(
        "=============================="
      );
      console.log("MY TRIPS API RESPONSE:");
      console.log(response.data);
      console.log(
        "=============================="
      );

      // -------------------------------------------------
      // HANDLE RESPONSE
      // -------------------------------------------------

      let receivedTrips = [];

      if (Array.isArray(response.data)) {
        receivedTrips = response.data;
      } else if (
        Array.isArray(response.data?.trips)
      ) {
        receivedTrips = response.data.trips;
      } else if (
        Array.isArray(response.data?.data)
      ) {
        receivedTrips = response.data.data;
      } else if (
        Array.isArray(response.data?.items)
      ) {
        receivedTrips = response.data.items;
      }

      setTrips(receivedTrips);
    } catch (err) {
      console.error(
        "GET MY TRIPS ERROR:",
        err
      );

      // -------------------------------------------------
      // UNAUTHORIZED
      // -------------------------------------------------

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please login again.",
          confirmButtonColor: "#0b5d1e",
        }).then(() => {
          navigate("/login");
        });

        return;
      }

      // -------------------------------------------------
      // ERROR MESSAGE
      // -------------------------------------------------

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to load your saved trips.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================================
  // LOAD TRIPS
  // =====================================================

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // =====================================================
  // DELETE TRIP
  // =====================================================

  const deleteTrip = async (tripId) => {
    // -------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------

    const result = await Swal.fire({
      title: "Delete Trip?",
      text: "This saved trip and its places will be deleted.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#64748b",

      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // -------------------------------------------------
      // DELETE REQUEST
      // -------------------------------------------------

      await API.delete(
        `/trips/${tripId}`,
        getAuthConfig()
      );

      // -------------------------------------------------
      // UPDATE UI
      // -------------------------------------------------

      setTrips((previousTrips) =>
        previousTrips.filter(
          (trip) => trip.id !== tripId
        )
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      Swal.fire({
        title: "Trip Deleted",
        text: "Your trip was deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(
        "DELETE TRIP ERROR:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please login again.",
          confirmButtonColor: "#0b5d1e",
        }).then(() => {
          navigate("/login");
        });

        return;
      }

      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to delete trip.",
        icon: "error",
        confirmButtonColor: "#0b5d1e",
      });
    }
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = (tripId) => {
    if (!tripId) {
      Swal.fire({
        icon: "error",
        title: "Invalid Trip",
        text: "Trip ID is missing.",
        confirmButtonColor: "#0b5d1e",
      });

      return;
    }

    navigate(`/payment/${tripId}`);
  };

  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (place) => {
    const image =
      place?.image_url ||
      place?.image ||
      place?.photo_url ||
      place?.photo;

    if (!image) {
      return null;
    }

    // -------------------------------------------------
    // FULL URL
    // -------------------------------------------------

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // -------------------------------------------------
    // BACKEND STATIC IMAGE
    // -------------------------------------------------

    if (image.startsWith("/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return `http://127.0.0.1:8000/${image}`;
  };

  // =====================================================
  // GET PLACE COUNT
  // =====================================================

  const getPlaceCount = (trip) => {
    if (Array.isArray(trip?.places)) {
      return trip.places.length;
    }

    if (trip?.place_count !== undefined) {
      return Number(trip.place_count) || 0;
    }

    if (trip?.total_places !== undefined) {
      return Number(trip.total_places) || 0;
    }

    return 0;
  };

  // =====================================================
  // GET FIRST PLACE
  // =====================================================

  const getFirstPlace = (trip) => {
    if (
      Array.isArray(trip?.places) &&
      trip.places.length > 0
    ) {
      return trip.places[0];
    }

    return null;
  };

  // =====================================================
  // GET NUMBER
  // =====================================================

  const getNumber = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return number;
  };

  // =====================================================
  // GET PLACE TICKET TOTAL
  // =====================================================

  const getPlaceTicketTotal = (trip) => {
    // -------------------------------------------------
    // BACKEND TOTAL
    // -------------------------------------------------

    if (
      trip?.place_ticket_total !== undefined &&
      trip?.place_ticket_total !== null
    ) {
      return getNumber(
        trip.place_ticket_total
      );
    }

    if (
      trip?.ticket_total !== undefined &&
      trip?.ticket_total !== null
    ) {
      return getNumber(
        trip.ticket_total
      );
    }

    // -------------------------------------------------
    // CALCULATE FROM PLACES
    // -------------------------------------------------

    if (Array.isArray(trip?.places)) {
      return trip.places.reduce(
        (total, place) => {
          const ticket =
            place?.ticket_price ??
            place?.ticket_cost ??
            place?.entry_fee ??
            place?.price ??
            0;

          return total + getNumber(ticket);
        },
        0
      );
    }

    return 0;
  };

  // =====================================================
  // GET BUS TICKET
  // =====================================================

  const getBusTicket = (trip) => {
    return getNumber(
      trip?.bus_ticket ??
        trip?.bus_cost ??
        trip?.transport_cost ??
        0
    );
  };

  // =====================================================
  // GET TOTAL COST
  // =====================================================

  const getTotalCost = (
    trip,
    placeTicket,
    busTicket
  ) => {
    // -------------------------------------------------
    // BACKEND TOTAL
    // -------------------------------------------------

    const backendTotal =
      trip?.total_ticket_cost ??
      trip?.total_cost ??
      trip?.estimated_cost;

    if (
      backendTotal !== undefined &&
      backendTotal !== null &&
      getNumber(backendTotal) > 0
    ) {
      return getNumber(backendTotal);
    }

    // -------------------------------------------------
    // CALCULATE
    // -------------------------------------------------

    return placeTicket + busTicket;
  };

  // =====================================================
  // GET TRIP TITLE
  // =====================================================

  const getTripTitle = (trip) => {
    return (
      trip?.title ||
      trip?.trip_name ||
      trip?.name ||
      "My Inside City Trip"
    );
  };

  // =====================================================
  // GET START DATE
  // =====================================================

  const getStartDate = (trip) => {
    return (
      trip?.start_date ||
      trip?.startDate ||
      trip?.from_date ||
      trip?.travel_date ||
      "N/A"
    );
  };

  // =====================================================
  // GET END DATE
  // =====================================================

  const getEndDate = (trip) => {
    return (
      trip?.end_date ||
      trip?.endDate ||
      trip?.to_date ||
      trip?.travel_end_date ||
      "N/A"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-trips-page">
        <div className="my-trips-container">

          <div className="trips-loading">

            <div className="trip-spinner"></div>

            <h3>
              Loading Your Trips...
            </h3>

            <p>
              Please wait while we fetch your
              saved travel plans.
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="my-trips-page">

      <div className="my-trips-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="my-trips-header">

          <div className="my-trips-header-left">

            <Link
              to="/trip-planner"
              className="back-planner-btn"
            >
              <FaArrowLeft />
              Back to Trip Planner
            </Link>

            <div className="my-trips-title-row">

              <div className="my-trips-icon">
                <FaMapMarkedAlt />
              </div>

              <div>

                <span className="my-trips-eyebrow">
                  TRAVEL DASHBOARD
                </span>

                <h1>
                  My Saved Trips
                </h1>

                <p>
                  View and manage your saved
                  Inside City travel plans.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              TRIP COUNT
          ================================================= */}

          <div className="trip-count-box">

            <strong>
              {trips.length}
            </strong>

            <span>
              {trips.length === 1
                ? "Saved Trip"
                : "Saved Trips"}
            </span>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="trip-error">

            <div>

              <strong>
                Unable to load trips
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={fetchTrips}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!error &&
          trips.length === 0 && (
            <div className="empty-trips">

              <div className="empty-trips-icon">
                <FaMapMarkedAlt />
              </div>

              <span className="empty-trips-label">
                YOUR TRAVEL PLANS
              </span>

              <h2>
                No Saved Trips Yet
              </h2>

              <p>
                Create an Inside City trip
                and save it here to view
                and manage it later.
              </p>

              <Link
                to="/trip-planner"
                className="create-trip-btn"
              >
                Create Your First Trip
              </Link>

            </div>
          )}

        {/* =================================================
            SAVED TRIPS
        ================================================= */}

        {!error &&
          trips.length > 0 && (
            <div className="my-trips-grid">

              {trips.map((trip) => {

                // -----------------------------------------
                // BASIC DATA
                // -----------------------------------------

                const firstPlace =
                  getFirstPlace(trip);

                const imageUrl =
                  getImageUrl(firstPlace);

                const placeCount =
                  getPlaceCount(trip);

                // -----------------------------------------
                // COSTS
                // -----------------------------------------

                const ticketTotal =
                  getPlaceTicketTotal(trip);

                const busTicket =
                  getBusTicket(trip);

                const totalCost =
                  getTotalCost(
                    trip,
                    ticketTotal,
                    busTicket
                  );

                // -----------------------------------------
                // TITLE / DATES
                // -----------------------------------------

                const tripTitle =
                  getTripTitle(trip);

                const startDate =
                  getStartDate(trip);

                const endDate =
                  getEndDate(trip);

                return (
                  <div
                    className="saved-trip-card"
                    key={trip.id}
                  >

                    {/* ===================================
                        IMAGE
                    =================================== */}

                    <div className="saved-trip-image">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            firstPlace?.name ||
                            tripTitle
                          }
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="trip-image-placeholder">
                          <FaMapMarkedAlt />
                        </div>
                      )}

                      <span className="trip-badge">
                        Inside City
                      </span>

                    </div>

                    {/* ===================================
                        CONTENT
                    =================================== */}

                    <div className="saved-trip-content">

                      <h2>
                        {tripTitle}
                      </h2>

                      {/* =================================
                          DATES
                      ================================= */}

                      <div className="trip-info-row">

                        <FaCalendarAlt />

                        <div>

                          <small>
                            TRAVEL DATES
                          </small>

                          <span>
                            {startDate}
                            {" → "}
                            {endDate}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          PLACES
                      ================================= */}

                      <div className="trip-info-row">

                        <FaMapMarkedAlt />

                        <div>

                          <small>
                            DESTINATIONS
                          </small>

                          <span>
                            {placeCount}{" "}
                            {placeCount === 1
                              ? "place"
                              : "places"}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          COSTS
                      ================================= */}

                      <div className="trip-costs">

                        {/* PLACE TICKETS */}

                        <div className="trip-cost-item">

                          <small>
                            Place Tickets
                          </small>

                          <strong>
                            Rs.{" "}
                            {ticketTotal.toLocaleString()}
                          </strong>

                        </div>

                        {/* BUS */}

                        <div className="trip-cost-item">

                          <small>
                            Bus
                          </small>

                          <strong>
                            Rs.{" "}
                            {busTicket.toLocaleString()}
                          </strong>

                        </div>

                        {/* TOTAL */}

                        <div className="trip-cost-item total">

                          <small>
                            Total
                          </small>

                          <strong>
                            Rs.{" "}
                            {totalCost.toLocaleString()}
                          </strong>

                        </div>

                      </div>

                      {/* =================================
                          ACTIONS
                      ================================= */}

                      <div className="trip-actions">

                        {/* VIEW */}

                        <Link
                          to={`/my-trips/${trip.id}`}
                          className="view-trip-btn"
                        >
                          <FaEye />
                          <span>
                            View Trip
                          </span>
                        </Link>

                        {/* PAYMENT */}

                        <button
                          type="button"
                          className="pay-trip-btn"
                          onClick={() =>
                            handlePayment(
                              trip.id
                            )
                          }
                        >
                          <FaCreditCard />
                          <span>
                            Payment
                          </span>
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-trip-btn"
                          onClick={() =>
                            deleteTrip(
                              trip.id
                            )
                          }
                          title="Delete Trip"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </div>
  );
}

export default MyTrips;
