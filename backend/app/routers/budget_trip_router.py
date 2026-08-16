import os
import json
import re

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google import genai

from app.db.database import get_db

from app.schemas.budget_trip_schema import (
    BudgetTripRequest,
    BudgetTripResponse,
)

from app.models.place import Place
from app.models.hotel import Hotel
from app.models.budget_transport import BudgetTransport


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()


# =========================================================
# GEMINI CLIENT
# =========================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None

if GEMINI_API_KEY:
    client = genai.Client(
        api_key=GEMINI_API_KEY
    )


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/budget-trip",
    tags=["Budget Trip"],
)


# =========================================================
# HELPER — EXTRACT JSON FROM GEMINI
# =========================================================

def extract_json(text: str):

    if not text:
        return None

    text = text.strip()

    # Remove markdown code fences
    text = re.sub(
        r"```json\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"```\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = text.strip()

    # Try direct JSON
    try:
        return json.loads(text)
    except Exception:
        pass

    # Try extracting JSON object
    match = re.search(
        r"\{.*\}",
        text,
        re.DOTALL,
    )

    if match:

        try:
            return json.loads(
                match.group(0)
            )
        except Exception:
            pass

    return None


# =========================================================
# CREATE AI BUDGET TRIP
# =========================================================

@router.post(
    "/plan",
    response_model=BudgetTripResponse,
)
def create_budget_trip(
    request: BudgetTripRequest,
    db: Session = Depends(get_db),
):

    # =====================================================
    # CLEAN INPUT
    # =====================================================

    location = request.location.strip()

    from_city = request.from_city.strip()

    travel_style = (
        request.travel_style
        .strip()
        .lower()
    )


    # =====================================================
    # VALIDATION
    # =====================================================

    if not location:

        raise HTTPException(
            status_code=400,
            detail="Destination is required.",
        )


    if not from_city:

        raise HTTPException(
            status_code=400,
            detail="Starting city is required.",
        )


    if request.days < 1:

        raise HTTPException(
            status_code=400,
            detail="Days must be at least 1.",
        )


    if request.persons < 1:

        raise HTTPException(
            status_code=400,
            detail="Persons must be at least 1.",
        )


    if request.budget <= 0:

        raise HTTPException(
            status_code=400,
            detail="Budget must be greater than 0.",
        )


    if travel_style not in [
        "budget",
        "standard",
        "luxury",
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid travel style. "
                "Use budget, standard, or luxury."
            ),
        )


    # =====================================================
    # FIND PLACES
    # =====================================================

    places = (
        db.query(Place)
        .filter(
            Place.location.ilike(
                f"%{location}%"
            )
        )
        .limit(
            max(request.days * 3, 6)
        )
        .all()
    )


    if not places:

        raise HTTPException(
            status_code=404,
            detail=(
                f"No tourist places found "
                f"for {location}."
            ),
        )


    # =====================================================
    # HOTEL
    # =====================================================

    hotel_cost = 0.0

    hotel_name = None

    breakfast_included = False

    dinner_included = False

    wifi_included = False

    selected_hotel = None


    if request.include_hotel:

        hotels = (
            db.query(Hotel)
            .filter(
                Hotel.location.ilike(
                    f"%{location}%"
                )
            )
            .order_by(
                Hotel.price_per_night.asc()
            )
            .all()
        )


        if hotels:

            selected_hotel = hotels[0]

            hotel_name = (
                selected_hotel.name
            )


            price_per_night = float(
                selected_hotel.price_per_night
                or 0
            )


            # One room for two persons
            rooms = max(
                (request.persons + 1) // 2,
                1,
            )


            nights = max(
                request.days - 1,
                1,
            )


            hotel_cost = (
                price_per_night
                * nights
                * rooms
            )


            breakfast_included = bool(
                getattr(
                    selected_hotel,
                    "breakfast_included",
                    False,
                )
            )


            dinner_included = bool(
                getattr(
                    selected_hotel,
                    "dinner_included",
                    False,
                )
            )


            wifi_included = bool(
                getattr(
                    selected_hotel,
                    "wifi_included",
                    False,
                )
            )


    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_cost = 0.0

    transport_options = []

    selected_transport = None


    if request.include_transport:

        transports = (
            db.query(BudgetTransport)
            .filter(
                BudgetTransport.from_city.ilike(
                    from_city
                ),
                BudgetTransport.to_city.ilike(
                    location
                ),
                BudgetTransport.cost.isnot(None),
            )
            .order_by(
                BudgetTransport.cost.asc()
            )
            .all()
        )


        for transport in transports:

            transport_options.append(
                {
                    "id": transport.id,

                    "from_city":
                        transport.from_city,

                    "to_city":
                        transport.to_city,

                    "transport_type":
                        transport.transport_type,

                    "distance_km":
                        float(
                            transport.distance_km
                            or 0
                        ),

                    "travel_time_hours":
                        float(
                            transport.travel_time_hours
                            or 0
                        ),

                    "cost":
                        float(
                            transport.cost
                            or 0
                        ),
                }
            )


        if transports:

            selected_transport = (
                transports[0]
            )


            one_person_cost = float(
                selected_transport.cost
                or 0
            )


            transport_cost = (
                one_person_cost
                * request.persons
            )


    # =====================================================
    # FOOD COST
    # =====================================================

    food_cost = 0.0


    if request.include_food:

        if travel_style == "luxury":

            food_per_person_day = 2000

        elif travel_style == "standard":

            food_per_person_day = 1200

        else:

            food_per_person_day = 800


        meals_per_day = 3


        included_meals = 0


        if breakfast_included:

            included_meals += 1


        if dinner_included:

            included_meals += 1


        payable_meals = (
            meals_per_day
            - included_meals
        )


        meal_cost = (
            food_per_person_day
            / meals_per_day
        )


        food_cost = (
            meal_cost
            * payable_meals
            * request.persons
            * request.days
        )


    # =====================================================
    # ACTIVITIES COST
    # =====================================================

    activities_cost = 0.0


    if request.include_activities:

        if travel_style == "luxury":

            activity_per_person_day = 800

        elif travel_style == "standard":

            activity_per_person_day = 500

        else:

            activity_per_person_day = 300


        activities_cost = (
            activity_per_person_day
            * request.persons
            * request.days
        )


    # =====================================================
    # MISCELLANEOUS
    # =====================================================

    miscellaneous_cost = round(
        float(request.budget) * 0.05,
        2,
    )


    # =====================================================
    # INITIAL TOTAL
    # =====================================================

    total_cost = (
        hotel_cost
        + transport_cost
        + food_cost
        + activities_cost
        + miscellaneous_cost
    )


    remaining_budget = (
        float(request.budget)
        - total_cost
    )


    # =====================================================
    # BUDGET STATUS
    # =====================================================

    if total_cost > request.budget:

        budget_status = "Over Budget"

    elif total_cost >= (
        request.budget * 0.90
    ):

        budget_status = (
            "Near Budget Limit"
        )

    else:

        budget_status = "Within Budget"


    # =====================================================
    # PLACES FOR AI
    # =====================================================

    place_info = []


    for place in places:

        place_info.append(
            {
                "name": place.name,

                "category":
                    place.category,

                "description":
                    place.description,

                "location":
                    place.location,
            }
        )


    # =====================================================
    # AI ITINERARY
    # =====================================================

    itinerary = []


    # =====================================================
    # FALLBACK ITINERARY
    # =====================================================

    def create_fallback_itinerary():

        fallback = []

        total_places = len(
            places
        )


        for day in range(
            1,
            request.days + 1,
        ):

            if total_places > 0:

                place_index = min(
                    day - 1,
                    total_places - 1,
                )

                selected_place = (
                    places[place_index]
                )


                place_name = (
                    selected_place.name
                )

            else:

                place_name = (
                    f"Explore {location}"
                )


            if day == 1:

                title = (
                    "Arrival and "
                    "City Exploration"
                )

                activities = [

                    (
                        f"Travel from "
                        f"{from_city} to "
                        f"{location}"
                    ),

                    (
                        f"Check in at "
                        f"{hotel_name or 'your hotel'}"
                    ),

                    (
                        f"Visit {place_name}"
                    ),

                    "Enjoy local food",
                ]


            elif day == request.days:

                title = (
                    "Final Day and "
                    "Return Journey"
                )

                activities = [

                    (
                        f"Visit {place_name}"
                    ),

                    "Shopping and souvenirs",

                    (
                        f"Prepare for return "
                        f"journey to {from_city}"
                    ),
                ]


            else:

                title = (
                    f"Explore {location}"
                )

                activities = [

                    (
                        f"Visit {place_name}"
                    ),

                    "Explore local culture",

                    "Enjoy local food",

                    "Visit nearby attractions",
                ]


            fallback.append(
                {
                    "day": day,

                    "title": title,

                    "activities": activities,
                }
            )


        return fallback


    # =====================================================
    # CALL GEMINI
    # =====================================================

    if client:

        try:

            hotel_info = {

                "name":
                    hotel_name,

                "price_per_night":
                    (
                        float(
                            selected_hotel
                            .price_per_night
                            or 0
                        )
                        if selected_hotel
                        else 0
                    ),

                "breakfast":
                    breakfast_included,

                "dinner":
                    dinner_included,

                "wifi":
                    wifi_included,
            }


            prompt = f"""
You are an AI tourism budget planner.

Create a realistic {request.days}-day
budget travel itinerary.

TRIP INFORMATION

Starting city:
{from_city}

Destination:
{location}

Travelers:
{request.persons}

Budget:
PKR {request.budget}

Travel style:
{travel_style}


SELECTED HOTEL

{json.dumps(hotel_info, indent=2)}


TRANSPORT OPTIONS

{json.dumps(
    transport_options,
    indent=2
)}


AVAILABLE TOURIST PLACES

{json.dumps(
    place_info,
    indent=2
)}


CURRENT ESTIMATED COSTS

Hotel:
PKR {hotel_cost}

Transport:
PKR {transport_cost}

Food:
PKR {food_cost}

Activities:
PKR {activities_cost}

Miscellaneous:
PKR {miscellaneous_cost}

Total:
PKR {total_cost}

Remaining:
PKR {remaining_budget}


IMPORTANT INSTRUCTIONS

1. Create exactly {request.days} days.

2. Use only the tourist places
   provided above.

3. Do not invent tourist places.

4. Keep the plan suitable for the
   user's budget.

5. Include arrival/travel information
   on Day 1.

6. Include return journey information
   on the final day.

7. Give practical activities.

8. Keep activities short and clear.

9. Return ONLY valid JSON.

10. Do not use markdown.

Use exactly this JSON format:

{{
  "itinerary": [
    {{
      "day": 1,
      "title": "Arrival and Exploration",
      "activities": [
        "Activity 1",
        "Activity 2",
        "Activity 3"
      ]
    }}
  ]
}}
"""


            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )


            ai_data = extract_json(
                response.text
            )


            if ai_data:

                ai_itinerary = (
                    ai_data.get(
                        "itinerary",
                        []
                    )
                )


                if isinstance(
                    ai_itinerary,
                    list
                ):

                    for index, day_data in enumerate(
                        ai_itinerary
                    ):

                        activities = (
                            day_data.get(
                                "activities",
                                []
                            )
                        )


                        if not isinstance(
                            activities,
                            list
                        ):

                            activities = []


                        itinerary.append(
                            {
                                "day":
                                    int(
                                        day_data.get(
                                            "day",
                                            index + 1
                                        )
                                    ),

                                "title":
                                    day_data.get(
                                        "title",
                                        f"Explore {location}"
                                    ),

                                "activities":
                                    [
                                        str(activity)
                                        for activity
                                        in activities
                                    ],
                            }
                        )


        except Exception as e:

            print(
                "Gemini budget planner error:",
                e
            )


    # =====================================================
    # USE FALLBACK IF AI FAILED
    # =====================================================

    if not itinerary:

        itinerary = (
            create_fallback_itinerary()
        )


    # =====================================================
    # ENSURE CORRECT NUMBER OF DAYS
    # =====================================================

    if len(itinerary) < request.days:

        fallback = (
            create_fallback_itinerary()
        )


        existing_days = {
            item["day"]
            for item in itinerary
        }


        for item in fallback:

            if item["day"] not in existing_days:

                itinerary.append(item)


    # Keep only requested days
    itinerary = sorted(
        itinerary,
        key=lambda item:
            item["day"]
    )[:request.days]


    # =====================================================
    # ROUND VALUES
    # =====================================================

    hotel_cost = round(
        hotel_cost,
        2,
    )

    transport_cost = round(
        transport_cost,
        2,
    )

    food_cost = round(
        food_cost,
        2,
    )

    activities_cost = round(
        activities_cost,
        2,
    )

    miscellaneous_cost = round(
        miscellaneous_cost,
        2,
    )

    total_cost = round(
        total_cost,
        2,
    )

    remaining_budget = round(
        remaining_budget,
        2,
    )


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return {

        "location":
            location,

        "days":
            request.days,

        "persons":
            request.persons,

        "budget":
            float(request.budget),

        "hotel_name":
            hotel_name,

        "breakfast_included":
            breakfast_included,

        "dinner_included":
            dinner_included,

        "wifi_included":
            wifi_included,

        "hotel_cost":
            hotel_cost,

        "transport_cost":
            transport_cost,

        "transport_options":
            transport_options,

        "food_cost":
            food_cost,

        "activities_cost":
            activities_cost,

        "miscellaneous_cost":
            miscellaneous_cost,

        "total_cost":
            total_cost,

        "remaining_budget":
            remaining_budget,

        "budget_status":
            budget_status,

        "itinerary":
            itinerary,
    }
