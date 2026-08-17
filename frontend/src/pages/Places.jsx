import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { BACKEND_URL } from "../config";

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PLACES
  // =====================================================

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/places/");

        console.log("Places API Response:", response.data);

        // -------------------------------------------------
        // HANDLE DIFFERENT RESPONSE FORMATS
        // -------------------------------------------------

        let receivedPlaces = [];

        if (Array.isArray(response.data)) {
          receivedPlaces = response.data;
        } else if (Array.isArray(response.data?.places)) {
          receivedPlaces = response.data.places;
        } else if (Array.isArray(response.data?.data)) {
          receivedPlaces = response.data.data;
        } else if (Array.isArray(response.data?.items)) {
          receivedPlaces = response.data.items;
        }

        console.log("Processed Places:", receivedPlaces);

        setPlaces(receivedPlaces);
      } catch (error) {
        console.error(
          "Places Error:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            error.response?.data?.detail ||
              error.response?.data?.message ||
              "Unable to load places."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

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
    // ALREADY FULL URL
    // -------------------------------------------------

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // -------------------------------------------------
    // BACKEND STATIC PATH
    // Example:
    // /static/images/noor-mahal.jpg
    // -------------------------------------------------

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    // -------------------------------------------------
    // RELATIVE PATH
    // -------------------------------------------------

    return `${BACKEND_URL}/${image}`;
  };

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addWishlist = async (placeId) => {
    const token = localStorage.getItem("token");

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!token) {
      alert("Please login first ❤️");
      return;
    }

    try {
      await API.post(
        "/favorites/",
        {
          place_id: placeId,
        }
      );

      alert("Added to Wishlist ❤️");
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        alert(
          "Your session has expired. Please login again."
        );

        return;
      }

      alert(
        error.response?.data?.detail ||
          "Already added or an error occurred."
      );
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

        <h5 className="mt-3">
          Loading places...
        </h5>

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

          <h5 className="fw-bold">
            Unable to Load Places
          </h5>

          <p className="mb-0">
            {error}
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (places.length === 0) {
    return (
      <div className="container py-5 text-center">

        <div
          className="card border-0 shadow-sm"
        >
          <div className="card-body py-5">

            <div
              style={{
                fontSize: "55px",
              }}
            >
              🏝️
            </div>

            <h3 className="fw-bold mt-3">
              No Places Available
            </h3>

            <p className="text-muted mb-0">
              There are currently no tourist places
              available.
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
    <div className="container py-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-5">

        <h2 className="fw-bold">
          🏝️ Explore Places
        </h2>

        <p className="text-muted mb-0">
          Discover beautiful destinations and
          attractions.
        </p>

      </div>

      {/* =================================================
          PLACES GRID
      ================================================= */}

      <div className="row g-4">

        {places.map((place) => {

          const imageUrl =
            getImageUrl(place);

          return (
            <div
              className="col-md-6 col-lg-4"
              key={place.id}
            >

              <div
                className="card border-0 shadow-sm h-100 overflow-hidden"
              >

                {/* =========================================
                    IMAGE
                ========================================= */}

                {imageUrl ? (

                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={place.name || "Tourist Place"}
                    style={{
                      height: "220px",
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {

                      console.error(
                        "Place image failed:",
                        imageUrl
                      );

                      e.currentTarget.onerror = null;

                      e.currentTarget.src =
                        "https://via.placeholder.com/400x220?text=Image+Not+Found";
                    }}
                  />

                ) : (

                  <div
                    style={{
                      height: "220px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                      color: "#0369a1",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    🏝️ No Image Available
                  </div>

                )}

                {/* =========================================
                    CARD BODY
                ========================================= */}

                <div className="card-body d-flex flex-column p-4">

                  {/* =======================================
                      CATEGORY
                  ======================================= */}

                  {place.category && (
                    <span
                      className="badge bg-primary align-self-start mb-2"
                    >
                      {place.category}
                    </span>
                  )}

                  {/* =======================================
                      NAME
                  ======================================= */}

                  <h4 className="fw-bold mb-2">
                    {place.name || "Tourist Place"}
                  </h4>

                  {/* =======================================
                      LOCATION
                  ======================================= */}

                  {place.location && (
                    <p className="text-muted mb-2">
                      📍 {place.location}
                    </p>
                  )}

                  {/* =======================================
                      DESCRIPTION
                  ======================================= */}

                  <p
                    className="text-muted"
                    style={{
                      lineHeight: "1.6",
                    }}
                  >
                    {place.description ||
                      "Discover this beautiful destination."}
                  </p>

                  {/* =======================================
                      ACTIONS
                  ======================================= */}

                  <div
                    className="mt-auto pt-3 d-flex flex-wrap gap-2"
                  >

                    {/* VIEW DETAILS */}

                    <Link
                      to={`/places/${place.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>

                    {/* WISHLIST */}

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() =>
                        addWishlist(place.id)
                      }
                    >
                      ❤️ Wishlist
                    </button>

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Places;