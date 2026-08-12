
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaHotel,
  FaCalendarCheck,
  FaBus,
  FaHome,
  FaRobot,
  FaMapMarkedAlt,
  FaChevronDown,
} from "react-icons/fa";

import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // TOKEN CHECK
  // =====================================================

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener(
        "storage",
        checkToken
      );
    };
  }, []);

  // =====================================================
  // CLOSE USER MENU WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMenuOpen(false);
    navigate("/login");
  };

  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="ai-navbar">

        <div className="ai-navbar-container">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="ai-logo"
          >

            <div className="ai-logo-icon">
              <FaMapMarkedAlt />
            </div>

            <div className="ai-logo-text">

              <span className="ai-logo-title">
                AI Tourism
              </span>

              <span className="ai-logo-subtitle">
                Explore • Discover • Travel
              </span>

            </div>

          </Link>


          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <div className="ai-main-nav">

            <Link
              to="/"
              className={`ai-nav-link ${
                isActive("/")
                  ? "ai-nav-active"
                  : ""
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>


            <Link
              to="/places"
              className={`ai-nav-link ${
                isActive("/places")
                  ? "ai-nav-active"
                  : ""
              }`}
            >
              <FaMapMarkedAlt />
              <span>Explore</span>
            </Link>


            <Link
              to="/hotels"
              className={`ai-nav-link ${
                isActive("/hotels")
                  ? "ai-nav-active"
                  : ""
              }`}
            >
              <FaHotel />
              <span>Hotels</span>
            </Link>


            <Link
              to="/transport"
              className={`ai-nav-link ${
                isActive("/transport")
                  ? "ai-nav-active"
                  : ""
              }`}
            >
              <FaBus />
              <span>Transport</span>
            </Link>


            <Link
              to="/chat"
              className={`ai-nav-link ai-ai-link ${
                isActive("/chat")
                  ? "ai-nav-active"
                  : ""
              }`}
            >
              <FaRobot />
              <span>AI Guide</span>
            </Link>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="ai-navbar-right">

            {token ? (
              <>

                {/* =================================================
                    QUICK BOOKING
                ================================================= */}

                <Link
                  to="/booking"
                  className="ai-book-btn"
                >
                  <FaCalendarCheck />
                  <span>Book a Visit</span>
                </Link>


                {/* =================================================
                    USER MENU
                ================================================= */}

                <div className="ai-user-wrapper">

                  <button
                    type="button"
                    className="ai-user-button"
                    onClick={() =>
                      setMenuOpen(
                        !menuOpen
                      )
                    }
                  >

                    <div className="ai-user-avatar">
                      <FaUser />
                    </div>

                    <span className="ai-user-label">
                      My Account
                    </span>

                    <FaChevronDown
                      className={`ai-chevron ${
                        menuOpen
                          ? "ai-chevron-open"
                          : ""
                      }`}
                    />

                  </button>


                  {/* =================================================
                      DROPDOWN
                  ================================================= */}

                  {menuOpen && (

                    <div className="ai-user-dropdown">

                      <div className="ai-dropdown-header">

                        <div className="ai-dropdown-avatar">
                          <FaUser />
                        </div>

                        <div>
                          <strong>
                            My Account
                          </strong>

                          <small>
                            Travel Dashboard
                          </small>
                        </div>

                      </div>


                      <div className="ai-dropdown-divider" />


                      <Link
                        to="/profile"
                        className="ai-dropdown-item"
                      >
                        <FaUser />
                        <span>Profile</span>
                      </Link>


                      <Link
                        to="/wishlist"
                        className="ai-dropdown-item"
                      >
                        <FaHeart />
                        <span>Wishlist</span>
                      </Link>


                      <Link
                        to="/my-bookings"
                        className="ai-dropdown-item"
                      >
                        <FaCalendarCheck />
                        <span>My Bookings</span>
                      </Link>


                      <Link
                        to="/my-transport-bookings"
                        className="ai-dropdown-item"
                      >
                        <FaBus />
                        <span>
                          My Transport Bookings
                        </span>
                      </Link>


                      <div className="ai-dropdown-divider" />


                      <button
                        type="button"
                        className="ai-dropdown-logout"
                        onClick={logout}
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>

                    </div>

                  )}

                </div>

              </>
            ) : (
              <>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Link
                  to="/login"
                  className="ai-login-btn"
                >
                  Login
                </Link>


                {/* =================================================
                    REGISTER
                ================================================= */}

                <Link
                  to="/register"
                  className="ai-register-btn"
                >
                  Get Started
                </Link>

              </>
            )}

          </div>

        </div>

      </nav>


      {/* =================================================
          NAVBAR STYLES
      ================================================= */}

      <style>
        {`

          /* =================================================
             NAVBAR
          ================================================= */

          .ai-navbar {
            position: sticky;
            top: 0;
            z-index: 1050;

            width: 100%;

            background:
              rgba(255, 255, 255, 0.94);

            backdrop-filter:
              blur(18px);

            -webkit-backdrop-filter:
              blur(18px);

            border-bottom:
              1px solid rgba(13, 110, 253, 0.08);

            box-shadow:
              0 4px 24px rgba(15, 23, 42, 0.06);
          }


          /* =================================================
             CONTAINER
          ================================================= */

          .ai-navbar-container {
            width: 100%;
            max-width: 1450px;

            margin: 0 auto;

            padding:
              12px 28px;

            display: flex;

            align-items: center;

            justify-content:
              space-between;

            gap: 25px;
          }


          /* =================================================
             LOGO
          ================================================= */

          .ai-logo {
            display: flex;

            align-items: center;

            gap: 11px;

            text-decoration: none;

            min-width: 210px;
          }


          .ai-logo-icon {
            width: 44px;
            height: 44px;

            border-radius: 13px;

            display: flex;

            align-items: center;
            justify-content: center;

            color: white;

            font-size: 20px;

            background:
              linear-gradient(
                135deg,
                #0d6efd,
                #4f46e5
              );

            box-shadow:
              0 7px 18px
              rgba(13, 110, 253, 0.24);
          }


          .ai-logo-text {
            display: flex;

            flex-direction: column;

            line-height: 1.1;
          }


          .ai-logo-title {
            color: #172033;

            font-size: 18px;

            font-weight: 800;

            letter-spacing: -0.3px;
          }


          .ai-logo-subtitle {
            color: #8993a4;

            font-size: 9px;

            font-weight: 600;

            margin-top: 4px;

            letter-spacing: 0.5px;

            text-transform: uppercase;
          }


          /* =================================================
             MAIN NAV
          ================================================= */

          .ai-main-nav {
            display: flex;

            align-items: center;

            justify-content: center;

            gap: 3px;

            flex: 1;
          }


          .ai-nav-link {
            position: relative;

            display: flex;

            align-items: center;

            gap: 7px;

            padding:
              10px 13px;

            border-radius: 10px;

            color: #5d6879;

            font-size: 13px;

            font-weight: 600;

            text-decoration: none;

            transition:
              all 0.2s ease;
          }


          .ai-nav-link svg {
            font-size: 14px;
          }


          .ai-nav-link:hover {
            color: #0d6efd;

            background:
              #f3f7ff;
          }


          .ai-nav-active {
            color: #0d6efd;

            background:
              #edf4ff;
          }


          .ai-nav-active::after {
            content: "";

            position: absolute;

            bottom: 4px;

            left: 50%;

            transform:
              translateX(-50%);

            width: 18px;

            height: 2px;

            border-radius: 10px;

            background:
              #0d6efd;
          }


          /* =================================================
             AI GUIDE
          ================================================= */

          .ai-ai-link {
            color: #6546d9;
          }


          .ai-ai-link:hover {
            color: #6546d9;

            background:
              #f4f0ff;
          }


          /* =================================================
             RIGHT SIDE
          ================================================= */

          .ai-navbar-right {
            display: flex;

            align-items: center;

            justify-content: flex-end;

            gap: 10px;

            min-width: 280px;
          }


          /* =================================================
             BOOK BUTTON
          ================================================= */

          .ai-book-btn {
            display: flex;

            align-items: center;

            gap: 7px;

            padding:
              10px 15px;

            border-radius: 10px;

            color: white;

            background:
              linear-gradient(
                135deg,
                #0d6efd,
                #2563eb
              );

            text-decoration: none;

            font-size: 12px;

            font-weight: 700;

            box-shadow:
              0 6px 15px
              rgba(13, 110, 253, 0.18);

            transition:
              all 0.2s ease;
          }


          .ai-book-btn:hover {
            color: white;

            transform:
              translateY(-1px);

            box-shadow:
              0 9px 20px
              rgba(13, 110, 253, 0.24);
          }


          /* =================================================
             USER BUTTON
          ================================================= */

          .ai-user-wrapper {
            position: relative;
          }


          .ai-user-button {
            border: 0;

            background: #f6f8fb;

            display: flex;

            align-items: center;

            gap: 8px;

            padding:
              5px 10px 5px 5px;

            border-radius: 30px;

            color: #3d4758;

            cursor: pointer;

            transition:
              all 0.2s ease;
          }


          .ai-user-button:hover {
            background: #edf2f8;
          }


          .ai-user-avatar {
            width: 34px;
            height: 34px;

            border-radius: 50%;

            display: flex;

            align-items: center;
            justify-content: center;

            color: white;

            background:
              linear-gradient(
                135deg,
                #0d6efd,
                #4f46e5
              );

            font-size: 13px;
          }


          .ai-user-label {
            font-size: 12px;

            font-weight: 700;
          }


          .ai-chevron {
            font-size: 9px;

            transition:
              transform 0.2s ease;
          }


          .ai-chevron-open {
            transform:
              rotate(180deg);
          }


          /* =================================================
             DROPDOWN
          ================================================= */

          .ai-user-dropdown {
            position: absolute;

            top: calc(100% + 10px);

            right: 0;

            width: 245px;

            padding: 9px;

            background: white;

            border:
              1px solid #edf0f5;

            border-radius: 15px;

            box-shadow:
              0 18px 45px
              rgba(15, 23, 42, 0.14);

            animation:
              aiDropdown 0.18s ease;
          }


          @keyframes aiDropdown {

            from {
              opacity: 0;

              transform:
                translateY(-6px);
            }

            to {
              opacity: 1;

              transform:
                translateY(0);
            }

          }


          .ai-dropdown-header {
            display: flex;

            align-items: center;

            gap: 10px;

            padding: 10px;
          }


          .ai-dropdown-avatar {
            width: 38px;
            height: 38px;

            border-radius: 11px;

            display: flex;

            align-items: center;
            justify-content: center;

            background: #edf4ff;

            color: #0d6efd;
          }


          .ai-dropdown-header strong {
            display: block;

            color: #1e293b;

            font-size: 13px;
          }


          .ai-dropdown-header small {
            display: block;

            color: #94a3b8;

            font-size: 10px;

            margin-top: 2px;
          }


          .ai-dropdown-divider {
            height: 1px;

            background: #eef1f5;

            margin: 6px 3px;
          }


          .ai-dropdown-item,
          .ai-dropdown-logout {
            width: 100%;

            display: flex;

            align-items: center;

            gap: 11px;

            padding:
              10px 11px;

            border-radius: 9px;

            border: 0;

            background: transparent;

            color: #526071;

            text-decoration: none;

            font-size: 12px;

            font-weight: 600;

            cursor: pointer;

            text-align: left;

            transition:
              all 0.15s ease;
          }


          .ai-dropdown-item svg,
          .ai-dropdown-logout svg {
            width: 15px;

            color: #718096;
          }


          .ai-dropdown-item:hover {
            color: #0d6efd;

            background: #f3f7ff;
          }


          .ai-dropdown-logout {
            color: #dc3545;
          }


          .ai-dropdown-logout svg {
            color: #dc3545;
          }


          .ai-dropdown-logout:hover {
            background: #fff1f2;
          }


          /* =================================================
             LOGIN
          ================================================= */

          .ai-login-btn {
            padding:
              9px 16px;

            border-radius: 9px;

            color: #475569;

            font-size: 12px;

            font-weight: 700;

            text-decoration: none;

            transition:
              all 0.2s ease;
          }


          .ai-login-btn:hover {
            color: #0d6efd;

            background: #f3f7ff;
          }


          /* =================================================
             REGISTER
          ================================================= */

          .ai-register-btn {
            padding:
              10px 17px;

            border-radius: 10px;

            color: white;

            background:
              linear-gradient(
                135deg,
                #0d6efd,
                #4f46e5
              );

            font-size: 12px;

            font-weight: 700;

            text-decoration: none;

            box-shadow:
              0 6px 16px
              rgba(13, 110, 253, 0.18);

            transition:
              all 0.2s ease;
          }


          .ai-register-btn:hover {
            color: white;

            transform:
              translateY(-1px);
          }


          /* =================================================
             TABLET
          ================================================= */

          @media (max-width: 1200px) {

            .ai-navbar-container {
              padding:
                11px 18px;

              gap: 12px;
            }

            .ai-logo {
              min-width: auto;
            }

            .ai-logo-subtitle {
              display: none;
            }

            .ai-nav-link {
              padding:
                9px 9px;

              font-size: 12px;
            }

            .ai-nav-link span {
              display: none;
            }

            .ai-nav-link svg {
              font-size: 16px;
            }

            .ai-navbar-right {
              min-width: auto;
            }

            .ai-book-btn span {
              display: none;
            }

          }


          /* =================================================
             MOBILE
          ================================================= */

          @media (max-width: 991px) {

            .ai-navbar-container {
              flex-wrap: wrap;
            }

            .ai-main-nav {
              order: 3;

              width: 100%;

              justify-content: flex-start;

              overflow-x: auto;

              padding:
                5px 0 2px;

              scrollbar-width: none;
            }

            .ai-main-nav::-webkit-scrollbar {
              display: none;
            }

            .ai-nav-link span {
              display: inline;
            }

            .ai-navbar-right {
              margin-left: auto;
            }

            .ai-user-label {
              display: none;
            }

          }


          /* =================================================
             SMALL MOBILE
          ================================================= */

          @media (max-width: 576px) {

            .ai-navbar-container {
              padding:
                10px 14px;
            }

            .ai-logo-title {
              font-size: 16px;
            }

            .ai-logo-icon {
              width: 39px;
              height: 39px;
            }

            .ai-book-btn {
              padding:
                8px 10px;
            }

            .ai-register-btn {
              padding:
                9px 12px;
            }

            .ai-user-dropdown {
              right: -5px;
            }

          }

        `}
      </style>
    </>
  );
}

export default Navbar;



