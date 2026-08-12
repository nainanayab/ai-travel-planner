
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.budget_trip_schema import (
    BudgetTripRequest,
    BudgetTripResponse,
)

from app.models.place import Place
from app.models.hotel import Hotel
from app.models.transport import Transport


router = APIRouter(
    prefix="/budget-trip",
    tags=["Budget Trip"],
)


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
    # FIND TOURIST PLACES
    # =====================================================

    places = (
        db.query(Place)
        .filter(
            Place.location.ilike(
                f"%{request.location}%"
            )
        )
        .all()
    )

    if not places:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No tourist places found for "
                f"{request.location}."
            ),
        )

    # =====================================================
    # HOTEL
    # =====================================================

    hotel_cost = 0

    selected_hotel = None

    if request.include_hotel:

        hotels = (
            db.query(Hotel)
            .filter(
                Hotel.location.ilike(
                    f"%{request.location}%"
                )
            )
            .all()
        )

        if hotels:

            selected_hotel = hotels[0]

            price_per_night = float(
                getattr(
                    selected_hotel,
                    "price_per_night",
                    0,
                )
                or 0
            )

            # Number of nights is normally
            # days - 1 for a trip.
            nights = max(
                request.days - 1,
                1,
            )

            hotel_cost = (
                price_per_night
                * nights
            )

    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_cost = 0

    selected_transport = None

    if request.include_transport:

        transports = (
            db.query(Transport)
            .filter(
                Transport.is_active == True
            )
            .all()
        )

        if transports:

            # Prefer transport matching destination
            destination_transport = [
                transport
                for transport in transports
                if (
                    request.location.lower()
                    in str(
                        transport.from_location or ""
                    ).lower()
                    or
                    request.location.lower()
                    in str(
                        transport.to_location or ""
                    ).lower()
                    or
                    request.location.lower()
                    in str(
                        transport.route or ""
                    ).lower()
                )
            ]

            if destination_transport:

                selected_transport = (
                    destination_transport[0]
                )

            else:

                selected_transport = (
                    transports[0]
                )

            price_per_person = float(
                selected_transport.price_per_person
                or 0
            )

            transport_cost = (
                price_per_person
                * request.persons
            )

    # =====================================================
    # FOOD
    # =====================================================

    food_cost = 0

    if request.include_food:

        food_per_person_per_day = 800

        food_cost = (
            food_per_person_per_day
            * request.persons
            * request.days
        )

    # =====================================================
    # ACTIVITIES
    # =====================================================

    activities_cost = 0

    if request.include_activities:

        activity_per_person_per_day = 300

        activities_cost = (
            activity_per_person_per_day
            * request.persons
            * request.days
        )

    # =====================================================
    # MISCELLANEOUS
    # =====================================================

    miscellaneous_cost = (
        request.budget * 0.05
    )

    # =====================================================
    # TOTAL COST
    # =====================================================

    total_cost = (
        hotel_cost
        + transport_cost
        + food_cost
        + activities_cost
        + miscellaneous_cost
    )

    # =====================================================
    # REMAINING BUDGET
    # =====================================================

    remaining_budget = (
        request.budget
        - total_cost
    )

    # =====================================================
    # BUDGET STATUS
    # =====================================================

    if total_cost > request.budget:

        budget_status = "Over Budget"

    elif total_cost >= request.budget * 0.9:

        budget_status = "Near Budget Limit"

    else:

        budget_status = "Within Budget"

    # =====================================================
    # DISTRIBUTE PLACES ACROSS DAYS
    # =====================================================

    itinerary = []

    total_places = len(places)

    for day in range(
        1,
        request.days + 1,
    ):

        # Divide places reasonably across days.
        start_index = (
            (day - 1)
            * total_places
            // request.days
        )

        end_index = (
            day
            * total_places
            // request.days
        )

        daily_places = places[
            start_index:end_index
        ]

        # Make sure a day does not become empty
        # when there are enough places overall.
        if (
            not daily_places
            and total_places > 0
        ):

            place_index = min(
                day - 1,
                total_places - 1,
            )

            daily_places = [
                places[place_index]
            ]

        # -------------------------------------------------
        # PLACE DATA
        # -------------------------------------------------

        place_list = []

        for place in daily_places:

            place_list.append(
                {
                    "id": place.id,
                    "name": place.name,
                    "location": place.location,
                    "category": place.category,
                }
            )

        itinerary.append(
            {
                "day": day,
                "places": place_list,
            }
        )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "location": request.location,

        "days": request.days,

        "persons": request.persons,

        "budget": request.budget,

        "hotel_cost": hotel_cost,

        "transport_cost": transport_cost,

        "food_cost": food_cost,

        "activities_cost": activities_cost,

        "miscellaneous_cost": miscellaneous_cost,

        "total_cost": total_cost,

        "remaining_budget": remaining_budget,

        "budget_status": budget_status,

        "itinerary": itinerary,
    }
