
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layout/MainLayout";

// =====================================================
// PAGES
// =====================================================

import Home from "./pages/Home";

import Places from "./pages/Places";
import PlaceDetails from "./pages/PlaceDetails";

import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import HotelBooking from "./pages/HotelBooking";

import Transport from "./pages/Transport";
import MyTransportBookings from "./pages/MyTransportBookings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

import Chat from "./pages/Chat";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

// =====================================================
// AI BUDGET TRIP
// =====================================================

import BudgetTrip from "./pages/BudgetTrip";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <AuthProvider>

      <Routes>

        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <Route element={<MainLayout />}>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =================================================
              PLACES
          ================================================= */}

          <Route
            path="/places"
            element={<Places />}
          />

          <Route
            path="/places/:id"
            element={<PlaceDetails />}
          />

          {/* =================================================
              HOTELS
          ================================================= */}

          <Route
            path="/hotels"
            element={<Hotels />}
          />

          <Route
            path="/hotels/:id"
            element={<HotelDetails />}
          />

          {/* =================================================
              HOTEL BOOKING
          ================================================= */}

          <Route
            path="/hotel-booking/:id"
            element={<HotelBooking />}
          />

          {/* =================================================
              TRANSPORT
          ================================================= */}

          <Route
            path="/transport"
            element={<Transport />}
          />

          <Route
            path="/my-transport-bookings"
            element={<MyTransportBookings />}
          />

          {/* =================================================
              AUTHENTICATION
          ================================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =================================================
              PLACE BOOKING
          ================================================= */}

          <Route
            path="/booking"
            element={<Booking />}
          />

          {/* =================================================
              MY BOOKINGS
          ================================================= */}

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          {/* =================================================
              AI CHAT
          ================================================= */}

          <Route
            path="/chat"
            element={<Chat />}
          />

          {/* =================================================
              AI BUDGET TRIP
          ================================================= */}

          <Route
            path="/budget-trip"
            element={<BudgetTrip />}
          />

          {/* =================================================
              WISHLIST
          ================================================= */}

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>

    </AuthProvider>
  );
}

export default App;

