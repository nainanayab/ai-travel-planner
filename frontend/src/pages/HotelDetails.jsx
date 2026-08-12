
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api";

const BACKEND_URL = "http://127.0.0.1:8000";

function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD HOTEL
  // ==========================================

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/hotels/${id}`);

        console.log("Hotel Details:", response.data);

        setHotel(response.data);
      } catch (err) {
        console.error(
          "Hotel Details Error:",
          err.response?.data || err.message
        );

        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [id]);


  // ==========================================
  // HOTEL IMAGE
  // ==========================================

  const getHotelImage = () => {
    if (!hotel?.image_url) {
      return null;
    }

    if (
      hotel.image_url.startsWith("http://") ||
      hotel.image_url.startsWith("https://")
    ) {
      return hotel.image_url;
    }

    return `${BACKEND_URL}/static/hotels/${hotel.image_url}`;
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading hotel details...
        </p>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger text-center">
          {error}
        </div>

        <div className="text-center">

          <Link
            to="/hotels"
            className="btn btn-primary"
          >
            ← Back to Hotels
          </Link>

        </div>

      </div>
    );
  }


  // ==========================================
  // HOTEL NOT FOUND
  // ==========================================

  if (!hotel) {
    return (
      <div className="container py-5 text-center">

        <h3>
          Hotel not found
        </h3>

        <Link
          to="/hotels"
          className="btn btn-primary mt-3"
        >
          ← Back to Hotels
        </Link>

      </div>
    );
  }


  const image = getHotelImage();


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="container py-5">

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <div className="mb-4">

        <Link
          to="/hotels"
          className="btn btn-outline-primary"
        >
          ← Back to Hotels
        </Link>

      </div>


      {/* ======================================
          HOTEL CARD
      ====================================== */}

      <div className="card shadow border-0 overflow-hidden">


        {/* ====================================
            HOTEL IMAGE
        ==================================== */}

        {image ? (

          <img
            src={image}
            alt={hotel.name}
            className="w-100"
            style={{
              height: "450px",
              objectFit: "cover"
            }}
            onError={(e) => {
              console.error(
                "Hotel image failed:",
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
              height: "450px"
            }}
          >

            <h5 className="text-muted">
              No image available
            </h5>

          </div>

        )}


        {/* ====================================
            HOTEL INFORMATION
        ==================================== */}

        <div className="card-body p-4 p-md-5">


          {/* Hotel Name */}

          <h1 className="fw-bold mb-3">
            {hotel.name}
          </h1>


          {/* Location */}

          {hotel.location && (
            <p className="fs-5 text-muted">
              📍 {hotel.location}
            </p>
          )}


          {/* Address */}

          {hotel.address && (
            <p className="text-muted">
              🏠 {hotel.address}
            </p>
          )}


          {/* Category */}

          {hotel.category && (
            <span className="badge bg-primary mb-4">
              {hotel.category}
            </span>
          )}


          {/* ==================================
              RATING & PRICE
          ================================== */}

          <div className="row mb-4">


            {/* Rating */}

            {hotel.rating !== null &&
              hotel.rating !== undefined && (

                <div className="col-md-4 mb-3">

                  <div className="border rounded p-3 h-100">

                    <h6 className="text-muted">
                      Rating
                    </h6>

                    <h4 className="mb-0">
                      ⭐ {hotel.rating} / 5
                    </h4>

                  </div>

                </div>
              )}


            {/* Price */}

            {hotel.price_per_night !== null &&
              hotel.price_per_night !== undefined && (

                <div className="col-md-4 mb-3">

                  <div className="border rounded p-3 h-100">

                    <h6 className="text-muted">
                      Price
                    </h6>

                    <h4 className="text-primary mb-0">
                      PKR {hotel.price_per_night}
                    </h4>

                    <small className="text-muted">
                      per night
                    </small>

                  </div>

                </div>
              )}

          </div>


          {/* ==================================
              DESCRIPTION
          ================================== */}

          <div className="mb-4">

            <h4 className="fw-bold">
              About This Hotel
            </h4>

            <p className="text-muted fs-5">
              {hotel.description ||
                "Comfortable accommodation for your trip."}
            </p>

          </div>


          {/* ==================================
              CONTACT
          ================================== */}

          {(hotel.phone || hotel.email) && (

            <div className="mb-4">

              <h4 className="fw-bold">
                Contact
              </h4>

              {hotel.phone && (
                <p className="mb-2">
                  📞 {hotel.phone}
                </p>
              )}

              {hotel.email && (
                <p className="mb-2">
                  📧 {hotel.email}
                </p>
              )}

            </div>

          )}


          {/* ==================================
              BOOKING BUTTONS
          ================================== */}

          <div className="d-flex gap-3 flex-wrap">


            {/* HOTEL BOOKING */}

            <Link
              to={`/hotel-booking/${hotel.id}`}
              className="btn btn-primary btn-lg"
            >
              🏨 Book Hotel
            </Link>


            {/* BACK TO HOTELS */}

            <Link
              to="/hotels"
              className="btn btn-outline-secondary btn-lg"
            >
              Browse Hotels
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HotelDetails;
