import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";

const slides = [
  {
    image: `${BACKEND_URL}/static/images/noor-mahal.jpg`,
    title: "Discover Bahawalpur",
    subtitle: "Explore Beautiful Places",
    description:
      "Discover the beauty, history, and culture of Bahawalpur with amazing places to visit.",
  },

  {
    image: `${BACKEND_URL}/static/images/lahore-fort.jpg`,
    title: "Explore Bahawalpur",
    subtitle: "History & Heritage",
    description:
      "Explore historical landmarks, royal architecture, and the rich heritage of Bahawalpur.",
  },

  {
    image: `${BACKEND_URL}/static/images/multan-fort.jpg`,
    title: "Experience Culture & History",
    subtitle: "Discover Bahawalpur's Heritage",
    description:
      "Visit beautiful historical places and experience the culture and traditions of Bahawalpur.",
  },

  {
    image: `${BACKEND_URL}/static/images/double-decker.jpg`,
    title: "Travel Around Bahawalpur",
    subtitle: "Explore the City by Double-Decker Bus",
    description:
      "Enjoy convenient city transportation and explore Bahawalpur's beautiful places with the Double-Decker Bus.",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* =====================================================
     AUTOMATIC SLIDESHOW
  ===================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     NEXT SLIDE
  ===================================================== */

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  /* =====================================================
     PREVIOUS SLIDE
  ===================================================== */

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[currentSlide];

  return (
    <section className="hero-section">

      {/* =================================================
          BACKGROUND IMAGE
      ================================================= */}

      <img
        src={slide.image}
        alt={slide.title}
        className="hero-background-image"
      />

      {/* =================================================
          DARK OVERLAY
      ================================================= */}

      <div className="hero-overlay"></div>

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className="container hero-content">

        <div className="row align-items-center">

          <div className="col-lg-9 text-center text-lg-start">

            {/* =================================================
                TITLE
            ================================================= */}

            <h1 className="display-3 fw-bold mb-3">
              {slide.title}
            </h1>

            {/* =================================================
                SUBTITLE
            ================================================= */}

            <h2 className="fw-semibold mb-4">
              {slide.subtitle}
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="lead mb-4 hero-description">
              {slide.description}
            </p>

            {/* =================================================
                TRIP PLANNER OPTIONS
            ================================================= */}

            <div className="hero-planner">

              <p className="hero-planner-title">
                Plan Your Journey
              </p>

              <div className="hero-planner-buttons">

                {/* INSIDE CITY */}

                <Link
                  to="/trip-planner"
                  className="hero-planner-btn"
                >
                  <span className="planner-btn-icon">
                    🗺️
                  </span>

                  <span className="planner-btn-content">
                    <strong>
                      Inside City
                    </strong>

                    <small>
                      Explore places within a city
                    </small>
                  </span>

                  <span className="planner-arrow">
                    →
                  </span>
                </Link>

                {/* CITY TO CITY */}

                <Link
                  to="/budget-trip"
                  className="hero-planner-btn"
                >
                  <span className="planner-btn-icon">
                    🚗
                  </span>

                  <span className="planner-btn-content">
                    <strong>
                      City to City
                    </strong>

                    <small>
                      Plan your journey between cities
                    </small>
                  </span>

                  <span className="planner-arrow">
                    →
                  </span>
                </Link>

              </div>

            </div>

            {/* =================================================
                EXPLORE PLACES
            ================================================= */}

            <div className="hero-explore-button">

              <Link
                to="/places"
                className="btn btn-light btn-lg px-4"
              >
                Explore Places
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          PREVIOUS SLIDE
      ================================================= */}

      <button
        type="button"
        className="hero-arrow hero-arrow-left"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        ❮
      </button>

      {/* =================================================
          NEXT SLIDE
      ================================================= */}

      <button
        type="button"
        className="hero-arrow hero-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* =================================================
          SLIDE DOTS
      ================================================= */}

      <div className="hero-dots">

        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-dot ${
              currentSlide === index ? "active" : ""
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}

      </div>

    </section>
  );
}

export default Hero;