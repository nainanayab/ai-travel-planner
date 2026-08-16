import os
from math import ceil

from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

from app.models.place import Place
from app.services.route_optimizer import optimize_route


# =========================================================
# LOAD ENVIRONMENT
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
# INSIDE CITY TRIP PLANNER
# =========================================================

def generate_trip_plan(
    db: Session,
    location: str,
    place_ids: list[int],
    category: str = None,
):
    # =====================================================
    # VALIDATE LOCATION
    # =====================================================

    if not location or not location.strip():
        return {
            "error": "Please select a city."
        }

    location = location.strip()

    # =====================================================
    # VALIDATE PLACE IDS
    # =====================================================

    if not place_ids:
        return {
            "error": "Please select at least one destination."
        }

    # Remove duplicate IDs while keeping order
    unique_place_ids = list(
        dict.fromkeys(place_ids)
    )

    # =====================================================
    # FIND SELECTED PLACES
    # =====================================================

    places = (
        db.query(Place)
        .filter(
            Place.id.in_(unique_place_ids)
        )
        .all()
    )

    # =====================================================
    # CHECK IF PLACES WERE FOUND
    # =====================================================

    if not places:
        return {
            "error": "Selected tourist places were not found."
        }

    # =====================================================
    # KEEP ONLY PLACES FROM SELECTED CITY
    # =====================================================

    city_places = [
        place
        for place in places
        if place.location
        and location.lower()
        in place.location.lower()
    ]

    if not city_places:
        return {
            "error": (
                f"The selected destinations are not "
                f"available inside {location}."
            )
        }

    # =====================================================
    # CATEGORY FILTER
    # =====================================================

    if category:
        category = category.strip()

        if category:
            city_places = [
                place
                for place in city_places
                if place.category
                and category.lower()
                in place.category.lower()
            ]

    if not city_places:
        return {
            "error": (
                f"No selected destinations match "
                f"the {category} category."
            )
        }

    # =====================================================
    # PRESERVE USER SELECTION ORDER
    #
    # Database does not guarantee IN(...) order.
    # We restore the order selected by the user.
    # =====================================================

    place_order = {
        place_id: index
        for index, place_id in enumerate(
            unique_place_ids
        )
    }

    city_places.sort(
        key=lambda place: place_order.get(
            place.id,
            999999
        )
    )

    # =====================================================
    # OPTIMIZE ROUTE
    # =====================================================

    try:
        optimized_places = optimize_route(
            city_places
        )

        if optimized_places:
            places = optimized_places
        else:
            places = city_places

    except Exception as e:
        print(
            "Route optimization error:",
            str(e)
        )

        places = city_places

    # =====================================================
    # AUTOMATIC DAYS
    #
    # USER DOES NOT SELECT DAYS.
    #
    # Maximum 3 destinations per day.
    # =====================================================

    calculated_days = ceil(
        len(places) / 3
    )

    # =====================================================
    # TICKET CALCULATION
    # =====================================================

    place_ticket_total = sum(
        float(
            place.ticket_price or 0
        )
        for place in places
    )

    # =====================================================
    # FIXED DOUBLE DECKER BUS TICKET
    # =====================================================

    bus_ticket = 300.0

    # =====================================================
    # TOTAL
    # =====================================================

    total_ticket_cost = (
        place_ticket_total
        + bus_ticket
    )

    # =====================================================
    # PREPARE PLACE INFORMATION FOR AI
    # =====================================================

    place_info_parts = []

    for index, place in enumerate(
        places,
        start=1
    ):
        place_info_parts.append(
            f"""
Stop {index}:
ID: {place.id}
Name: {place.name}
Category: {place.category or "Tourist Attraction"}
Description: {place.description or "No description available."}
Location: {place.location}
Ticket Price: Rs. {float(place.ticket_price or 0):.0f}
"""
        )

    place_info = "\n".join(
        place_info_parts
    )

    # =====================================================
    # AI PROMPT
    # =====================================================

    prompt = f"""
You are an AI Tourism Planner for an
Inside City sightseeing system.

Create a sightseeing itinerary for
{location} using ONLY the selected
tourist destinations provided below.

IMPORTANT RULES:

1. Use ONLY the supplied tourist places.
2. Do NOT invent any place.
3. Keep the entire trip INSIDE {location}.
4. Do NOT add hotels.
5. Do NOT add flights.
6. Do NOT add trains.
7. Do NOT add taxis.
8. Do NOT add cars.
9. Do NOT add rickshaws.
10. Transport between destinations must be:
    Double Decker Bus.
11. Do not repeat any destination.
12. Maximum 3 destinations per day.
13. Automatically divide the selected destinations
    into days.
14. Mention every selected destination.
15. Mention the ticket price of every destination.
16. Explain briefly why each destination is worth visiting.
17. Give one short travel tip for every day.
18. Do not create fake destinations.
19. Keep the visiting order practical.
20. This is an INSIDE CITY trip only.

Selected tourist destinations:

{place_info}

Create the itinerary in this format:

Day 1

1. Place Name
   Ticket: Rs. XXX
   Why visit: ...
   Transport: Double Decker Bus

2. Place Name
   Ticket: Rs. XXX
   Why visit: ...
   Transport: Double Decker Bus

Travel Tip:
...

Day 2

1. Place Name
   Ticket: Rs. XXX
   Why visit: ...
   Transport: Double Decker Bus

Travel Tip:
...

Remember:

- Use only the supplied destinations.
- Do not invent destinations.
- Maximum 3 destinations per day.
- Inside-city only.
- Transport is Double Decker Bus.
"""

    # =====================================================
    # DEFAULT ITINERARY
    # =====================================================

    ai_itinerary = ""

    # =====================================================
    # TRY GEMINI
    # =====================================================

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt
            )

            ai_itinerary = (
                response.text or ""
            ).strip()

        except Exception as e:
            print(
                "Gemini unavailable:",
                str(e)
            )

    # =====================================================
    # FALLBACK ITINERARY
    # =====================================================

    if not ai_itinerary:

        places_per_day = 3

        itinerary_parts = []

        for index, place in enumerate(
            places
        ):
            day = (
                index // places_per_day
            ) + 1

            position = (
                index % places_per_day
            ) + 1

            if position == 1:
                itinerary_parts.append(
                    f"Day {day}\n"
                )

            itinerary_parts.append(
                f"{position}. "
                f"{place.name}\n"
            )

            itinerary_parts.append(
                f"   Ticket: Rs. "
                f"{float(place.ticket_price or 0):.0f}\n"
            )

            itinerary_parts.append(
                "   Why visit: "
                f"{place.description or 'A popular tourist attraction.'}\n"
            )

            itinerary_parts.append(
                "   Transport: "
                "Double Decker Bus\n\n"
            )

            is_last_place_of_day = (
                position == places_per_day
            )

            is_last_place = (
                index == len(places) - 1
            )

            if (
                is_last_place_of_day
                or is_last_place
            ):
                itinerary_parts.append(
                    "Travel Tip:\n"
                    "Use the Double Decker Bus "
                    "for convenient inside-city "
                    "travel between attractions.\n\n"
                )

        ai_itinerary = "".join(
            itinerary_parts
        ).strip()

    # =====================================================
    # BUILD PLACE RESPONSE
    # =====================================================

    place_data = []

    for place in places:
        place_data.append(
            {
                "id": place.id,

                "name": place.name,

                "category": (
                    place.category
                    or "Tourist Attraction"
                ),

                "description": (
                    place.description
                    or ""
                ),

                "location": (
                    place.location
                    or location
                ),

                "image_url": (
                    place.image_url
                    or ""
                ),

                "latitude": place.latitude,

                "longitude": place.longitude,

                "ticket_price": float(
                    place.ticket_price
                    or 0
                ),
            }
        )

    # =====================================================
    # RETURN RESULT
    # =====================================================

    return {
        "destination": location,

        # Automatically calculated.
        # User does NOT select this.
        "days": calculated_days,

        "category": (
            category
            if category
            else None
        ),

        "transport": "Double Decker Bus",

        "bus_ticket": bus_ticket,

        "place_ticket_total": (
            place_ticket_total
        ),

        "total_ticket_cost": (
            total_ticket_cost
        ),

        "places": place_data,

        "ai_itinerary": ai_itinerary,
    }