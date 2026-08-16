import { useEffect, useState } from "react";
import {
  FaCloudSun,
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaWind,
  FaTint,
  FaUmbrella,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaBolt,
  FaSnowflake,
  FaSearch,
} from "react-icons/fa";

const cities = {
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

function Weather() {
  const [city, setCity] = useState("Bahawalpur");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getWeatherIcon = (code) => {
    if (code === 0) {
      return <FaSun />;
    }

    if ([1, 2].includes(code)) {
      return <FaCloudSun />;
    }

    if (code === 3) {
      return <FaCloud />;
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return <FaCloudRain />;
    }

    if ([95, 96, 99].includes(code)) {
      return <FaBolt />;
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return <FaSnowflake />;
    }

    return <FaCloudSun />;
  };

  const getWeatherText = (code) => {
    if (code === 0) return "Clear Sky";

    if ([1, 2].includes(code)) {
      return "Partly Cloudy";
    }

    if (code === 3) {
      return "Cloudy";
    }

    if ([45, 48].includes(code)) {
      return "Foggy";
    }

    if ([51, 53, 55].includes(code)) {
      return "Drizzle";
    }

    if ([61, 63, 65].includes(code)) {
      return "Rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
      return "Snow";
    }

    if ([80, 81, 82].includes(code)) {
      return "Rain Showers";
    }

    if ([95, 96, 99].includes(code)) {
      return "Thunderstorm";
    }

    return "Weather Update";
  };

  const getDayName = (date, index) => {
    if (index === 0) {
      return "Today";
    }

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const fetchWeather = async (selectedCity) => {
    try {
      setLoading(true);
      setError("");

      const coordinates = cities[selectedCity];

      const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${coordinates.latitude}` +
        `&longitude=${coordinates.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
        `&timezone=auto` +
        `&forecast_days=7`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Weather service unavailable.");
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load weather information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <div className="weather-page">

      {/* ============================================
          HERO
      ============================================ */}

      <section className="weather-hero">

        <div className="weather-hero-overlay">

          <div className="weather-container">

            <div className="weather-hero-content">

              <span className="weather-badge">
                <FaCloudSun />
                INSIDE CITY WEATHER
              </span>

              <h1>
                Plan Your Day
                <br />
                Around the Weather
              </h1>

              <p>
                Check current conditions and upcoming
                forecasts before exploring your city.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================
          WEATHER CONTENT
      ============================================ */}

      <main className="weather-main">

        <div className="weather-container">

          {/* CITY SELECTOR */}

          <div className="weather-toolbar">

            <div className="weather-toolbar-title">

              <span className="toolbar-icon">
                <FaMapMarkerAlt />
              </span>

              <div>
                <small>
                  SELECT DESTINATION
                </small>

                <strong>
                  City Weather
                </strong>
              </div>

            </div>

            <div className="weather-city-select">

              <FaSearch />

              <select
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              >

                {Object.keys(cities).map(
                  (cityName) => (
                    <option
                      key={cityName}
                      value={cityName}
                    >
                      {cityName}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="weather-error">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (

            <div className="weather-loading">

              <div className="weather-spinner"></div>

              <h3>
                Loading weather...
              </h3>

              <p>
                Getting the latest weather conditions
                for {city}.
              </p>

            </div>

          )}

          {/* WEATHER */}

          {weather && !loading && (

            <>

              {/* =====================================
                  CURRENT WEATHER
              ===================================== */}

              <section className="current-weather-card">

                <div className="current-weather-left">

                  <div className="current-weather-icon">
                    {getWeatherIcon(
                      weather.current.weather_code
                    )}
                  </div>

                  <div className="current-weather-main">

                    <span>
                      CURRENT WEATHER
                    </span>

                    <h2>
                      {city}
                    </h2>

                    <p>
                      {getWeatherText(
                        weather.current.weather_code
                      )}
                    </p>

                  </div>

                </div>

                <div className="current-temperature">

                  <strong>
                    {Math.round(
                      weather.current.temperature_2m
                    )}
                    °
                  </strong>

                  <span>
                    Celsius
                  </span>

                </div>

              </section>

              {/* =====================================
                  WEATHER DETAILS
              ===================================== */}

              <section className="weather-details-grid">

                <div className="weather-detail-card">

                  <div className="detail-icon">
                    <FaTemperatureHigh />
                  </div>

                  <div>
                    <small>
                      FEELS LIKE
                    </small>

                    <strong>
                      {Math.round(
                        weather.current
                          .apparent_temperature
                      )}
                      °C
                    </strong>
                  </div>

                </div>

                <div className="weather-detail-card">

                  <div className="detail-icon">
                    <FaTint />
                  </div>

                  <div>
                    <small>
                      HUMIDITY
                    </small>

                    <strong>
                      {weather.current
                        .relative_humidity_2m}
                      %
                    </strong>
                  </div>

                </div>

                <div className="weather-detail-card">

                  <div className="detail-icon">
                    <FaWind />
                  </div>

                  <div>
                    <small>
                      WIND SPEED
                    </small>

                    <strong>
                      {Math.round(
                        weather.current
                          .wind_speed_10m
                      )}{" "}
                      km/h
                    </strong>
                  </div>

                </div>

                <div className="weather-detail-card">

                  <div className="detail-icon">
                    <FaUmbrella />
                  </div>

                  <div>
                    <small>
                      PRECIPITATION
                    </small>

                    <strong>
                      {weather.current.precipitation}{" "}
                      mm
                    </strong>
                  </div>

                </div>

              </section>

              {/* =====================================
                  FORECAST HEADER
              ===================================== */}

              <div className="weather-section-heading">

                <div>

                  <span>
                    7-DAY FORECAST
                  </span>

                  <h2>
                    Upcoming Weather
                  </h2>

                </div>

                <p>
                  Check the weather before planning
                  your sightseeing activities.
                </p>

              </div>

              {/* =====================================
                  FORECAST CARDS
              ===================================== */}

              <section className="forecast-grid">

                {weather.daily.time.map(
                  (date, index) => (

                    <div
                      className={
                        "forecast-card " +
                        (index === 0
                          ? "today"
                          : "")
                      }
                      key={date}
                    >

                      <div className="forecast-day">
                        {getDayName(
                          date,
                          index
                        )}
                      </div>

                      <div className="forecast-date">
                        {new Date(
                          date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </div>

                      <div className="forecast-icon">
                        {getWeatherIcon(
                          weather.daily
                            .weather_code[index]
                        )}
                      </div>

                      <div className="forecast-condition">
                        {getWeatherText(
                          weather.daily
                            .weather_code[index]
                        )}
                      </div>

                      <div className="forecast-temp">

                        <strong>
                          {Math.round(
                            weather.daily
                              .temperature_2m_max[
                              index
                            ]
                          )}
                          °
                        </strong>

                        <span>
                          {Math.round(
                            weather.daily
                              .temperature_2m_min[
                              index
                            ]
                          )}
                          °
                        </span>

                      </div>

                      <div className="forecast-rain">

                        <FaUmbrella />

                        {
                          weather.daily
                            .precipitation_probability_max[
                            index
                          ]
                        }
                        % rain

                      </div>

                    </div>

                  )
                )}

              </section>

              {/* =====================================
                  TRAVEL ADVICE
              ===================================== */}

              <section className="weather-advice">

                <div className="advice-icon">
                  <FaCloudSun />
                </div>

                <div>

                  <span>
                    INSIDE CITY TRAVEL TIP
                  </span>

                  <h3>
                    Check the weather before
                    starting your city tour
                  </h3>

                  <p>
                    Weather conditions can affect
                    outdoor sightseeing. Check the
                    forecast before visiting parks,
                    historical sites and other
                    outdoor attractions.
                  </p>

                </div>

              </section>

            </>

          )}

        </div>

      </main>

    </div>
  );
}

export default Weather;