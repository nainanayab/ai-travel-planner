from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.place import Place

from app.schemas.trip_schema import TripCreate


# =========================================================
# CREATE NORMAL TRIP
# =========================================================

def create_trip(
    db: Session,
    trip: TripCreate,
    user_id: int
):

    new_trip = Trip(
        title=trip.title,
        start_date=trip.start_date,
        end_date=trip.end_date,
        user_id=user_id
    )

    db.add(new_trip)

    db.commit()

    db.refresh(new_trip)

    return new_trip


# =========================================================
# SAVE AI GENERATED INSIDE CITY TRIP
# DAYS AUTOMATICALLY CALCULATED
# =========================================================

def save_ai_trip(
    db: Session,
    user_id: int,
    title: str,
    location: str,
    places: list[int],
    place_ticket_total: float = 0,
    bus_ticket: float = 300,
    total_ticket_cost: float = 300
):

    # =====================================================
    # VALIDATE TITLE
    # =====================================================

    if not title or not title.strip():
        return None

    # =====================================================
    # VALIDATE PLACES
    # =====================================================

    if not places:
        return None

    # =====================================================
    # GET PLACES
    # =====================================================

    db_places = (
        db.query(Place)
        .filter(
            Place.id.in_(places)
        )
        .all()
    )

    if not db_places:
        return None

    # =====================================================
    # KEEP FRONTEND ORDER
    # =====================================================

    place_map = {
        place.id: place
        for place in db_places
    }

    ordered_places = [
        place_map[place_id]
        for place_id in places
        if place_id in place_map
    ]

    if not ordered_places:
        return None

    # =====================================================
    # AUTOMATIC DAYS
    # 1-3 places = 1 day
    # 4-6 places = 2 days
    # 7-9 places = 3 days
    # =====================================================

    days = max(
        1,
        (len(ordered_places) + 2) // 3
    )

    # =====================================================
    # DATES
    # =====================================================

    start_date = date.today()

    end_date = (
        start_date +
        timedelta(days=days - 1)
    )

    # =====================================================
    # CREATE TRIP
    # =====================================================

    trip = Trip(

        user_id=user_id,

        title=title.strip(),

        start_date=start_date.isoformat(),

        end_date=end_date.isoformat(),

        place_ticket_total=float(
            place_ticket_total or 0
        ),

        bus_ticket=float(
            bus_ticket or 300
        ),

        total_ticket_cost=float(
            total_ticket_cost or 0
        )
    )

    db.add(trip)

    db.flush()

    # =====================================================
    # CREATE TRIP STOPS
    # MAX 3 PLACES PER DAY
    # =====================================================

    for index, place in enumerate(
        ordered_places,
        start=1
    ):

        day_number = (
            (index - 1) // 3
        )

        stop_date = (
            start_date +
            timedelta(days=day_number)
        )

        stop = TripStop(

            trip_id=trip.id,

            place_id=place.id,

            visit_date=stop_date.isoformat(),

            visit_time=None,

            order_number=index

        )

        db.add(stop)

    # =====================================================
    # SAVE
    # =====================================================

    try:

        db.commit()

        db.refresh(trip)

    except Exception as e:

        db.rollback()

        print(
            "TRIP SERVICE ERROR:",
            str(e)
        )

        return None

    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Inside City trip saved successfully.",

        "trip_id":
            trip.id,

        "title":
            trip.title,

        "destination":
            location,

        "days":
            days,

        "start_date":
            trip.start_date,

        "end_date":
            trip.end_date,

        "place_ticket_total":
            float(
                trip.place_ticket_total or 0
            ),

        "bus_ticket":
            float(
                trip.bus_ticket or 0
            ),

        "total_ticket_cost":
            float(
                trip.total_ticket_cost or 0
            ),

        "places_saved":
            len(ordered_places)

    }