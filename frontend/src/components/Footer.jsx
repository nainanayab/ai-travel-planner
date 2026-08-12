
import { Link } from "react-router-dom";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope
} from "react-icons/fa";


function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">

      <div className="container py-5">

        <div className="row">

          {/* About */}
          <div className="col-md-4 mb-4">

            <h4>
              AI Tourism Platform
            </h4>

            <p>
              Discover beautiful destinations,
              book your trips, and get AI-powered
              travel recommendations.
            </p>

          </div>


          {/* Quick Links */}
          <div className="col-md-4 mb-4">

            <h5>
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  className="text-white text-decoration-none"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-white text-decoration-none"
                  to="/places"
                >
                  Places
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-white text-decoration-none"
                  to="/hotels"
                >
                  Hotels
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-white text-decoration-none"
                  to="/booking"
                >
                  Booking
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-white text-decoration-none"
                  to="/chat"
                >
                  AI Chat
                </Link>
              </li>

            </ul>

          </div>


          {/* Contact */}
          <div className="col-md-4 mb-4">

            <h5>
              Contact
            </h5>

            <p>
              <FaEnvelope className="me-2" />
              info@aitourism.com
            </p>

            <div className="fs-4">

              <FaFacebook className="me-3" />

              <FaInstagram className="me-3" />

              <FaTwitter />

            </div>

          </div>

        </div>


        <hr />


        <p className="text-center mb-0">
          © 2026 AI Tourism Platform.
          All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}


export default Footer;


