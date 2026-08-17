import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Backend already returned a full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend returned a path such as:
    // /static/images/noor-mahal.jpg
    if (image.startsWith("/")) {
      return `${API.defaults.baseURL}${image}`;
    }

    // Backend returned a relative path
    return `${API.defaults.baseURL}/${image}`;
  };

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await API.get("/favorites/");

      console.log("Wishlist Data:", response.data);

      setWishlist(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error.response?.data || error.message
      );

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeWishlist = async (favoriteId) => {
    try {
      await API.delete(
        `/favorites/${favoriteId}`
      );

      alert("Removed from Wishlist ❌");

      // Refresh wishlist
      await fetchWishlist();
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Unable to remove from Wishlist."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <h5 className="mt-3">
          Loading wishlist...
        </h5>
      </div>
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
        ❤️ My Wishlist
      </h2>

      {/* =================================================
          EMPTY WISHLIST
      ================================================= */}

      {wishlist.length === 0 ? (
        <div className="text-center py-5">

          <h4>
            No favorite places yet.
          </h4>

          <p className="text-muted">
            Explore places and add your
            favorite destinations to your wishlist.
          </p>

          <Link
            to="/places"
            className="btn btn-primary mt-2"
          >
            Explore Places
          </Link>

        </div>
      ) : (

        /* =================================================
           WISHLIST CARDS
        ================================================= */

        <div className="row">

          {wishlist.map((item) => {

            const place = item.place;

            const imageUrl = getImageUrl(
              place?.image_url
            );

            return (
              <div
                className="col-md-4 mb-4"
                key={item.id}
              >

                <div className="card shadow h-100">

                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt={
                        place?.name ||
                        "Tourist Place"
                      }
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;

                        e.currentTarget.src =
                          "https://via.placeholder.com/400x220?text=No+Image";
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-light"
                      style={{
                        height: "220px",
                      }}
                    >
                      <span className="text-muted">
                        No image available
                      </span>
                    </div>
                  )}

                  {/* =====================================
                      CARD BODY
                  ===================================== */}

                  <div className="card-body d-flex flex-column">

                    <h4>
                      {place?.name ||
                        "Unknown Place"}
                    </h4>

                    {place?.location && (
                      <p>
                        📍 {place.location}
                      </p>
                    )}

                    <p className="text-muted">
                      {place?.description ||
                        "No description available."}
                    </p>

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="mt-auto">

                      <Link
                        to={`/places/${place?.id}`}
                        className="btn btn-primary me-2"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          removeWishlist(item.id)
                        }
                      >
                        ❌ Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Wishlist;
