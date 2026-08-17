import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import { BACKEND_URL } from "../config";

import {
  FaStar,
  FaRegStar,
  FaUser,
  FaComment,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";

function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // PLACE
  // =====================================================

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // REVIEWS
  // =====================================================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // =====================================================
  // REVIEW FORM
  // =====================================================

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // =====================================================
  // LOAD PLACE
  // =====================================================

  useEffect(() => {
    const loadPlace = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/places/${id}`);

        console.log("Place Details:", response.data);

        setPlace(response.data);
      } catch (error) {
        console.error(
          "Place Details Error:",
          error.response?.data || error.message
        );

        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await API.get(
          `/reviews/place/${id}`
        );

        console.log("Place Reviews:", response.data);

        setReviews(response.data || []);
      } catch (error) {
        console.error(
          "Reviews Error:",
          error.response?.data || error.message
        );

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [id]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = async (e) => {
    e.preventDefault();

    console.log("SUBMIT REVIEW CLICKED");

    const token = localStorage.getItem("token");

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!token) {
      console.log("No authentication token found.");
      navigate("/login");
      return;
    }

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!rating) {
      setReviewError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      setReviewError("");
      setReviewSuccess("");

      const reviewPayload = {
        place_id: Number(id),
        rating: Number(rating),
        comment: comment.trim(),
      };

      console.log(
        "Submitting review:",
        reviewPayload
      );

      const response = await API.post(
        "/reviews/",
        reviewPayload
      );

      console.log(
        "Review Created:",
        response.data
      );

      setReviews((currentReviews) => [
        response.data,
        ...currentReviews,
      ]);

      setRating(5);
      setComment("");

      setReviewSuccess(
        "Your review has been submitted successfully!"
      );

      setTimeout(() => {
        setReviewSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Submit Review Error:",
        error
      );

      console.error(
        "Submit Review Response:",
        error.response?.data
      );

      console.error(
        "Submit Review Status:",
        error.response?.status
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        setReviewError(
          "Your session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      const backendMessage =
        error.response?.data?.detail;

      if (typeof backendMessage === "string") {
        setReviewError(backendMessage);
      } else {
        setReviewError(
          "Unable to submit your review. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STAR DISPLAY
  // =====================================================

  const renderStars = (value) => {
    return (
      <div className="place-review-stars">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= Number(value) ? (
            <FaStar key={star} />
          ) : (
            <FaRegStar key={star} />
          )
        )}
      </div>
    );
  };

  // =====================================================
  // AVERAGE RATING
  // =====================================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <h5 className="mt-3">
          Loading place details...
        </h5>
      </div>
    );
  }

  // =====================================================
  // PLACE NOT FOUND
  // =====================================================

  if (!place) {
    return (
      <div className="container mt-5 text-center">
        <h3>
          Place not found
        </h3>

        <Link
          to="/places"
          className="btn btn-primary mt-3"
        >
          Back To Places
        </Link>
      </div>
    );
  }

  // =====================================================
  // IMAGE
  // =====================================================

  const image = place.image_url
    ? place.image_url.startsWith("http")
      ? place.image_url
      : `${BACKEND_URL}${place.image_url}`
    : "https://via.placeholder.com/800x450?text=No+Image";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="place-details-page">
      <div className="container py-5">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/places"
          className="place-back-btn"
        >
          ← Back to Places
        </Link>

        {/* =================================================
            PLACE CARD
        ================================================= */}

        <div className="card border-0 shadow-lg overflow-hidden place-main-card">

          {/* =================================================
              IMAGE
          ================================================= */}

          <img
            src={image}
            className="place-main-image"
            alt={place.name}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x450?text=Image+Not+Found";
            }}
          />

          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="card-body p-4 p-lg-5">

            <div className="place-title-row">

              <div>

                <h1 className="place-title">
                  {place.name}
                </h1>

                <div className="place-location">
                  <FaMapMarkerAlt />

                  <span>
                    {place.location}
                  </span>
                </div>

              </div>

              {place.category && (
                <span className="place-category">
                  {place.category}
                </span>
              )}

            </div>

            <hr />

            {/* =================================================
                ABOUT
            ================================================= */}

            <h3 className="section-title">
              About This Place
            </h3>

            <p className="place-description">
              {place.description}
            </p>

            {/* =================================================
                GOOGLE MAP
            ================================================= */}

            {place.google_maps && (
              <a
                href={place.google_maps}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <FaMapMarkerAlt className="me-2" />
                Open Google Maps
              </a>
            )}

          </div>

        </div>

        {/* =================================================
            REVIEWS SECTION
        ================================================= */}

        <div className="row g-4 mt-4">

          {/* =================================================
              REVIEWS
          ================================================= */}

          <div className="col-lg-7">

            <div className="card border-0 shadow-sm review-card">

              <div className="card-body p-4">

                {/* =================================================
                    REVIEW HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h3 className="fw-bold mb-1">
                      Reviews
                    </h3>

                    <p className="text-muted mb-0">
                      What visitors say about this place
                    </p>

                  </div>

                  <div className="review-average">

                    <strong>
                      {averageRating}
                    </strong>

                    <div>
                      {renderStars(
                        Math.round(
                          Number(averageRating)
                        )
                      )}
                    </div>

                    <small>
                      {reviews.length}{" "}
                      {reviews.length === 1
                        ? "Review"
                        : "Reviews"}
                    </small>

                  </div>

                </div>

                {/* =================================================
                    LOADING REVIEWS
                ================================================= */}

                {reviewsLoading ? (

                  <div className="text-center py-4">

                    <div
                      className="spinner-border spinner-border-sm text-primary"
                    />

                    <p className="text-muted mt-2 mb-0">
                      Loading reviews...
                    </p>

                  </div>

                ) : reviews.length === 0 ? (

                  <div className="empty-reviews">

                    <FaComment />

                    <h5>
                      No Reviews Yet
                    </h5>

                    <p>
                      Be the first visitor to review
                      this place.
                    </p>

                  </div>

                ) : (

                  <div className="reviews-list">

                    {reviews.map((review) => (

                      <div
                        className="review-item"
                        key={review.id}
                      >

                        {/* =================================================
                            REVIEW USER
                        ================================================= */}

                        <div className="review-user">

                          <div className="review-avatar">
                            <FaUser />
                          </div>

                          <div>

                            <h6>
                              {review.user_name ||
                                "Anonymous User"}
                            </h6>

                            <small>
                              <FaCalendarAlt />
                              {" "}
                              {formatDate(
                                review.created_at
                              )}
                            </small>

                          </div>

                        </div>

                        {/* =================================================
                            RATING
                        ================================================= */}

                        {renderStars(
                          review.rating
                        )}

                        {/* =================================================
                            COMMENT
                        ================================================= */}

                        <p className="review-comment">
                          {review.comment}
                        </p>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* =================================================
              WRITE REVIEW
          ================================================= */}

          <div className="col-lg-5">

            <div className="card border-0 shadow-sm review-form-card">

              <div className="card-body p-4">

                <h3 className="fw-bold mb-1">
                  Write a Review
                </h3>

                <p className="text-muted mb-4">
                  Share your experience with other
                  travelers.
                </p>

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {reviewSuccess && (
                  <div className="alert alert-success">
                    {reviewSuccess}
                  </div>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {reviewError && (
                  <div className="alert alert-danger">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={submitReview}>

                  {/* =================================================
                      RATING
                  ================================================= */}

                  <label className="form-label fw-semibold">
                    Your Rating
                  </label>

                  <div className="rating-selector mb-4">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          className="rating-star-btn"
                          onClick={() =>
                            setRating(star)
                          }
                        >

                          {star <= rating ? (
                            <FaStar />
                          ) : (
                            <FaRegStar />
                          )}

                        </button>

                      )
                    )}

                  </div>

                  <div className="selected-rating">
                    {rating} out of 5
                  </div>

                  {/* =================================================
                      COMMENT
                  ================================================= */}

                  <label className="form-label fw-semibold mt-3">
                    Your Comment
                  </label>

                  <textarea
                    className="form-control review-textarea"
                    rows="5"
                    placeholder="Tell other travelers about your experience..."
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    disabled={submitting}
                  />

                  {/* =================================================
                      SUBMIT
                  ================================================= */}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3 review-submit-btn"
                    disabled={submitting}
                  >

                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Submit Review
                      </>
                    )}

                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PAGE STYLES
      ===================================================== */}

      <style>
        {`

          .place-details-page {
            background: #f6f8fc;
            min-height: 100vh;
          }

          .place-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 20px;
            color: #0d6efd;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
          }

          .place-back-btn:hover {
            color: #084298;
          }

          .place-main-card {
            border-radius: 18px;
          }

          .place-main-image {
            width: 100%;
            height: 450px;
            object-fit: cover;
            display: block;
          }

          .place-title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }

          .place-title {
            font-size: 34px;
            font-weight: 800;
            color: #172033;
            margin-bottom: 10px;
          }

          .place-location {
            display: flex;
            align-items: center;
            gap: 7px;
            color: #667085;
            font-size: 14px;
          }

          .place-location svg {
            color: #0d6efd;
          }

          .place-category {
            background: #edf4ff;
            color: #0d6efd;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }

          .section-title {
            color: #172033;
            font-weight: 750;
            margin-bottom: 12px;
          }

          .place-description {
            color: #667085;
            line-height: 1.8;
            font-size: 15px;
            margin-bottom: 24px;
          }

          .review-card,
          .review-form-card {
            border-radius: 16px;
          }

          .review-average {
            text-align: right;
          }

          .review-average strong {
            display: block;
            font-size: 28px;
            line-height: 1;
            color: #172033;
          }

          .review-average small {
            color: #98a2b3;
            font-size: 11px;
          }

          .place-review-stars {
            display: flex;
            gap: 3px;
            color: #f59e0b;
            font-size: 14px;
            margin-top: 5px;
          }

          .reviews-list {
            display: flex;
            flex-direction: column;
          }

          .review-item {
            padding: 20px 0;
            border-top: 1px solid #eef1f5;
          }

          .review-user {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-bottom: 8px;
          }

          .review-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #edf4ff;
            color: #0d6efd;
            font-size: 14px;
          }

          .review-user h6 {
            margin: 0;
            color: #172033;
            font-weight: 700;
          }

          .review-user small {
            color: #98a2b3;
            font-size: 11px;
          }

          .review-user small svg {
            font-size: 9px;
            margin-right: 3px;
          }

          .review-comment {
            color: #596579;
            font-size: 14px;
            line-height: 1.7;
            margin: 10px 0 0 51px;
          }

          .empty-reviews {
            text-align: center;
            padding: 45px 20px;
            color: #98a2b3;
          }

          .empty-reviews svg {
            font-size: 35px;
            margin-bottom: 12px;
            color: #cbd5e1;
          }

          .empty-reviews h5 {
            color: #475569;
            font-weight: 700;
          }

          .empty-reviews p {
            margin-bottom: 0;
          }

          .rating-selector {
            display: flex;
            gap: 8px;
          }

          .rating-star-btn {
            border: 0;
            background: transparent;
            padding: 0;
            color: #f59e0b;
            font-size: 28px;
            cursor: pointer;
            transition: transform 0.15s ease;
          }

          .rating-star-btn:hover {
            transform: scale(1.15);
          }

          .selected-rating {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 7px;
            background: #fff7e6;
            color: #b45309;
            font-size: 12px;
            font-weight: 700;
          }

          .review-textarea {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            resize: vertical;
            font-size: 14px;
          }

          .review-textarea:focus {
            border-color: #86b7fe;
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.08);
          }

          .review-submit-btn {
            padding: 11px;
            border-radius: 10px;
            font-weight: 700;
          }

          @media (max-width: 768px) {

            .place-main-image {
              height: 300px;
            }

            .place-title {
              font-size: 27px;
            }

            .place-title-row {
              flex-direction: column;
            }

            .review-average {
              text-align: left;
              margin-top: 10px;
            }

          }

        `}
      </style>

    </div>
  );
}

export default PlaceDetails;