import { useMemo, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaBus,
  FaHotel,
  FaUtensils,
  FaTicketAlt,
  FaPlusCircle,
  FaRobot,
  FaRoute,
  FaCalculator,
  FaArrowRight,
  FaCheckCircle,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const API = BACKEND_URL;

const AI_BUDGET_TRIP_ENDPOINT = `${API}/budget-trip/plan`;

/* ============================================================
   ALLOWED CITIES
============================================================ */

const CITIES = ["Bahawalpur", "Lahore", "Multan"];


/* ============================================================
   MAIN COMPONENT
============================================================ */

function BudgetTrip() {

  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] = useState({
    fromCity: "Bahawalpur",
    destination: "",
    days: 3,
    passengers: 2,
    budget: "",

    transport: 0,
    hotel: 0,
    food: 0,
    activities: 0,
    other: 0,
  });


  /* =========================================================
     PLAN
  ========================================================= */

  const [planned, setPlanned] = useState(false);
  const [tripPlan, setTripPlan] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");


  /* =========================================================
     FOOD BUDGET
  ========================================================= */

  const [foodBreakdown, setFoodBreakdown] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: 0,
    breakfastIncluded: false,
    dinnerIncluded: false,
  });


  /* =========================================================
     TRANSPORT
  ========================================================= */

  const [transportResults, setTransportResults] = useState([]);
  const [transportLoading, setTransportLoading] = useState(false);
  const [transportSearched, setTransportSearched] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [transportError, setTransportError] = useState("");


  /* =========================================================
     HOTEL
  ========================================================= */

  const [hotelResults, setHotelResults] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelSearched, setHotelSearched] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelError, setHotelError] = useState("");


  /* =========================================================
     UPDATE FORM
  ========================================================= */

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  /* =========================================================
     TOTAL COST
  ========================================================= */

  const totalCost = useMemo(() => {
    return (
      Number(form.transport || 0) +
      Number(form.hotel || 0) +
      Number(form.food || 0) +
      Number(form.activities || 0) +
      Number(form.other || 0)
    );
  }, [
    form.transport,
    form.hotel,
    form.food,
    form.activities,
    form.other,
  ]);


  /* =========================================================
     PER PERSON
  ========================================================= */

  const perPerson = useMemo(() => {
    const persons = Number(form.passengers || 0);

    if (persons <= 0) {
      return 0;
    }

    return Math.round(totalCost / persons);
  }, [totalCost, form.passengers]);


  /* =========================================================
     DAILY COST
  ========================================================= */

  const dailyCost = useMemo(() => {
    const days = Number(form.days || 0);

    if (days <= 0) {
      return 0;
    }

    return Math.round(totalCost / days);
  }, [totalCost, form.days]);


  /* =========================================================
     REMAINING BUDGET
  ========================================================= */

  const remainingBudget = useMemo(() => {
    return Number(form.budget || 0) - totalCost;
  }, [form.budget, totalCost]);


  /* =========================================================
     BUDGET STATUS
  ========================================================= */

  const budgetStatus = useMemo(() => {

    if (!form.budget) {
      return {
        text: "Enter your total budget to compare your trip cost.",
        className: "neutral",
      };
    }

    if (remainingBudget >= 0) {
      return {
        text: `You are within budget by PKR ${remainingBudget.toLocaleString()}.`,
        className: "success",
      };
    }

    return {
      text: `Your estimated trip is PKR ${Math.abs(
        remainingBudget
      ).toLocaleString()} over budget.`,
      className: "danger",
    };

  }, [form.budget, remainingBudget]);


  /* =========================================================
     NORMALIZE API RESPONSE
  ========================================================= */

  const normalizeResponse = (data) => {

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.transports)) {
      return data.transports;
    }

    if (Array.isArray(data?.hotels)) {
      return data.hotels;
    }

    return [];
  };


  /* =========================================================
     GET TRANSPORT COST
  ========================================================= */

  const getTransportCost = (transport) => {

    return Number(
      transport?.cost ??
        transport?.price ??
        transport?.fare ??
        transport?.total_cost ??
        transport?.price_per_person ??
        0
    );
  };


  /* =========================================================
     GET HOTEL PRICE
  ========================================================= */

  const getHotelPrice = (hotel) => {

    return Number(
      hotel?.price_per_night ??
        hotel?.price ??
        hotel?.nightly_price ??
        hotel?.cost_per_night ??
        hotel?.rate ??
        0
    );
  };


  /* =========================================================
     SEARCH TRANSPORT
  ========================================================= */

  const searchTransport = async () => {

    setTransportError("");
    setTransportSearched(true);
    setTransportResults([]);
    setSelectedTransport(null);

    if (!form.fromCity.trim()) {
      setTransportError(
        "Please select your starting city."
      );
      return [];
    }

    if (!form.destination.trim()) {
      setTransportError(
        "Please select your destination."
      );
      return [];
    }

    if (form.fromCity === form.destination) {
      setTransportError(
        "Starting city and destination cannot be the same."
      );
      return [];
    }

    setTransportLoading(true);

    try {

      let response;

      try {

        response = await axios.get(
          `${API}/budget-transports/search/affordable`,
          {
            params: {
              from_city: form.fromCity,
              to_city: form.destination,
              budget: Number(form.budget || 0),
              passengers: Number(form.passengers || 1),
            },
          }
        );

      } catch {

        console.warn(
          "Affordable transport endpoint failed. Trying normal transport service."
        );

        response = await axios.get(
          `${API}/transports/`
        );
      }


      const results = normalizeResponse(
        response.data
      );


      /* FILTER ROUTE */

      const routeResults = results.filter(
        (transport) => {

          const from =
            transport?.from_city ??
            transport?.from ??
            transport?.source ??
            transport?.departure_city ??
            "";

          const to =
            transport?.to_city ??
            transport?.to ??
            transport?.destination ??
            transport?.arrival_city ??
            "";

          if (from || to) {

            const fromValue =
              String(from).toLowerCase();

            const toValue =
              String(to).toLowerCase();

            const selectedFrom =
              String(form.fromCity).toLowerCase();

            const selectedTo =
              String(form.destination).toLowerCase();

            const fromMatches =
              fromValue === selectedFrom ||
              fromValue.includes(selectedFrom);

            const toMatches =
              toValue === selectedTo ||
              toValue.includes(selectedTo);

            return fromMatches && toMatches;
          }

          return true;
        }
      );


      /* NORMALIZE COST */

      const normalized =
        routeResults
          .map((transport) => ({
            ...transport,
            cost: getTransportCost(transport),
          }))
          .filter(
            (transport) =>
              transport.cost > 0
          );


      /* CHEAPEST FIRST */

      const sorted = [...normalized].sort(
        (a, b) =>
          Number(a.cost) -
          Number(b.cost)
      );


      setTransportResults(sorted);


      /* AUTO SELECT CHEAPEST */

      if (sorted.length > 0) {

        const cheapest = sorted[0];

        setSelectedTransport(
          cheapest
        );

        updateField(
          "transport",
          cheapest.cost
        );

      } else {

        updateField(
          "transport",
          0
        );
      }


      return sorted;

    } catch (error) {

      console.error(
        "Transport search error:",
        error
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      setTransportResults([]);
      setSelectedTransport(null);

      updateField(
        "transport",
        0
      );


      if (
        error?.response?.status === 404
      ) {

        setTransportError(
          "Transport service was not found. Please check your transport API."
        );

      } else if (
        error?.response?.status === 422
      ) {

        setTransportError(
          "Transport search received invalid information."
        );

      } else if (
        error?.response?.status >= 500
      ) {

        setTransportError(
          "Transport service returned a server error."
        );

      } else {

        setTransportError(
          "Unable to load transport options."
        );
      }

      return [];

    } finally {

      setTransportLoading(false);
    }
  };


  /* =========================================================
     SEARCH HOTELS
  ========================================================= */

  const searchHotels = async () => {

    setHotelError("");
    setHotelSearched(true);
    setHotelResults([]);
    setSelectedHotel(null);

    if (!form.destination.trim()) {

      setHotelError(
        "Please select your destination."
      );

      return [];
    }

    setHotelLoading(true);

    try {

      const response = await axios.get(
        `${API}/hotels/`
      );


      const results =
        normalizeResponse(
          response.data
        );


      /* FILTER DESTINATION */

      const destinationHotels =
        results.filter((hotel) => {

          const location =
            hotel?.location ??
            hotel?.city ??
            hotel?.destination ??
            "";

          if (!location) {
            return true;
          }

          return String(location)
            .toLowerCase()
            .includes(
              String(
                form.destination
              ).toLowerCase()
            );
        });


      /* NORMALIZE HOTEL PRICE */

      const normalized =
        destinationHotels
          .map((hotel) => ({
            ...hotel,

            price_per_night:
              getHotelPrice(hotel),
          }))
          .filter(
            (hotel) =>
              Number(
                hotel.price_per_night
              ) > 0
          );


      /* CHEAPEST FIRST */

      const sorted = [...normalized].sort(
        (a, b) =>
          Number(
            a.price_per_night
          ) -
          Number(
            b.price_per_night
          )
      );


      setHotelResults(sorted);


      /* AUTO SELECT CHEAPEST HOTEL */

      if (sorted.length > 0) {

        const cheapest = sorted[0];

        setSelectedHotel(
          cheapest
        );

        const nights = Math.max(
          Number(form.days || 1) - 1,
          1
        );

        /*
         * One room for up to two travelers.
         * This matches the backend calculation.
         */
        const rooms = Math.max(
          Math.ceil(
            Number(form.passengers || 1) / 2
          ),
          1
        );

        const hotelTotal =
          Number(
            cheapest.price_per_night || 0
          ) *
          nights *
          rooms;

        updateField(
          "hotel",
          hotelTotal
        );

      } else {

        updateField(
          "hotel",
          0
        );
      }


      /*
       * IMPORTANT:
       *
       * Food is NOT calculated here anymore.
       *
       * The backend /budget-trip/plan endpoint
       * calculates food according to:
       *
       * persons × days × estimated meal cost
       *
       * and adjusts included hotel meals.
       */


      return sorted;

    } catch (error) {

      console.error(
        "Hotel search error:",
        error
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      setHotelResults([]);
      setSelectedHotel(null);

      updateField(
        "hotel",
        0
      );


      if (
        error?.response?.status === 404
      ) {

        setHotelError(
          "Hotel service was not found. Please check your hotel API."
        );

      } else if (
        error?.response?.status >= 500
      ) {

        setHotelError(
          "Hotel service returned a server error."
        );

      } else {

        setHotelError(
          "Unable to load hotels for this destination."
        );
      }

      return [];

    } finally {

      setHotelLoading(false);
    }
  };


  /* =========================================================
     SELECT TRANSPORT
  ========================================================= */

  const selectTransport = (transport) => {

    setSelectedTransport(
      transport
    );

    updateField(
      "transport",
      Number(
        transport.cost || 0
      )
    );
  };


  /* =========================================================
     SELECT HOTEL
  ========================================================= */

  const selectHotel = (hotel) => {

    setSelectedHotel(
      hotel
    );

    const nights = Math.max(
      Number(form.days || 1) - 1,
      1
    );

    /*
     * One room for up to two travelers.
     */
    const rooms = Math.max(
      Math.ceil(
        Number(form.passengers || 1) / 2
      ),
      1
    );

    const hotelTotal =
      Number(
        hotel.price_per_night || 0
      ) *
      nights *
      rooms;

    updateField(
      "hotel",
      hotelTotal
    );

    /*
     * Food is intentionally NOT changed here.
     *
     * Food is calculated by backend when
     * Generate AI Budget Plan is pressed.
     */
  };


  /* =========================================================
     BUILD AI REQUEST
  ========================================================= */

  const buildAIRequest = () => {

    return {
      location:
        form.destination,

      days:
        Number(form.days),

      persons:
        Number(form.passengers),

      budget:
        Number(form.budget),

      from_city:
        form.fromCity,

      travel_style:
        "budget",

      include_hotel:
        true,

      include_transport:
        true,

      include_food:
        true,

      include_activities:
        true,
    };
  };


  /* =========================================================
     UPDATE FOOD BREAKDOWN
  ========================================================= */

  const updateFoodBreakdown = (data) => {

    const foodCost = Number(
      data?.food_cost || 0
    );

    const persons = Number(
      form.passengers || 1
    );

    const days = Number(
      form.days || 1
    );

    /*
     * Backend budget travel style:
     *
     * PKR 800 per person per day
     *
     * 3 meals per day.
     */

    const dailyFoodPerPerson = 800;

    const mealCostPerPerson =
      dailyFoodPerPerson / 3;

    const breakfastIncluded =
      Boolean(
        data?.breakfast_included
      );

    const dinnerIncluded =
      Boolean(
        data?.dinner_included
      );


    const breakfastCost =
      breakfastIncluded
        ? 0
        : mealCostPerPerson *
          persons *
          days;


    const lunchCost =
      mealCostPerPerson *
      persons *
      days;


    const dinnerCost =
      dinnerIncluded
        ? 0
        : mealCostPerPerson *
          persons *
          days;


    setFoodBreakdown({

      breakfast:
        Math.round(
          breakfastCost
        ),

      lunch:
        Math.round(
          lunchCost
        ),

      dinner:
        Math.round(
          dinnerCost
        ),

      total:
        Math.round(
          foodCost
        ),

      breakfastIncluded,

      dinnerIncluded,
    });
  };


  /* =========================================================
     NORMALIZE AI ITINERARY
  ========================================================= */

  const normalizeItinerary = (
    itinerary
  ) => {

    if (!Array.isArray(itinerary)) {
      return [];
    }

    return itinerary.map(
      (day, index) => {

        const activities =
          Array.isArray(
            day?.activities
          )
            ? day.activities
            : Array.isArray(
                day?.plans
              )
            ? day.plans
            : [];

        return {

          day:
            Number(
              day?.day
            ) ||
            index + 1,

          title:
            day?.title ||
            day?.name ||
            `Explore ${form.destination}`,

          activities:
            activities.map(
              (activity) =>
                typeof activity ===
                "string"
                  ? activity
                  : activity?.name ||
                    activity?.title ||
                    activity?.description ||
                    "Recommended activity"
            ),
        };
      }
    );
  };


  /* =========================================================
     FALLBACK ITINERARY
  ========================================================= */

  const generateFallbackPlan = () => {

    const days = Number(
      form.days
    );

    return Array.from(
      {
        length: Math.min(
          days,
          30
        ),
      },
      (_, index) => {

        const day =
          index + 1;


        if (day === 1) {

          return {

            day,

            title:
              `Travel from ${form.fromCity} to ${form.destination}`,

            activities: [

              `Travel from ${form.fromCity} to ${form.destination}`,

              "Hotel check-in",

              "Explore nearby attractions",

              "Enjoy local food",
            ],
          };
        }


        if (day === days) {

          return {

            day,

            title:
              `Final Day in ${form.destination}`,

            activities: [

              "Visit a final attraction",

              "Shopping / souvenirs",

              `Prepare for return journey to ${form.fromCity}`,
            ],
          };
        }


        return {

          day,

          title:
            `Explore ${form.destination}`,

          activities: [

            "Visit recommended tourist attractions",

            "Enjoy local food",

            "Explore cultural and historical places",
          ],
        };
      }
    );
  };


  /* =========================================================
     GENERATE AI PLAN
  ========================================================= */

  const generatePlan = async () => {

    setAiError("");


    /* VALIDATION */

    if (!CITIES.includes(form.fromCity)) {

      alert(
        "Please select a valid starting city."
      );

      return;
    }


    if (!CITIES.includes(form.destination)) {

      alert(
        "Please select a valid destination."
      );

      return;
    }


    if (form.fromCity === form.destination) {

      alert(
        "Starting city and destination cannot be the same."
      );

      return;
    }


    if (
      !form.budget ||
      Number(form.budget) <= 0
    ) {

      alert(
        "Please enter your total trip budget."
      );

      return;
    }


    if (
      Number(form.days) <= 0
    ) {

      alert(
        "Number of days must be at least 1."
      );

      return;
    }


    if (
      Number(form.passengers) <= 0
    ) {

      alert(
        "Passengers must be at least 1."
      );

      return;
    }


    setAiLoading(true);


    try {

      /* =====================================================
         SEARCH SERVICES FIRST
      ===================================================== */

      await Promise.all([
        searchTransport(),
        searchHotels(),
      ]);


      /* =====================================================
         BUILD REQUEST
      ===================================================== */

      const requestData =
        buildAIRequest();


      console.log(
        "AI Budget Trip Request:",
        requestData
      );


      /* =====================================================
         CALL BACKEND
      ===================================================== */

      let aiResponse;


      try {

        aiResponse =
          await axios.post(
            AI_BUDGET_TRIP_ENDPOINT,
            requestData
          );

      } catch (backendError) {

        console.warn(
          "AI budget endpoint unavailable. Using local itinerary fallback.",
          backendError?.response?.data
        );

        /*
         * Keep fallback behavior.
         */
        aiResponse = null;
      }


      /* =====================================================
         PROCESS BACKEND RESPONSE
      ===================================================== */

      if (aiResponse?.data) {

        const data =
          aiResponse.data;


        console.log(
          "AI Budget Trip Response:",
          data
        );


        /* =================================================
           ITINERARY
        ================================================= */

        const backendItinerary =
          normalizeItinerary(
            data?.itinerary
          );


        if (
          backendItinerary.length > 0
        ) {

          setTripPlan(
            backendItinerary
          );

        } else {

          setTripPlan(
            generateFallbackPlan()
          );
        }


        /* =================================================
           TRANSPORT
        ================================================= */

        if (
          data.transport_cost !=
          null
        ) {

          updateField(
            "transport",
            Number(
              data.transport_cost
            )
          );
        }


        /* =================================================
           HOTEL
        ================================================= */

        if (
          data.hotel_cost !=
          null
        ) {

          updateField(
            "hotel",
            Number(
              data.hotel_cost
            )
          );
        }


        /* =================================================
           FOOD
        ================================================= */

        if (
          data.food_cost !=
          null
        ) {

          const foodCost =
            Number(
              data.food_cost || 0
            );


          updateField(
            "food",
            foodCost
          );


          /*
           * Build breakfast/lunch/dinner
           * breakdown from backend information.
           */

          updateFoodBreakdown(
            data
          );

        } else {

          /*
           * If backend does not return food,
           * clear breakdown.
           */

          setFoodBreakdown({

            breakfast: 0,

            lunch: 0,

            dinner: 0,

            total: 0,

            breakfastIncluded: false,

            dinnerIncluded: false,
          });
        }


        /* =================================================
           ACTIVITIES
        ================================================= */

        if (
          data.activities_cost !=
          null
        ) {

          updateField(
            "activities",
            Number(
              data.activities_cost
            )
          );
        }


        /* =================================================
           MISCELLANEOUS
        ================================================= */

        if (
          data.miscellaneous_cost !=
          null
        ) {

          updateField(
            "other",
            Number(
              data.miscellaneous_cost
            )
          );
        }


      } else {

        /*
         * Backend unavailable.
         *
         * Keep locally selected
         * transport/hotel values.
         */

        setTripPlan(
          generateFallbackPlan()
        );

        /*
         * Local food fallback.
         *
         * Budget style:
         * PKR 800/person/day
         */

        const localFood =
          800 *
          Number(form.passengers || 1) *
          Number(form.days || 1);


        updateField(
          "food",
          localFood
        );


        setFoodBreakdown({

          breakfast:
            Math.round(
              localFood / 3
            ),

          lunch:
            Math.round(
              localFood / 3
            ),

          dinner:
            Math.round(
              localFood / 3
            ),

          total:
            Math.round(
              localFood
            ),

          breakfastIncluded: false,

          dinnerIncluded: false,
        });
      }


      /* =====================================================
         SHOW RESULTS
      ===================================================== */

      setPlanned(true);


      setTimeout(() => {

        document
          .getElementById(
            "trip-results"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });

      }, 300);


    } catch (error) {

      console.error(
        "AI Budget Trip error:",
        error
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );


      setAiError(
        "Unable to generate the AI plan. Your available transport and hotel results are still shown."
      );


      setTripPlan(
        generateFallbackPlan()
      );


      /*
       * Local food fallback.
       */

      const localFood =
        800 *
        Number(form.passengers || 1) *
        Number(form.days || 1);


      updateField(
        "food",
        localFood
      );


      setFoodBreakdown({

        breakfast:
          Math.round(
            localFood / 3
          ),

        lunch:
          Math.round(
            localFood / 3
          ),

        dinner:
          Math.round(
            localFood / 3
          ),

        total:
          Math.round(
            localFood
          ),

        breakfastIncluded: false,

        dinnerIncluded: false,
      });


      setPlanned(true);

    } finally {

      setAiLoading(false);
    }
  };


  /* =========================================================
     RESET
  ========================================================= */

  const resetPlanner = () => {

    setForm({

      fromCity:
        "Bahawalpur",

      destination:
        "",

      days:
        3,

      passengers:
        2,

      budget:
        "",

      transport:
        0,

      hotel:
        0,

      food:
        0,

      activities:
        0,

      other:
        0,
    });


    setFoodBreakdown({

      breakfast: 0,

      lunch: 0,

      dinner: 0,

      total: 0,

      breakfastIncluded: false,

      dinnerIncluded: false,
    });


    setTripPlan([]);
    setPlanned(false);

    setAiLoading(false);
    setAiError("");

    setTransportResults([]);
    setTransportSearched(false);
    setSelectedTransport(null);
    setTransportError("");

    setHotelResults([]);
    setHotelSearched(false);
    setSelectedHotel(null);
    setHotelError("");
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="budget-page">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="budget-hero">

        <div className="budget-hero-overlay">

          <div className="container">

            <div className="budget-hero-content">

              <div className="ai-badge">

                <FaRobot />

                AI-POWERED TRAVEL PLANNER

              </div>


              <h1>
                AI Budget Trip Planner
              </h1>


              <p>
                Plan your city-to-city journey
                with smart budget estimation
                using available transport,
                hotels, food and activities.
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="planner-section">

        <div className="container">

          <div className="planner-grid">


            {/* =================================================
                LEFT — FORM
            ================================================= */}

            <div className="planner-card">


              {/* HEADING */}

              <div className="card-heading">

                <div className="heading-icon">
                  <FaCalculator />
                </div>

                <div>

                  <h2>
                    Build Your Trip
                  </h2>

                  <p>
                    Enter your travel requirements
                  </p>

                </div>

              </div>



              {/* STARTING CITY */}

              <div className="form-group">

                <label>
                  <FaMapMarkerAlt />
                  Starting City
                </label>

                <div className="input-wrapper">

                  <FaMapMarkerAlt />

                  <select
                    value={
                      form.fromCity
                    }
                    onChange={(e) =>
                      updateField(
                        "fromCity",
                        e.target.value
                      )
                    }
                  >

                    {CITIES.map((city) => (

                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>

                    ))}

                  </select>

                </div>

              </div>



              {/* DESTINATION */}

              <div className="form-group">

                <label>
                  <FaMapMarkerAlt />
                  Destination
                </label>

                <div className="input-wrapper">

                  <FaMapMarkerAlt />

                  <select
                    value={
                      form.destination
                    }
                    onChange={(e) =>
                      updateField(
                        "destination",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Destination
                    </option>

                    {CITIES.map((city) => (

                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>

                    ))}

                  </select>

                </div>

              </div>



              {/* DAYS + PASSENGERS */}

              <div className="two-column">

                <div className="form-group">

                  <label>
                    <FaCalendarAlt />
                    Number of Days
                  </label>

                  <div className="input-wrapper">

                    <FaCalendarAlt />

                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={
                        form.days
                      }
                      onChange={(e) =>
                        updateField(
                          "days",
                          Math.max(
                            1,
                            Number(
                              e.target.value
                            )
                          )
                        )
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    <FaUsers />
                    Passengers
                  </label>

                  <div className="input-wrapper">

                    <FaUsers />

                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={
                        form.passengers
                      }
                      onChange={(e) =>
                        updateField(
                          "passengers",
                          Math.max(
                            1,
                            Number(
                              e.target.value
                            )
                          )
                        )
                      }
                    />

                  </div>

                </div>

              </div>



              {/* BUDGET */}

              <div className="form-group">

                <label>
                  <FaMoneyBillWave />
                  Total Trip Budget
                </label>

                <div className="input-wrapper">

                  <span className="currency">
                    PKR
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 100000"
                    value={
                      form.budget
                    }
                    onChange={(e) =>
                      updateField(
                        "budget",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>



              {/* =================================================
                  TRANSPORT
              ================================================= */}

              <div className="service-section">

                <div className="service-heading">

                  <div>

                    <h3>
                      Available Transport
                    </h3>

                    <p>
                      From{" "}
                      {form.fromCity ||
                        "your city"}
                      {" "}to{" "}
                      {form.destination ||
                        "your destination"}
                    </p>

                  </div>

                  <FaBus />

                </div>


                <button
                  type="button"
                  className="service-button"
                  onClick={
                    searchTransport
                  }
                  disabled={
                    transportLoading
                  }
                >

                  {transportLoading ? (

                    <>
                      <FaSpinner className="spin" />
                      Loading Transport...
                    </>

                  ) : (

                    <>
                      <FaSearch />
                      Find Affordable Transport
                    </>

                  )}

                </button>


                {transportError && (

                  <div className="service-error">

                    <FaExclamationTriangle />

                    <span>
                      {transportError}
                    </span>

                  </div>

                )}


                {selectedTransport && (

                  <div className="selected-service">

                    <div className="selected-icon">
                      <FaCheckCircle />
                    </div>

                    <div className="selected-info">

                      <span>
                        SELECTED TRANSPORT
                      </span>

                      <strong>
                        {selectedTransport.transport_type ||
                          selectedTransport.type ||
                          selectedTransport.name ||
                          "Transport"}
                      </strong>

                      <small>
                        {selectedTransport.from_city ||
                          form.fromCity}
                        {" → "}
                        {selectedTransport.to_city ||
                          form.destination}
                      </small>

                    </div>

                    <strong className="selected-price">
                      PKR{" "}
                      {Number(
                        selectedTransport.cost ||
                          0
                      ).toLocaleString()}
                    </strong>

                  </div>

                )}


                {transportSearched && (

                  <div className="service-results">

                    {transportLoading ? (

                      <div className="loading-box">

                        <FaSpinner className="spin" />

                        Finding transport...

                      </div>

                    ) : transportResults.length === 0 ? (

                      !transportError && (

                        <div className="empty-box">

                          <FaBus />

                          <strong>
                            No transport found
                          </strong>

                          <span>
                            No transport service is
                            currently available for{" "}
                            {form.fromCity} →{" "}
                            {form.destination}.
                          </span>

                        </div>

                      )

                    ) : (

                      <>

                        <div className="result-count">

                          {transportResults.length}{" "}
                          transport option
                          {transportResults.length !== 1
                            ? "s"
                            : ""}{" "}
                          found

                        </div>


                        {transportResults.map(
                          (
                            transport,
                            index
                          ) => {

                            const cost =
                              Number(
                                transport.cost ||
                                  0
                              );

                            const selected =
                              selectedTransport ===
                              transport;

                            return (

                              <div
                                className={`service-option ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                                key={
                                  transport.id ||
                                  index
                                }
                              >

                                <div className="service-left">

                                  <div className="option-icon">
                                    <FaBus />
                                  </div>

                                  <div className="option-info">

                                    <strong>
                                      {transport.transport_type ||
                                        transport.type ||
                                        transport.name ||
                                        "Transport"}
                                    </strong>

                                    <span>
                                      {transport.from_city ||
                                        form.fromCity}
                                      {" → "}
                                      {transport.to_city ||
                                        form.destination}
                                    </span>

                                    <small>

                                      {transport.distance_km !=
                                      null
                                        ? `${transport.distance_km} km`
                                        : ""}

                                      {transport.travel_time_hours !=
                                      null
                                        ? ` • ${transport.travel_time_hours} hours`
                                        : ""}

                                    </small>

                                  </div>

                                </div>


                                <div className="option-price">

                                  <strong>
                                    PKR{" "}
                                    {cost.toLocaleString()}
                                  </strong>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      selectTransport(
                                        transport
                                      )
                                    }
                                  >
                                    {selected
                                      ? "Selected"
                                      : "Use"}
                                  </button>

                                </div>

                              </div>

                            );
                          }
                        )}

                      </>

                    )}

                  </div>

                )}

              </div>



              {/* =================================================
                  HOTEL
              ================================================= */}

              <div className="service-section">

                <div className="service-heading">

                  <div>

                    <h3>
                      Available Hotels
                    </h3>

                    <p>
                      Hotels available in{" "}
                      {form.destination ||
                        "your destination"}
                    </p>

                  </div>

                  <FaHotel />

                </div>


                <button
                  type="button"
                  className="service-button hotel-button"
                  onClick={
                    searchHotels
                  }
                  disabled={
                    hotelLoading
                  }
                >

                  {hotelLoading ? (

                    <>
                      <FaSpinner className="spin" />
                      Loading Hotels...
                    </>

                  ) : (

                    <>
                      <FaSearch />
                      Find Affordable Hotel
                    </>

                  )}

                </button>


                {hotelError && (

                  <div className="service-error">

                    <FaExclamationTriangle />

                    <span>
                      {hotelError}
                    </span>

                  </div>

                )}


                {selectedHotel && (

                  <div className="selected-service hotel-selected">

                    <div className="selected-icon hotel-icon">
                      <FaCheckCircle />
                    </div>

                    <div className="selected-info">

                      <span>
                        SELECTED HOTEL
                      </span>

                      <strong>
                        {selectedHotel.name ||
                          "Hotel"}
                      </strong>

                      <small>
                        {selectedHotel.location ||
                          form.destination}
                        {" • "}PKR{" "}
                        {Number(
                          selectedHotel.price_per_night ||
                            0
                        ).toLocaleString()}
                        {" / night"}
                      </small>

                    </div>

                    <strong className="selected-price">
                      PKR{" "}
                      {Number(
                        selectedHotel.price_per_night ||
                          0
                      ).toLocaleString()}
                      /night
                    </strong>

                  </div>

                )}


                {hotelSearched && (

                  <div className="service-results">

                    {hotelLoading ? (

                      <div className="loading-box">

                        <FaSpinner className="spin" />

                        Finding hotels...

                      </div>

                    ) : hotelResults.length === 0 ? (

                      !hotelError && (

                        <div className="empty-box">

                          <FaHotel />

                          <strong>
                            No hotel found
                          </strong>

                          <span>
                            No hotel is currently
                            available in{" "}
                            {form.destination}.
                          </span>

                        </div>

                      )

                    ) : (

                      <>

                        <div className="result-count">

                          {hotelResults.length}{" "}
                          hotel
                          {hotelResults.length !== 1
                            ? "s"
                            : ""}{" "}
                          found

                        </div>


                        {hotelResults.map(
                          (
                            hotel,
                            index
                          ) => {

                            const price =
                              Number(
                                hotel.price_per_night ||
                                  0
                              );

                            const selected =
                              selectedHotel ===
                              hotel;

                            return (

                              <div
                                className={`service-option ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                                key={
                                  hotel.id ||
                                  index
                                }
                              >

                                <div className="service-left">

                                  <div className="option-icon hotel-icon">
                                    <FaHotel />
                                  </div>

                                  <div className="option-info">

                                    <strong>
                                      {hotel.name ||
                                        "Hotel"}
                                    </strong>

                                    <span>
                                      {hotel.location ||
                                        form.destination}
                                    </span>

                                    <small>
                                      PKR{" "}
                                      {price.toLocaleString()}
                                      {" / night"}
                                    </small>

                                  </div>

                                </div>


                                <div className="option-price">

                                  <strong>
                                    PKR{" "}
                                    {price.toLocaleString()}
                                  </strong>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      selectHotel(
                                        hotel
                                      )
                                    }
                                  >
                                    {selected
                                      ? "Selected"
                                      : "Use"}
                                  </button>

                                </div>

                              </div>

                            );
                          }
                        )}

                      </>

                    )}

                  </div>

                )}

              </div>



              {/* =================================================
                  FOOD BUDGET
              ================================================= */}

              <div className="food-budget-card">

                <div className="food-budget-header">

                  <div className="expense-icon">
                    <FaUtensils />
                  </div>

                  <div>

                    <h3>
                      Food Budget
                    </h3>

                    <p>
                      Estimated meals for{" "}
                      {form.passengers} traveler
                      {Number(form.passengers) !== 1
                        ? "s"
                        : ""}{" "}
                      ×{" "}
                      {form.days} day
                      {Number(form.days) !== 1
                        ? "s"
                        : ""}
                    </p>

                  </div>

                </div>


                <div className="meal-breakdown">


                  {/* BREAKFAST */}

                  <div className="meal-row">

                    <span>
                      🍳 Breakfast
                    </span>

                    <strong>

                      {foodBreakdown.breakfastIncluded
                        ? "Included"
                        : `PKR ${Number(
                            foodBreakdown.breakfast || 0
                          ).toLocaleString()}`}

                    </strong>

                  </div>


                  {/* LUNCH */}

                  <div className="meal-row">

                    <span>
                      🍛 Lunch
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        foodBreakdown.lunch || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* DINNER */}

                  <div className="meal-row">

                    <span>
                      🍽️ Dinner
                    </span>

                    <strong>

                      {foodBreakdown.dinnerIncluded
                        ? "Included"
                        : `PKR ${Number(
                            foodBreakdown.dinner || 0
                          ).toLocaleString()}`}

                    </strong>

                  </div>

                </div>


                {/* TOTAL */}

                <div className="food-total-row">

                  <span>
                    Estimated Food Cost
                  </span>

                  <strong>
                    PKR{" "}
                    {Number(
                      form.food || 0
                    ).toLocaleString()}
                  </strong>

                </div>


                <small className="food-note">

                  Food prices are estimates and do
                  not represent live restaurant pricing.

                </small>

              </div>



              {/* =================================================
                  OTHER EXPENSES
              ================================================= */}

              <div className="expense-heading">

                <h3>
                  Other Estimated Expenses
                </h3>

                <p>
                  Transport and hotel are connected
                  automatically with your services.
                </p>

              </div>


              <div className="expense-grid">


                <ExpenseInput
                  icon={<FaTicketAlt />}
                  title="Activities"
                  value={form.activities}
                  onChange={(value) =>
                    updateField(
                      "activities",
                      value
                    )
                  }
                />


                <ExpenseInput
                  icon={<FaPlusCircle />}
                  title="Other Expenses"
                  value={form.other}
                  onChange={(value) =>
                    updateField(
                      "other",
                      value
                    )
                  }
                />


              </div>



              {/* =================================================
                  BUDGET SUMMARY
              ================================================= */}

              <div className="budget-summary">

                <div className="summary-heading">

                  <div className="heading-icon">
                    <FaCalculator />
                  </div>

                  <div>

                    <h3>
                      Trip Cost Summary
                    </h3>

                    <p>
                      Estimated cost based on your selections
                    </p>

                  </div>

                </div>


                <div className="summary-grid">


                  {/* TRANSPORT */}

                  <div className="summary-item">

                    <span>
                      <FaBus />
                      Transport
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.transport || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* HOTEL */}

                  <div className="summary-item">

                    <span>
                      <FaHotel />
                      Hotel
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.hotel || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* FOOD */}

                  <div className="summary-item">

                    <span>
                      <FaUtensils />
                      Food
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.food || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* ACTIVITIES */}

                  <div className="summary-item">

                    <span>
                      <FaTicketAlt />
                      Activities
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.activities || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* OTHER */}

                  <div className="summary-item">

                    <span>
                      <FaPlusCircle />
                      Other
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.other || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                {/* TOTAL */}

                <div className="total-row">

                  <span>
                    Total Estimated Cost
                  </span>

                  <strong>
                    PKR{" "}
                    {totalCost.toLocaleString()}
                  </strong>

                </div>


                {/* DETAILS */}

                <div className="cost-details">


                  <div>

                    <span>
                      Per Person
                    </span>

                    <strong>
                      PKR{" "}
                      {perPerson.toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Per Day
                    </span>

                    <strong>
                      PKR{" "}
                      {dailyCost.toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Remaining Budget
                    </span>

                    <strong
                      className={
                        remainingBudget >= 0
                          ? "positive"
                          : "negative"
                      }
                    >
                      PKR{" "}
                      {Math.abs(
                        remainingBudget
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                {/* STATUS */}

                <div
                  className={`budget-status ${budgetStatus.className}`}
                >
                  {budgetStatus.text}
                </div>

              </div>



              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="planner-actions">

                <button
                  type="button"
                  className="plan-button"
                  onClick={generatePlan}
                  disabled={aiLoading}
                >

                  {aiLoading ? (

                    <>
                      <FaSpinner className="spin" />
                      Creating Your AI Plan...
                    </>

                  ) : (

                    <>
                      <FaRobot />
                      Generate AI Budget Plan
                      <FaArrowRight />
                    </>

                  )}

                </button>


                <button
                  type="button"
                  className="reset-button"
                  onClick={resetPlanner}
                >
                  Reset Planner
                </button>

              </div>


              {aiError && (

                <div className="service-error ai-error">

                  <FaExclamationTriangle />

                  <span>
                    {aiError}
                  </span>

                </div>

              )}

            </div>



            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <div className="planner-sidebar">


              <div className="sidebar-card">

                <div className="sidebar-icon">
                  <FaRoute />
                </div>

                <h3>
                  Smart Trip Planning
                </h3>

                <p>
                  Select your destination, budget,
                  transport and hotel. Our planner
                  calculates your estimated trip cost
                  automatically.
                </p>


                <div className="sidebar-feature">

                  <FaCheckCircle />

                  <span>
                    Affordable transport options
                  </span>

                </div>


                <div className="sidebar-feature">

                  <FaCheckCircle />

                  <span>
                    Budget-friendly hotels
                  </span>

                </div>


                <div className="sidebar-feature">

                  <FaCheckCircle />

                  <span>
                    Breakfast, lunch and dinner estimation
                  </span>

                </div>


                <div className="sidebar-feature">

                  <FaCheckCircle />

                  <span>
                    AI-generated itinerary
                  </span>

                </div>

              </div>



              {/* BUDGET MINI */}

              <div className="sidebar-card budget-mini-card">

                <div className="mini-heading">

                  <FaMoneyBillWave />

                  <span>
                    Your Budget
                  </span>

                </div>


                <strong>
                  PKR{" "}
                  {Number(
                    form.budget || 0
                  ).toLocaleString()}
                </strong>


                <div className="mini-line">

                  <span>
                    Estimated Cost
                  </span>

                  <span>
                    PKR{" "}
                    {totalCost.toLocaleString()}
                  </span>

                </div>


                <div className="mini-line">

                  <span>
                    Remaining
                  </span>

                  <span
                    className={
                      remainingBudget >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    PKR{" "}
                    {Math.abs(
                      remainingBudget
                    ).toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

          </div>



          {/* =====================================================
              TRIP RESULTS
          ===================================================== */}

          {planned && (

            <section
              id="trip-results"
              className="trip-results"
            >


              <div className="results-header">

                <div>

                  <span className="results-badge">

                    <FaRobot />

                    AI GENERATED

                  </span>


                  <h2>
                    Your {form.destination} Trip Plan
                  </h2>


                  <p>

                    {form.days} days •{" "}
                    {form.passengers} passengers •{" "}
                    Budget: PKR{" "}
                    {Number(
                      form.budget || 0
                    ).toLocaleString()}

                  </p>

                </div>

              </div>



              {/* =================================================
                  ITINERARY
              ================================================= */}

              <div className="itinerary-list">

                {tripPlan.length === 0 ? (

                  <div className="empty-box">

                    <FaRoute />

                    <strong>
                      No itinerary available
                    </strong>

                    <span>
                      Please try generating your
                      trip plan again.
                    </span>

                  </div>

                ) : (

                  tripPlan.map((day) => (

                    <div
                      className="day-card"
                      key={day.day}
                    >

                      <div className="day-number">
                        Day {day.day}
                      </div>


                      <div className="day-content">

                        <h3>
                          {day.title}
                        </h3>


                        <div className="activity-list">

                          {day.activities.map(
                            (
                              activity,
                              index
                            ) => (

                              <div
                                className="activity-item"
                                key={index}
                              >

                                <FaCheckCircle />

                                <span>
                                  {activity}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>



              {/* =================================================
                  FOOD BREAKDOWN RESULT
              ================================================= */}

              <div className="food-result-card">

                <div className="food-result-heading">

                  <FaUtensils />

                  <div>

                    <h3>
                      Food Budget Breakdown
                    </h3>

                    <p>
                      Estimated meal expenses for
                      your trip
                    </p>

                  </div>

                </div>


                <div className="food-result-grid">


                  <div className="food-result-item">

                    <span>
                      🍳 Breakfast
                    </span>

                    <strong>

                      {foodBreakdown.breakfastIncluded
                        ? "Included"
                        : `PKR ${Number(
                            foodBreakdown.breakfast || 0
                          ).toLocaleString()}`}

                    </strong>

                  </div>


                  <div className="food-result-item">

                    <span>
                      🍛 Lunch
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        foodBreakdown.lunch || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  <div className="food-result-item">

                    <span>
                      🍽️ Dinner
                    </span>

                    <strong>

                      {foodBreakdown.dinnerIncluded
                        ? "Included"
                        : `PKR ${Number(
                            foodBreakdown.dinner || 0
                          ).toLocaleString()}`}

                    </strong>

                  </div>


                  <div className="food-result-total">

                    <span>
                      Total Food Cost
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.food || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                <p className="food-note">

                  Note: Food prices are estimates and
                  are not intended to represent live
                  restaurant pricing.

                </p>

              </div>



              {/* =================================================
                  FINAL SUMMARY
              ================================================= */}

              <div className="final-trip-summary">


                <div className="final-summary-item">

                  <FaBus />

                  <div>

                    <span>
                      Transport
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.transport || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                <div className="final-summary-item">

                  <FaHotel />

                  <div>

                    <span>
                      Hotel
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.hotel || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                <div className="final-summary-item">

                  <FaUtensils />

                  <div>

                    <span>
                      Food
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.food || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                <div className="final-summary-item">

                  <FaTicketAlt />

                  <div>

                    <span>
                      Activities
                    </span>

                    <strong>
                      PKR{" "}
                      {Number(
                        form.activities || 0
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>


                <div className="final-total">

                  <span>
                    Total Estimated Trip Cost
                  </span>

                  <strong>
                    PKR{" "}
                    {totalCost.toLocaleString()}
                  </strong>

                </div>

              </div>

            </section>

          )}

        </div>

      </section>

    </div>
  );
}


/* =============================================================
   EXPENSE INPUT COMPONENT
============================================================= */

function ExpenseInput({
  icon,
  title,
  value,
  onChange,
}) {

  return (

    <div className="expense-input">

      <div className="expense-icon">
        {icon}
      </div>


      <div className="expense-content">

        <label>
          {title}
        </label>


        <div className="expense-field">

          <span>
            PKR
          </span>

          <input
            type="number"
            min="0"
            value={
              value || ""
            }
            placeholder="0"
            onChange={(e) =>
              onChange(
                Number(
                  e.target.value || 0
                )
              )
            }
          />

        </div>

      </div>

    </div>

  );
}


export default BudgetTrip;
