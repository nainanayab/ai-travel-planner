import { useEffect, useState } from "react";
import API from "../api";

import {
  FaMapMarkerAlt,
  FaTags,
  FaBus,
  FaTicketAlt,
  FaLightbulb,
  FaArrowLeft,
  FaRoute,
  FaCheckCircle,
  FaCloudSun,
  FaTemperatureHigh,
  FaWind,
  FaUmbrella,
  FaSave,
  FaLocationArrow,
} from "react-icons/fa";

// =====================================================
// COMPONENT
// =====================================================

function TripPlanner() {
  // =====================================================
  // LOCATION / DESTINATIONS
  // =====================================================

  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  // =====================================================
  // TRIP RESULT
  // =====================================================

  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // =====================================================
  // WEATHER
  // =====================================================

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  // =====================================================
  // CITIES
  // =====================================================

  const cities = [
    "Bahawalpur",
    "Lahore",
    "Multan",
  ];

  // =====================================================
  // CITY COORDINATES
  // =====================================================

  const cityCoordinates = {
    Bahawalpur: {
      latitude: 29.3956,
      longitude: 71.6836,
    },

    Lahore: {
      latitude: 31.5204,
      longitude: 74.3587,
    },

    Multan: {
      latitude: 30.1575,
      longitude: 71.5249,
    },
  };

  // =====================================================
  // WEATHER DESCRIPTION
  // =====================================================

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Heavy drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Heavy rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Heavy thunderstorm with hail",
    };

    return (
      weatherCodes[code] ||
      "Weather information available"
    );
  };

  // =====================================================
  // WEATHER ICON
  // =====================================================

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) {
      return <FaCloudSun />;
    }

    if (
      code === 51 ||
      code === 53 ||
      code === 55 ||
      code === 61 ||
      code === 63 ||
      code === 65 ||
      code === 80 ||
      code === 81 ||
      code === 82
    ) {
      return <FaUmbrella />;
    }

    return <FaCloudSun />;
  };

  // =====================================================
  // LOAD WEATHER
  // =====================================================

  const checkWeather = async (selectedCity) => {
    if (!selectedCity) {
      setWeather(null);
      setWeatherError("");
      return;
    }

    const coordinates =
      cityCoordinates[selectedCity];

    if (!coordinates) {
      setWeather(null);
      setWeatherError(
        "Weather information is not available for this city."
      );
      return;
    }

    setWeatherLoading(true);
    setWeatherError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(
          `Weather request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      console.error("Weather error:", err);

      setWeatherError(
        "Unable to load weather information."
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  // =====================================================
  // LOAD CITY PLACES
  // =====================================================

  const loadCityPlaces = async (
    selectedCity,
    selectedCategory = ""
  ) => {
    if (!selectedCity) {
      setPlaces([]);
      return;
    }

    setPlacesLoading(true);
    setError("");

    try {
      const response = await API.get("/places/");

      const allPlaces = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      let cityPlaces = allPlaces.filter(
        (place) =>
          place.location &&
          place.location
            .toLowerCase()
            .includes(
              selectedCity.toLowerCase()
            )
      );

      if (selectedCategory) {
        cityPlaces = cityPlaces.filter(
          (place) =>
            place.category &&
            place.category
              .toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              )
        );
      }

      setPlaces(cityPlaces);
    } catch (err) {
      console.error(
        "Load places error:",
        err
      );

      setPlaces([]);

      setError(
        "Unable to load tourist places. Please make sure the backend is running."
      );
    } finally {
      setPlacesLoading(false);
    }
  };

  // =====================================================
  // CITY CHANGE
  // =====================================================

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;

    setLocation(selectedCity);
    setPlaces([]);
    setSelectedPlaceIds([]);
    setTripPlan(null);
    setError("");
    setSaveMessage("");

    if (!selectedCity) {
      setWeather(null);
      setWeatherError("");
      return;
    }

    checkWeather(selectedCity);

    await loadCityPlaces(
      selectedCity,
      category
    );
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = async (e) => {
    const selectedCategory =
      e.target.value;

    setCategory(selectedCategory);
    setSelectedPlaceIds([]);
    setTripPlan(null);

    if (location) {
      await loadCityPlaces(
        location,
        selectedCategory
      );
    }
  };

  // =====================================================
  // SELECT / UNSELECT PLACE
  // =====================================================

  const togglePlace = (placeId) => {
    setSelectedPlaceIds((previous) => {
      if (previous.includes(placeId)) {
        return previous.filter(
          (id) => id !== placeId
        );
      }

      return [
        ...previous,
        placeId,
      ];
    });
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const selectAllPlaces = () => {
    setSelectedPlaceIds(
      places.map((place) => place.id)
    );
  };

  // =====================================================
  // CLEAR
  // =====================================================

  const clearSelectedPlaces = () => {
    setSelectedPlaceIds([]);
  };

  // =====================================================
  // GENERATE INSIDE CITY PLAN
  // =====================================================

  const generatePlan = async (e) => {
    e.preventDefault();

    setError("");
    setSaveMessage("");

    if (!location) {
      setError("Please select a city.");
      return;
    }

    if (selectedPlaceIds.length === 0) {
      setError(
        "Please select at least one destination."
      );
      return;
    }

    setLoading(true);
    setTripPlan(null);

    try {
      const response = await API.post(
        "/ai-trip/plan",
        {
          location: location.trim(),
          place_ids: selectedPlaceIds,
          category: category || null,
        }
      );

      if (response.data?.error) {
        setError(response.data.error);
        return;
      }

      if (response.data?.message) {
        setError(response.data.message);
        return;
      }

      if (!response.data) {
        setError(
          "The server returned an empty trip plan."
        );
        return;
      }

      setTripPlan(response.data);
    } catch (err) {
      console.error(
        "Trip planning error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );

        return;
      }

      if (err.response?.data?.detail) {
        setError(
          err.response.data.detail
        );
      } else {
        setError(
          "Unable to generate trip plan. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE TRIP
  // =====================================================

  const saveTrip = async () => {
    if (!tripPlan) {
      setError(
        "Please generate a trip plan first."
      );
      return;
    }

    const tripPlaces =
      Array.isArray(tripPlan.places)
        ? tripPlan.places
        : [];

    if (tripPlaces.length === 0) {
      setError(
        "There are no places available to save."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login first to save your trip."
      );
      return;
    }

    setSaveLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const title =
        `${tripPlan.destination} Inside City Trip`;

      const response = await API.post(
        "/ai-trip/save",
        {
          title,

          location:
            tripPlan.destination,

          places:
            tripPlaces.map(
              (place) => place.id
            ),

          place_ticket_total:
            Number(
              tripPlan.place_ticket_total ||
                0
            ),

          bus_ticket:
            Number(
              tripPlan.bus_ticket ||
                300
            ),

          total_ticket_cost:
            Number(
              tripPlan.total_ticket_cost ||
                0
            ),
        }
      );

      if (response.data?.error) {
        setError(
          response.data.error
        );
        return;
      }

      setSaveMessage(
        "Your Inside City trip has been saved successfully."
      );
    } catch (err) {
      console.error(
        "Save trip error:",
        err
      );

      if (
        err.response?.status === 401
      ) {
        localStorage.removeItem("token");

        setError(
          "Your login session has expired. Please login again."
        );
      } else if (
        err.response?.data?.detail
      ) {
        setError(
          err.response.data.detail
        );
      } else {
        setError(
          "Unable to save trip. Please try again."
        );
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetPlan = () => {
    setTripPlan(null);
    setError("");
    setSaveMessage("");
    setSelectedPlaceIds([]);
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(
      price || 0
    ).toLocaleString("en-PK");
  };

  const busTicket = Number(
    tripPlan?.bus_ticket || 300
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (location) {
      loadCityPlaces(
        location,
        category
      );
    }
  }, [location, category]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="trip-planner-page">

      <div className="trip-planner-container">

        {/* =================================================
            HEADER
        ================================================= */}

        {!tripPlan && (
          <section className="trip-planner-header">

            <div className="trip-header-badge">
              <FaRoute />

              <span>
                INSIDE CITY
              </span>
            </div>

            <h1>
              Plan Your City Experience
            </h1>

            <p>
              Select your city, choose the
              destinations you want to visit,
              and let AI create the best
              inside-city sightseeing route.
            </p>

          </section>
        )}

        {/* =================================================
            PLANNER FORM
        ================================================= */}

        {!tripPlan &&
          !loading && (
            <section className="trip-planner-form-card">

              <div className="planner-form-heading">

                <div>

                  <span className="form-overline">
                    PLAN YOUR EXPERIENCE
                  </span>

                  <h2>
                    Select Your Destinations
                  </h2>

                  <p>
                    Choose a city, filter
                    destinations and select
                    the places you want to visit.
                  </p>

                </div>

                <div className="planner-heading-icon">
                  <FaLocationArrow />
                </div>

              </div>

              <form
                className="trip-planner-form"
                onSubmit={generatePlan}
              >

                {/* =================================================
                    CITY
                ================================================= */}

                <div className="planner-field">

                  <label htmlFor="location">
                    <FaMapMarkerAlt />
                    Select City
                  </label>

                  <select
                    id="location"
                    value={location}
                    onChange={
                      handleCityChange
                    }
                  >

                    <option value="">
                      Select a city
                    </option>

                    {cities.map((city) => (
                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>
                    ))}

                  </select>

                </div>

                {/* =================================================
                    CATEGORY
                ================================================= */}

                <div className="planner-field">

                  <label htmlFor="category">
                    <FaTags />
                    Filter Destinations
                  </label>

                  <select
                    id="category"
                    value={category}
                    onChange={
                      handleCategoryChange
                    }
                  >

                    <option value="">
                      All Categories
                    </option>

                    <option value="Historical">
                      Historical
                    </option>

                    <option value="Museum">
                      Museum
                    </option>

                    <option value="Nature">
                      Nature
                    </option>

                    <option value="Adventure">
                      Adventure
                    </option>

                    <option value="Religious">
                      Religious
                    </option>

                    <option value="Cultural">
                      Cultural
                    </option>

                  </select>

                </div>

                {/* =================================================
                    WEATHER
                ================================================= */}

                {location && (
                  <div className="trip-weather-card">

                    <div className="weather-card-header">

                      <div>

                        <span className="weather-label">
                          CURRENT WEATHER
                        </span>

                        <h3>
                          {location}
                        </h3>

                      </div>

                      <div className="weather-main-icon">

                        {weatherLoading ? (
                          <FaCloudSun />
                        ) : (
                          getWeatherIcon(
                            weather?.current
                              ?.weather_code
                          )
                        )}

                      </div>

                    </div>

                    {weatherLoading && (
                      <p className="weather-loading">
                        Checking current weather...
                      </p>
                    )}

                    {weatherError && (
                      <p className="weather-error">
                        {weatherError}
                      </p>
                    )}

                    {weather &&
                      !weatherLoading && (
                        <>
                          <div className="weather-main">

                            <div className="weather-temperature">
                              {Math.round(
                                weather.current
                                  .temperature_2m
                              )}
                              °C
                            </div>

                            <div className="weather-condition">

                              <strong>
                                {getWeatherDescription(
                                  weather
                                    .current
                                    .weather_code
                                )}
                              </strong>

                              <span>
                                Feels like{" "}
                                {Math.round(
                                  weather
                                    .current
                                    .apparent_temperature
                                )}
                                °C
                              </span>

                            </div>

                          </div>

                          <div className="weather-details">

                            <div className="weather-detail">

                              <FaTemperatureHigh />

                              <div>

                                <small>
                                  HUMIDITY
                                </small>

                                <strong>
                                  {
                                    weather
                                      .current
                                      .relative_humidity_2m
                                  }
                                  %
                                </strong>

                              </div>

                            </div>

                            <div className="weather-detail">

                              <FaWind />

                              <div>

                                <small>
                                  WIND
                                </small>

                                <strong>
                                  {
                                    weather
                                      .current
                                      .wind_speed_10m
                                  }{" "}
                                  km/h
                                </strong>

                              </div>

                            </div>

                            <div className="weather-detail">

                              <FaUmbrella />

                              <div>

                                <small>
                                  RAIN CHANCE
                                </small>

                                <strong>
                                  {
                                    weather
                                      .daily
                                      ?.precipitation_probability_max?.[0] ??
                                    0
                                  }
                                  %
                                </strong>

                              </div>

                            </div>

                          </div>

                          <p className="weather-tip">

                            <FaLightbulb />

                            Check the weather before
                            starting your sightseeing
                            trip.

                          </p>
                        </>
                      )}

                  </div>
                )}

                {/* =================================================
                    DESTINATIONS
                ================================================= */}

                {location && (
                  <section className="destination-selection">

                    <div className="destination-selection-header">

                      <div>

                        <span>
                          TOURIST DESTINATIONS
                        </span>

                        <h2>
                          Choose Your Stops
                        </h2>

                        <p>
                          Select the places you
                          want to visit in{" "}
                          {location}.
                        </p>

                      </div>

                      {places.length > 0 && (
                        <div className="destination-selection-actions">

                          <button
                            type="button"
                            onClick={
                              selectAllPlaces
                            }
                          >
                            Select All
                          </button>

                          <button
                            type="button"
                            onClick={
                              clearSelectedPlaces
                            }
                          >
                            Clear
                          </button>

                        </div>
                      )}

                    </div>

                    {placesLoading && (
                      <div className="places-loading">

                        <div className="trip-spinner"></div>

                        <p>
                          Finding tourist places
                          in {location}...
                        </p>

                      </div>
                    )}

                    {!placesLoading &&
                      places.length === 0 && (
                        <div className="no-destinations">

                          <FaMapMarkerAlt />

                          <h3>
                            No destinations found
                          </h3>

                          <p>
                            No tourist places are
                            currently available
                            for {location}.
                          </p>

                        </div>
                      )}

                    {!placesLoading &&
                      places.length > 0 && (

                        <div className="destination-list">

                          {places.map(
                            (place) => {

                              const isSelected =
                                selectedPlaceIds.includes(
                                  place.id
                                );

                              return (
                                <button
                                  type="button"
                                  key={
                                    place.id
                                  }
                                  className={
                                    isSelected
                                      ? "destination-list-item selected"
                                      : "destination-list-item"
                                  }
                                  onClick={() =>
                                    togglePlace(
                                      place.id
                                    )
                                  }
                                >

                                  {/* CHECK ICON */}

                                  <div className="destination-select-icon">

                                    {isSelected ? (
                                      <FaCheckCircle />
                                    ) : (
                                      <span></span>
                                    )}

                                  </div>

                                  {/* PLACE NAME */}

                                  <div className="destination-list-content">

                                    <div className="destination-title-row">

                                      <h3>
                                        {
                                          place.name
                                        }
                                      </h3>

                                      {place.category && (
                                        <span>
                                          {
                                            place.category
                                          }
                                        </span>
                                      )}

                                    </div>

                                    <p>
                                      <FaMapMarkerAlt />

                                      {
                                        place.location
                                      }
                                    </p>

                                  </div>

                                  {/* TICKET */}

                                  <div className="destination-list-price">

                                    <span>
                                      <FaTicketAlt />
                                      Entry Ticket
                                    </span>

                                    <strong>
                                      Rs.{" "}
                                      {formatPrice(
                                        place.ticket_price
                                      )}
                                    </strong>

                                  </div>

                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                    {selectedPlaceIds.length > 0 && (
                      <div className="selected-destination-count">

                        <FaCheckCircle />

                        <strong>
                          {
                            selectedPlaceIds.length
                          }
                        </strong>

                        <span>
                          {
                            selectedPlaceIds.length ===
                            1
                              ? "destination selected"
                              : "destinations selected"
                          }
                        </span>

                      </div>
                    )}

                  </section>
                )}

                {/* =================================================
                    TRANSPORT
                ================================================= */}

                <div className="planner-transport">

                  <div className="transport-icon">
                    <FaBus />
                  </div>

                  <div className="transport-content">

                    <span>
                      RECOMMENDED TRANSPORT
                    </span>

                    <strong>
                      Double Decker Bus
                    </strong>

                    <p>
                      Comfortable inside-city
                      sightseeing transport.
                    </p>

                  </div>

                  <div className="transport-price">

                    <small>
                      Ticket
                    </small>

                    <strong>
                      Rs. 300
                    </strong>

                  </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                  <div className="trip-error">
                    {error}
                  </div>
                )}

                {/* =================================================
                    GENERATE
                ================================================= */}

                <button
                  type="submit"
                  className="generate-trip-btn"
                  disabled={
                    loading ||
                    !location ||
                    selectedPlaceIds.length ===
                      0
                  }
                >

                  <FaRoute />

                  {loading
                    ? "Creating Your Route..."
                    : "Generate My City Trip"}

                </button>

              </form>

            </section>
          )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <section className="trip-loading">

            <div className="trip-loading-icon">
              <FaRoute />
            </div>

            <div className="trip-spinner"></div>

            <h2>
              Creating Your City Route
            </h2>

            <p>
              Our AI is arranging your
              selected destinations into
              the best sightseeing order.
            </p>

            <div className="loading-steps">

              <span>
                <FaCheckCircle />
                Checking destinations
              </span>

              <span>
                <FaCheckCircle />
                Optimizing route
              </span>

              <span>
                <FaCheckCircle />
                Preparing itinerary
              </span>

            </div>

          </section>
        )}

        {/* =================================================
            RESULT
        ================================================= */}

        {tripPlan &&
          !loading && (
            <section className="trip-result">

              {/* RESULT HEADER */}

              <div className="trip-result-header">

                <div className="result-top-row">

                  <button
                    type="button"
                    className="result-back-btn"
                    onClick={resetPlan}
                  >
                    <FaArrowLeft />
                    Change Destinations
                  </button>

                  <span className="result-status">

                    <FaCheckCircle />
                    PLAN READY

                  </span>

                </div>

                <div className="result-main">

                  <span className="trip-result-label">
                    YOUR INSIDE CITY PLAN
                  </span>

                  <h1>
                    {
                      tripPlan.destination
                    }
                  </h1>

                  <p>
                    {
                      tripPlan.places
                        ?.length || 0
                    }{" "}
                    selected destinations
                    arranged into your
                    sightseeing route.
                  </p>

                </div>

              </div>

              {/* QUICK INFO */}

              <div className="trip-info-grid">

                <div className="trip-info-card">

                  <div className="trip-info-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>

                    <small>
                      DESTINATION
                    </small>

                    <strong>
                      {
                        tripPlan.destination
                      }
                    </strong>

                  </div>

                </div>

                <div className="trip-info-card">

                  <div className="trip-info-icon">
                    <FaLocationArrow />
                  </div>

                  <div>

                    <small>
                      SELECTED STOPS
                    </small>

                    <strong>
                      {
                        tripPlan
                          .places
                          ?.length ||
                        0
                      }{" "}
                      Places
                    </strong>

                  </div>

                </div>

                <div className="trip-info-card">

                  <div className="trip-info-icon">
                    <FaBus />
                  </div>

                  <div>

                    <small>
                      TRANSPORT
                    </small>

                    <strong>
                      Double Decker Bus
                    </strong>

                  </div>

                </div>

              </div>

              {/* WEATHER */}

              {weather && (
                <section className="result-weather-card">

                  <div className="result-weather-heading">

                    <div>

                      <span>
                        WEATHER CHECK
                      </span>

                      <h2>
                        Weather in{" "}
                        {location}
                      </h2>

                    </div>

                    <div className="result-weather-icon">

                      {getWeatherIcon(
                        weather
                          .current
                          .weather_code
                      )}

                    </div>

                  </div>

                  <div className="result-weather-content">

                    <div className="result-temperature">

                      {Math.round(
                        weather
                          .current
                          .temperature_2m
                      )}
                      °C

                    </div>

                    <div className="result-weather-condition">

                      <strong>
                        {getWeatherDescription(
                          weather
                            .current
                            .weather_code
                        )}
                      </strong>

                      <span>
                        Feels like{" "}
                        {Math.round(
                          weather
                            .current
                            .apparent_temperature
                        )}
                        °C
                      </span>

                    </div>

                    <div className="result-weather-details">

                      <span>

                        <FaTemperatureHigh />

                        Humidity{" "}
                        {
                          weather
                            .current
                            .relative_humidity_2m
                        }%

                      </span>

                      <span>

                        <FaWind />

                        Wind{" "}
                        {
                          weather
                            .current
                            .wind_speed_10m
                        }{" "}
                        km/h

                      </span>

                      <span>

                        <FaUmbrella />

                        Rain{" "}
                        {
                          weather
                            .daily
                            ?.precipitation_probability_max?.[0] ??
                          0
                        }%

                      </span>

                    </div>

                  </div>

                </section>
              )}

              {/* TRANSPORT */}

              <div className="transport-card">

                <div className="transport-card-left">

                  <div className="transport-icon-large">
                    <FaBus />
                  </div>

                  <div>

                    <span className="transport-label">
                      INSIDE CITY TRANSPORT
                    </span>

                    <h3>
                      Double Decker Bus
                    </h3>

                    <p>
                      Comfortable sightseeing
                      transport between your
                      selected tourist places.
                    </p>

                  </div>

                </div>

                <div className="transport-price">

                  <small>
                    BUS TICKET
                  </small>

                  <strong>
                    Rs.{" "}
                    {formatPrice(
                      busTicket
                    )}
                  </strong>

                </div>

              </div>

              {/* SELECTED PLACES */}

              {tripPlan.places?.length > 0 && (
                <section className="selected-places">

                  <div className="section-heading">

                    <div>

                      <span>
                        YOUR ROUTE
                      </span>

                      <h2>
                        Selected Tourist Places
                      </h2>

                      <p>
                        Your selected
                        destinations arranged
                        in the best sightseeing
                        order.
                      </p>

                    </div>

                    <div className="places-count">

                      {
                        tripPlan.places
                          .length
                      }{" "}

                      {
                        tripPlan
                          .places
                          .length ===
                        1
                          ? "Place"
                          : "Places"
                      }

                    </div>

                  </div>

                  <div className="places-ticket-list">

                    {tripPlan.places.map(
                      (
                        place,
                        index
                      ) => (
                        <article
                          className="place-ticket-card"
                          key={
                            place.id ||
                            index
                          }
                        >

                          <div className="place-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>

                          <div className="place-ticket-info">

                            <div className="place-title-row">

                              <h3>
                                {
                                  place.name
                                }
                              </h3>

                              <span className="place-category">

                                {
                                  place.category ||
                                  "Tourist Attraction"
                                }

                              </span>

                            </div>

                            <div className="place-meta">

                              <span>

                                <FaMapMarkerAlt />

                                {
                                  place.location
                                }

                              </span>

                            </div>

                            {place.description && (
                              <p>
                                {
                                  place.description
                                }
                              </p>
                            )}

                          </div>

                          <div className="place-ticket-price">

                            <span>

                              <FaTicketAlt />

                              Entry Ticket

                            </span>

                            <strong>

                              Rs.{" "}

                              {formatPrice(
                                place.ticket_price
                              )}

                            </strong>

                          </div>

                        </article>
                      )
                    )}

                  </div>

                </section>
              )}

              {/* COST */}

              <section className="ticket-summary">

                <div className="section-heading">

                  <div>

                    <span>
                      TRIP COST
                    </span>

                    <h2>
                      Estimated Ticket Cost
                    </h2>

                    <p>
                      A simple breakdown of
                      your sightseeing
                      expenses.
                    </p>

                  </div>

                </div>

                <div className="ticket-summary-body">

                  <div className="ticket-summary-row">

                    <div>

                      <span>
                        Tourist Place Tickets
                      </span>

                      <small>
                        Entry tickets for your
                        selected destinations
                      </small>

                    </div>

                    <strong>
                      Rs.{" "}
                      {formatPrice(
                        tripPlan
                          .place_ticket_total
                      )}
                    </strong>

                  </div>

                  <div className="ticket-summary-row">

                    <div>

                      <span>
                        Double Decker Bus
                      </span>

                      <small>
                        Inside-city sightseeing
                        transport
                      </small>

                    </div>

                    <strong>
                      Rs.{" "}
                      {formatPrice(
                        busTicket
                      )}
                    </strong>

                  </div>

                  <div className="ticket-summary-total">

                    <div>

                      <span>
                        Total Estimated Cost
                      </span>

                      <small>
                        Places + sightseeing
                        transport
                      </small>

                    </div>

                    <strong>
                      Rs.{" "}
                      {formatPrice(
                        tripPlan
                          .total_ticket_cost
                      )}
                    </strong>

                  </div>

                </div>

              </section>

              {/* AI ITINERARY */}

              {tripPlan.ai_itinerary && (
                <section className="ai-itinerary">

                  <div className="section-heading">

                    <div>

                      <span>
                        AI GENERATED
                      </span>

                      <h2>
                        Your City Itinerary
                      </h2>

                      <p>
                        A smart route prepared
                        from your selected
                        destinations.
                      </p>

                    </div>

                  </div>

                  <div className="itinerary-content">

                    {tripPlan.ai_itinerary
                      .split("\n")
                      .map(
                        (
                          line,
                          index
                        ) => {

                          const text =
                            line.trim();

                          if (!text) {
                            return (
                              <div
                                key={
                                  index
                                }
                                className="itinerary-space"
                              />
                            );
                          }

                          if (
                            /^day\s*\d+/i.test(
                              text
                            )
                          ) {
                            return (
                              <h3
                                key={
                                  index
                                }
                                className="itinerary-day"
                              >

                                <FaRoute />

                                {text}

                              </h3>
                            );
                          }

                          if (
                            text
                              .toLowerCase()
                              .includes(
                                "double decker"
                              ) ||
                            text
                              .toLowerCase()
                              .includes(
                                "transport:"
                              )
                          ) {
                            return null;
                          }

                          if (
                            text
                              .toLowerCase()
                              .startsWith(
                                "ticket:"
                              )
                          ) {
                            return (
                              <div
                                key={
                                  index
                                }
                                className="itinerary-ticket"
                              >

                                <FaTicketAlt />

                                <span>
                                  {text}
                                </span>

                              </div>
                            );
                          }

                          if (
                            text
                              .toLowerCase()
                              .startsWith(
                                "why visit:"
                              )
                          ) {
                            return (
                              <p
                                key={
                                  index
                                }
                                className="itinerary-description"
                              >
                                {text}
                              </p>
                            );
                          }

                          if (
                            text
                              .toLowerCase()
                              .startsWith(
                                "travel tip"
                              )
                          ) {
                            return (
                              <div
                                key={
                                  index
                                }
                                className="travel-tip"
                              >

                                <div className="travel-tip-icon">
                                  <FaLightbulb />
                                </div>

                                <div>

                                  <strong>
                                    Travel Tip
                                  </strong>

                                  <p>
                                    {text.replace(
                                      /^travel tip:?\s*/i,
                                      ""
                                    )}
                                  </p>

                                </div>

                              </div>
                            );
                          }

                          if (
                            text.startsWith(
                              "-"
                            ) ||
                            text.startsWith(
                              "•"
                            ) ||
                            text.startsWith(
                              "*"
                            )
                          ) {
                            return (
                              <p
                                key={
                                  index
                                }
                                className="itinerary-point"
                              >
                                {text}
                              </p>
                            );
                          }

                          return (
                            <p
                              key={
                                index
                              }
                              className="itinerary-text"
                            >
                              {text}
                            </p>
                          );
                        }
                      )}

                  </div>

                </section>
              )}

              {/* SAVE */}

              <section className="save-trip-section">

                {saveMessage && (
                  <div className="trip-success">

                    <FaCheckCircle />

                    {saveMessage}

                  </div>
                )}

                {error && (
                  <div className="trip-error">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  className="save-trip-btn"
                  onClick={saveTrip}
                  disabled={
                    saveLoading ||
                    Boolean(saveMessage)
                  }
                >

                  {saveLoading ? (
                    <>
                      <FaRoute />
                      Saving Trip...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save My Trip
                    </>
                  )}

                </button>

              </section>

              {/* NEW PLAN */}

              <button
                type="button"
                className="new-trip-btn"
                onClick={resetPlan}
              >

                <FaArrowLeft />

                Plan Another City Trip

              </button>

            </section>
          )}

      </div>

    </main>
  );
}

export default TripPlanner;