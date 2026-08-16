
import "./App.css";

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

import BudgetTrip from "./pages/BudgetTrip";
import TripPlanner from "./pages/TripPlanner";
import Weather from "./pages/Weather";

// =====================================================
// SAVED TRIPS
// =====================================================

import MyTrips from "./pages/MyTrips";
import TripDetails from "./pages/TripDetails";

// =====================================================
// PAYMENT
// =====================================================

import Payment from "./pages/Payment";

// =====================================================
// AUTH
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// =====================================================
// BOOKINGS
// =====================================================

import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import MyHotelBookings from "./pages/MyHotelBookings";

// =====================================================
// USER FEATURES
// =====================================================

import Chat from "./pages/Chat";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

import NotFound from "./pages/NotFound";

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
              BUDGET TRIP
          ================================================= */}

          <Route
            path="/budget-trip"
            element={<BudgetTrip />}
          />

          {/* =================================================
              INSIDE CITY TRIP PLANNER
              
              Flow:
              City → Select Stops → Generate Plan
              
              No city-to-city planning here.
              No trip duration required.
          ================================================= */}

          <Route
            path="/trip-planner"
            element={<TripPlanner />}
          />

          {/* =================================================
              MY SAVED TRIPS
          ================================================= */}

          <Route
            path="/my-trips"
            element={<MyTrips />}
          />

          {/* =================================================
              SAVED TRIP DETAILS
          ================================================= */}

          <Route
            path="/my-trips/:tripId"
            element={<TripDetails />}
          />

          {/* =================================================
              PAYMENT
          ================================================= */}

          <Route
            path="/payment/:tripId"
            element={<Payment />}
          />

          {/* =================================================
              WEATHER
          ================================================= */}

          <Route
            path="/weather"
            element={<Weather />}
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
              PLACE BOOKINGS
          ================================================= */}

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          {/* =================================================
              HOTEL BOOKINGS
          ================================================= */}

          <Route
            path="/my-hotel-bookings"
            element={<MyHotelBookings />}
          />

          {/* =================================================
              USER FEATURES
          ================================================= */}

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* =================================================
              404
          ================================================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
