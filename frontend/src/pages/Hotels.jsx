
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getHotels } from "../services/hotelService";

const BACKEND_URL = "http://127.0.0.1:8000";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);

      const response = await getHotels();

      console.log("Hotels API Response:", response);

      setHotels(response);
      setError("");
    } catch (err) {
      console.error(
        "Hotel API Error:",
        err.response?.data || err.message
      );

      setError("Unable to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Hotel Image
  // =========================

  const getHotelImage = (hotel) => {
    if (!hotel.image_url) {
      return null;
    }

    // Backend already returned a full URL
    if (
      hotel.image_url.startsWith("http://") ||
      hotel.image_url.startsWith("https://")
    ) {
      return hotel.image_url;
    }

    // Backend returned only the filename
    return `${BACKEND_URL}/static/hotels/${hotel.image_url}`;
  };

  // =========================
  // Search
  // =========================

  const filteredHotels = hotels.filter((hotel) => {
    const searchText = search.toLowerCase();

    return (
      hotel.name?.toLowerCase().includes(searchText) ||
      hotel.location?.toLowerCase().includes(searchText) ||
      hotel.category?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading hotels...
        </p>

      </div>
    );
  }

  // =========================
  // Page
  // =========================

  return (
    <div className="container py-5">

      {/* Header */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          🏨 Hotels
        </h1>

        <p className="text-muted">
          Find the perfect place to stay in Bahawalpur
        </p>

      </div>


      {/* Search */}

      <div className="mb-4">

        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* Error */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {/* No Hotels */}

      {!error && filteredHotels.length === 0 && (
        <div className="text-center py-5">

          <h4>
            No hotels found
          </h4>

          <p className="text-muted">
            No hotels match your search.
          </p>

        </div>
      )}


      {/* Hotel Cards */}

      <div className="row g-4">

        {filteredHotels.map((hotel) => {

          const image = getHotelImage(hotel);

          console.log(
            "Hotel:",
            hotel.name,
            "Image:",
            image
          );

          return (
            <div
              className="col-lg-4 col-md-6"
              key={hotel.id}
            >

              <div className="card h-100 shadow-sm border-0">


                {/* Image */}

                {image ? (

                  <img
                    src={image}
                    alt={hotel.name}
                    className="card-img-top"
                    style={{
                      height: "230px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      console.error(
                        "Image failed:",
                        image
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{
                      height: "230px"
                    }}
                  >

                    <span className="text-muted">
                      No image available
                    </span>

                  </div>

                )}


                {/* Card Body */}

                <div className="card-body d-flex flex-column">

                  <h4 className="fw-bold">
                    {hotel.name}
                  </h4>


                  <p className="text-muted mb-2">
                    📍 {hotel.location}
                  </p>


                  {hotel.category && (
                    <span className="badge bg-primary align-self-start mb-3">
                      {hotel.category}
                    </span>
                  )}


                  {hotel.rating !== null &&
                    hotel.rating !== undefined && (

                    <p className="mb-2">
                      ⭐ {hotel.rating} / 5
                    </p>

                  )}


                  {hotel.price_per_night !== null &&
                    hotel.price_per_night !== undefined && (

                    <p className="fw-bold text-primary">
                      PKR {hotel.price_per_night} / night
                    </p>

                  )}


                  <p className="text-muted">

                    {hotel.description
                      ? hotel.description.length > 120
                        ? hotel.description.substring(0, 120) + "..."
                        : hotel.description
                      : "Comfortable accommodation for your trip."}

                  </p>


                  {/* Details */}

                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="btn btn-primary mt-auto"
                  >
                    View Hotel
                  </Link>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Hotels;

