import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { BACKEND_URL } from "../config";

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD PLACES
  // =====================================================

  useEffect(() => {
    API.get("/places/")
      .then((response) => {
        console.log("Places:", response.data);
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error(
          "Places Error:",
          error.response?.data || error.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addWishlist = async (placeId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first ❤️");
      return;
    }

    try {
      await API.post(
        "/favorites/",
        {
          place_id: placeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to Wishlist ❤️");
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error.response?.data || error.message
      );

      alert("Already added or error occurred");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <h3 className="text-center mt-5">
        Loading places...
      </h3>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container mt-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <h2 className="text-center mb-4">
        🏝️ Explore Places
      </h2>

      {/* =================================================
          PLACES GRID
      ================================================= */}

      <div className="row">

        {places.map((place) => {
          const imageUrl = place.image_url
            ? place.image_url.startsWith("http")
              ? place.image_url
              : `${BACKEND_URL}${place.image_url}`
            : null;

          return (
            <div
              className="col-md-4 mb-4"
              key={place.id}
            >

              <div className="card shadow h-100">

                {/* =================================================
                    IMAGE
                ================================================= */}

                {imageUrl && (
                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={place.name}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error(
                        "Place image failed:",
                        imageUrl
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}

                {/* =================================================
                    CARD BODY
                ================================================= */}

                <div className="card-body">

                  <h4>
                    {place.name}
                  </h4>

                  <p>
                    📍 {place.location}
                  </p>

                  <p>
                    {place.description}
                  </p>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <Link
                    to={`/places/${place.id}`}
                    className="btn btn-primary me-2"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      addWishlist(place.id)
                    }
                  >
                    ❤️ Wishlist
                  </button>

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