
import { Link } from "react-router-dom";

import {
  FaMapMarkedAlt,
  FaHotel,
  FaBus,
  FaRobot,
  FaHeart,
  FaUser,
  FaTicketAlt,
  FaCalendarCheck,
} from "react-icons/fa";

import Hero from "../components/Hero";

function Home() {
  return (
    <>
      {/* =================================================
          HERO
      ================================================= */}

      <Hero />


      {/* =================================================
          QUICK ACCESS ICON BAR
      ================================================= */}

      <section className="py-4 bg-light">

        <div className="container">

          <div className="row g-3 justify-content-center">

            {/* PLACES */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/places"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaMapMarkedAlt
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Places
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* HOTELS */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/hotels"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaHotel
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Hotels
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* TRANSPORT */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/transport"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaBus
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Transport
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* BOOKING */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/booking"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaTicketAlt
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Booking
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* MY BOOKINGS */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/my-bookings"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaCalendarCheck
                      size={32}
                      className="text-success mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      My Bookings
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* AI CHAT */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/chat"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaRobot
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      AI Chat
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* WISHLIST */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/wishlist"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaHeart
                      size={32}
                      className="text-danger mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Wishlist
                    </h6>

                  </div>
                </div>
              </Link>
            </div>


            {/* PROFILE */}

            <div className="col-6 col-md-4 col-lg-2">
              <Link
                to="/profile"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm h-100 text-center">
                  <div className="card-body py-4">

                    <FaUser
                      size={32}
                      className="text-primary mb-2"
                    />

                    <h6 className="fw-bold mb-0">
                      Profile
                    </h6>

                  </div>
                </div>
              </Link>
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          WELCOME SECTION
      ================================================= */}

      <section className="py-5">

        <div className="container text-center">

          <h2 className="fw-bold mb-3">
            Welcome to AI Tourism Platform
          </h2>

          <p className="lead text-muted">
            Discover amazing destinations,
            explore historical places,
            plan your journey, and get
            AI-powered travel assistance.
          </p>

        </div>

      </section>

    </>
  );
}

export default Home;

