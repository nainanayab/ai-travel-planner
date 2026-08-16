import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api";
import Swal from "sweetalert2";

import "./TripDetails.css";

function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // LOAD TRIP
  // =====================================================

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get(
          `/trips/${tripId}`,
          getAuthConfig()
        );

        console.log("TRIP DETAILS:", response.data);

        setTrip(response.data);
      } catch (error) {
        console.error("Trip details error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");

          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Please login again.",
            confirmButtonColor: "#0284C7",
          }).then(() => {
            navigate("/login");
          });

          return;
        }

        Swal.fire({
          icon: "error",
          title: "Trip Not Found",
          text:
            error.response?.data?.detail ||
            "Unable to load this trip.",
          confirmButtonColor: "#0284C7",
        }).then(() => {
          navigate("/my-trips");
        });
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId, navigate]);

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete this trip?",
      text: "This trip and all saved places will be deleted.",
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
      await API.delete(
        `/trips/${tripId}`,
        getAuthConfig()
      );

      await Swal.fire({
        icon: "success",
        title: "Trip Deleted",
        text: "Your trip has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/my-trips");
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        navigate("/login");
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.detail ||
          "Unable to delete this trip.",
        confirmButtonColor: "#0284C7",
      });
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return `http://127.0.0.1:8000/${image}`;
  };

  // =====================================================
  // NUMBER
  // =====================================================

  const getNumber = (value) => {
    const number = Number(value);

    return Number.isNaN(number) ? 0 : number;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="trip-details-page">
        <div className="trip-details-loading">
          <div className="trip-spinner"></div>

          <h3>
            Loading Trip Details...
          </h3>

          <p>
            Please wait while we load your saved trip.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO TRIP
  // =====================================================

  if (!trip) {
    return (
      <div className="trip-details-page">
        <div className="trip-details-empty">
          <h2>
            Trip not found
          </h2>

          <p>
            This trip could not be found.
          </p>

          <Link to="/my-trips">
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const places = Array.isArray(trip.places)
    ? trip.places
    : [];

  const placeTicketTotal = getNumber(
    trip.place_ticket_total
  );

  const busTicket = getNumber(
    trip.bus_ticket
  );

  const backendTotal = getNumber(
    trip.total_ticket_cost
  );

  const totalCost =
    backendTotal > 0
      ? backendTotal
      : placeTicketTotal + busTicket;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="trip-details-page">

      <div className="trip-details-container">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/my-trips"
          className="trip-back-link"
        >
          ← Back to My Trips
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="trip-details-header">

          <div>

            <span className="trip-details-label">
              SAVED INSIDE CITY TRIP
            </span>

            <h1>
              {trip.title ||
                "My Inside City Trip"}
            </h1>

            <p>
              Your saved Inside City travel plan.
            </p>

          </div>

          <button
            type="button"
            className="trip-details-delete"
            onClick={handleDelete}
          >
            Delete Trip
          </button>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="trip-summary-grid">

          <div className="trip-summary-card">
            <span>
              Start Date
            </span>

            <strong>
              {trip.start_date || "N/A"}
            </strong>
          </div>

          <div className="trip-summary-card">
            <span>
              End Date
            </span>

            <strong>
              {trip.end_date || "N/A"}
            </strong>
          </div>

          <div className="trip-summary-card">
            <span>
              Places
            </span>

            <strong>
              {places.length}
            </strong>
          </div>

          <div className="trip-summary-card">
            <span>
              Total Cost
            </span>

            <strong>
              Rs. {totalCost.toLocaleString()}
            </strong>
          </div>

        </div>

        {/* =================================================
            COST BREAKDOWN
        ================================================= */}

        <div className="trip-details-section">

          <div className="trip-section-heading">
            <h2>
              Cost Breakdown
            </h2>
          </div>

          <div className="trip-cost-details">

            <div>
              <span>
                Place Tickets
              </span>

              <strong>
                Rs.{" "}
                {placeTicketTotal.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>
                Bus Ticket
              </span>

              <strong>
                Rs.{" "}
                {busTicket.toLocaleString()}
              </strong>
            </div>

            <div className="trip-cost-final">
              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {totalCost.toLocaleString()}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            PLACES
        ================================================= */}

        <div className="trip-details-section">

          <div className="trip-section-heading">

            <div>
              <span>
                YOUR TRAVEL PLAN
              </span>

              <h2>
                Places to Visit
              </h2>
            </div>

          </div>

          {places.length > 0 ? (

            <div className="trip-place-list">

              {places.map((place, index) => {

                const imageUrl =
                  getImageUrl(
                    place?.image_url
                  );

                return (
                  <div
                    className="trip-place-card"
                    key={
                      place?.stop_id ||
                      place?.place_id ||
                      place?.id ||
                      index
                    }
                  >

                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div className="trip-place-image">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            place?.name ||
                            "Tourist Place"
                          }
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="trip-place-no-image">
                          📍
                        </div>
                      )}

                    </div>

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="trip-place-content">

                      <div className="trip-place-number">
                        Stop {index + 1}
                      </div>

                      <h3>
                        {place?.name ||
                          "Tourist Place"}
                      </h3>

                      {place?.location && (
                        <p className="trip-place-location">
                          📍 {place.location}
                        </p>
                      )}

                      {place?.category && (
                        <span className="trip-place-category">
                          {place.category}
                        </span>
                      )}

                      {place?.description && (
                        <p className="trip-place-description">
                          {place.description}
                        </p>
                      )}

                      <div className="trip-place-meta">

                        {place?.visit_date && (
                          <span>
                            📅 {place.visit_date}
                          </span>
                        )}

                        {place?.visit_time && (
                          <span>
                            🕐 {place.visit_time}
                          </span>
                        )}

                        <span>
                          🎟 Rs.{" "}
                          {getNumber(
                            place?.ticket_price
                          ).toLocaleString()}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="trip-no-places">

              <h3>
                No Places Saved
              </h3>

              <p>
                No places were saved in this trip.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default TripDetails;