import { Link } from "react-router-dom";

import {
  FaMapMarkedAlt,
  FaHotel,
  FaCalendarCheck,
  FaRobot,
  FaCheckCircle,
  FaArrowRight,
  FaHeart,
  FaBus,
} from "react-icons/fa";

import Hero from "../components/Hero";

function Home() {
  return (
    <>
      {/* =================================================
          HERO SLIDESHOW
      ================================================= */}

      <Hero />


      {/* =================================================
          WHY CHOOSE US
      ================================================= */}

      <section className="why-choose-section py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="section-title">
              Why Choose Us?
            </h2>

            <p className="section-subtitle">
              Everything you need for a smarter and easier journey
            </p>

          </div>


          <div className="row g-4">

            {/* =================================================
                VERIFIED PLACES
            ================================================= */}

            <div className="col-md-6 col-lg-3">

              <div className="benefit-card">

                <FaCheckCircle className="benefit-icon" />

                <h5>
                  Verified Places
                </h5>

                <p>
                  Discover carefully selected tourist destinations
                  and historical places.
                </p>

              </div>

            </div>


            {/* =================================================
                AI PLANNING
            ================================================= */}

            <div className="col-md-6 col-lg-3">

              <div className="benefit-card">

                <FaRobot className="benefit-icon" />

                <h5>
                  AI Powered Planning
                </h5>

                <p>
                  Get smart trip suggestions and personalized
                  travel plans with AI.
                </p>

              </div>

            </div>


            {/* =================================================
                EASY BOOKING
            ================================================= */}

            <div className="col-md-6 col-lg-3">

              <div className="benefit-card">

                <FaCalendarCheck className="benefit-icon" />

                <h5>
                  Easy Booking
                </h5>

                <p>
                  Manage your tourism bookings easily from one
                  convenient platform.
                </p>

              </div>

            </div>


            {/* =================================================
                FAVORITES
            ================================================= */}

            <div className="col-md-6 col-lg-3">

              <div className="benefit-card">

                <FaHeart className="benefit-icon" />

                <h5>
                  Save Favorites
                </h5>

                <p>
                  Keep your favorite destinations saved and
                  access them anytime.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          OUR SERVICES
      ================================================= */}

      <section className="services-section py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="section-title">
              Our Services
            </h2>

            <p className="section-subtitle">
              Explore, plan and manage your journey with ease
            </p>

          </div>


          <div className="row g-4 justify-content-center">


            {/* =================================================
                PLACES
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="service-card">

                <div className="service-icon">
                  <FaMapMarkedAlt />
                </div>

                <h4>
                  Places
                </h4>

                <p>
                  Explore beautiful historical and tourist
                  destinations.
                </p>

                <Link
                  to="/places"
                  className="service-btn"
                >
                  Explore Places <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* =================================================
                HOTELS
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="service-card">

                <div className="service-icon">
                  <FaHotel />
                </div>

                <h4>
                  Hotels
                </h4>

                <p>
                  Find suitable hotels for a comfortable stay
                  during your journey.
                </p>

                <Link
                  to="/hotels"
                  className="service-btn"
                >
                  Find Hotels <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* =================================================
                TRANSPORT
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="service-card">

                <div className="service-icon">
                  <FaBus />
                </div>

                <h4>
                  Transport
                </h4>

                <p>
                  Find convenient transport options and plan
                  your journey comfortably.
                </p>

                <Link
                  to="/transport"
                  className="service-btn"
                >
                  Find Transport <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* =================================================
                BOOKINGS
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="service-card">

                <div className="service-icon">
                  <FaCalendarCheck />
                </div>

                <h4>
                  Bookings
                </h4>

                <p>
                  Book your selected tourist places and manage
                  your travel bookings.
                </p>

                <Link
                  to="/booking"
                  className="service-btn"
                >
                  Book Now <FaArrowRight />
                </Link>

              </div>

            </div>


            {/* =================================================
                AI TRIP PLANNER
            ================================================= */}

            <div className="col-md-6 col-lg-4">

              <div className="service-card">

                <div className="service-icon">
                  <FaRobot />
                </div>

                <h4>
                  AI Trip Planner
                </h4>

                <p>
                  Create a smart personalized trip plan according
                  to your needs.
                </p>

                <Link
                  to="/budget-trip"
                  className="service-btn"
                >
                  Plan Trip <FaArrowRight />
                </Link>

              </div>

            </div>


          </div>

        </div>

      </section>

    </>
  );
}

export default Home;