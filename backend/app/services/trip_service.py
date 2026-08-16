from datetime import date

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
    # VALIDATE
    # =====================================================

    if not title or not title.strip():
        return None

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
    # INSIDE CITY DATE
    # =====================================================
    # Inside City trip does not use trip duration/days.
    # Today's date is used only for database compatibility.

    trip_date = date.today()

    # =====================================================
    # CREATE TRIP
    # =====================================================

    trip = Trip(
        user_id=user_id,

        title=title,

        start_date=trip_date.isoformat(),

        end_date=trip_date.isoformat(),

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
    # =====================================================

    for index, place in enumerate(
        ordered_places,
        start=1
    ):

        stop = TripStop(
            trip_id=trip.id,

            place_id=place.id,

            visit_date=trip_date.isoformat(),

            visit_time=None,

            order_number=index
        )

        db.add(stop)

    # =====================================================
    # COMMIT
    # =====================================================

    db.commit()

    db.refresh(trip)

    # =====================================================
    # RETURN SAVED TRIP
    # =====================================================

    return {
        "message": "Inside City trip saved successfully.",

        "trip_id": trip.id,

        "title": trip.title,

        "destination": location,

        "start_date": trip.start_date,

        "end_date": trip.end_date,

        "place_ticket_total": float(
            trip.place_ticket_total or 0
        ),

        "bus_ticket": float(
            trip.bus_ticket or 0
        ),

        "total_ticket_cost": float(
            trip.total_ticket_cost or 0
        ),

        "places_saved": len(ordered_places)
    }


# =========================================================
# GET USER TRIPS
# =========================================================

def get_user_trips(
    db: Session,
    user_id: int
):

    trips = (
        db.query(Trip)
        .filter(
            Trip.user_id == user_id
        )
        .order_by(
            Trip.created_at.desc()
        )
        .all()
    )

    result = []

    for trip in trips:

        # =================================================
        # GET STOPS
        # =================================================

        stops = (
            db.query(TripStop)
            .filter(
                TripStop.trip_id == trip.id
            )
            .order_by(
                TripStop.order_number.asc()
            )
            .all()
        )

        # =================================================
        # BUILD PLACES
        # =================================================

        trip_places = []

        for stop in stops:

            place = stop.place

            if not place:
                continue

            trip_places.append({

                "stop_id": stop.id,

                "place_id": place.id,

                "name": place.name,

                "location": place.location,

                "description": place.description,

                "image_url": place.image_url,

                "category": place.category,

                "latitude": place.latitude,

                "longitude": place.longitude,

                "visit_date": stop.visit_date,

                "visit_time": stop.visit_time,

                "order_number": stop.order_number,

                "ticket_price": float(
                    getattr(
                        place,
                        "ticket_price",
                        0
                    ) or 0
                )
            })

        # =================================================
        # TRIP RESPONSE
        # =================================================

        result.append({

            "id": trip.id,

            "title": trip.title,

            "start_date": trip.start_date,

            "end_date": trip.end_date,

            "place_ticket_total": float(
                trip.place_ticket_total or 0
            ),

            "bus_ticket": float(
                trip.bus_ticket or 0
            ),

            "total_ticket_cost": float(
                trip.total_ticket_cost or 0
            ),

            "created_at": (
                trip.created_at.isoformat()
                if trip.created_at
                else None
            ),

            "places": trip_places
        })

    return result


# =========================================================
# GET SINGLE TRIP
# =========================================================

def get_trip(
    db: Session,
    trip_id: int,
    user_id: int
):

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )

    if not trip:
        return None

    # =====================================================
    # GET STOPS
    # =====================================================

    stops = (
        db.query(TripStop)
        .filter(
            TripStop.trip_id == trip.id
        )
        .order_by(
            TripStop.order_number.asc()
        )
        .all()
    )

    # =====================================================
    # BUILD PLACES
    # =====================================================

    trip_places = []

    for stop in stops:

        place = stop.place

        if not place:
            continue

        trip_places.append({

            "stop_id": stop.id,

            "place_id": place.id,

            "name": place.name,

            "location": place.location,

            "description": place.description,

            "image_url": place.image_url,

            "category": place.category,

            "latitude": place.latitude,

            "longitude": place.longitude,

            "visit_date": stop.visit_date,

            "visit_time": stop.visit_time,

            "order_number": stop.order_number,

            "ticket_price": float(
                getattr(
                    place,
                    "ticket_price",
                    0
                ) or 0
            )
        })

    # =====================================================
    # RETURN SINGLE TRIP
    # =====================================================

    return {

        "id": trip.id,

        "title": trip.title,

        "start_date": trip.start_date,

        "end_date": trip.end_date,

        "place_ticket_total": float(
            trip.place_ticket_total or 0
        ),

        "bus_ticket": float(
            trip.bus_ticket or 0
        ),

        "total_ticket_cost": float(
            trip.total_ticket_cost or 0
        ),

        "created_at": (
            trip.created_at.isoformat()
            if trip.created_at
            else None
        ),

        "places": trip_places
    }


# =========================================================
# DELETE TRIP
# =========================================================

def delete_trip(
    db: Session,
    trip_id: int,
    user_id: int
):

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )

    if not trip:
        return None

    # =====================================================
    # DELETE STOPS FIRST
    # =====================================================

    db.query(TripStop).filter(
        TripStop.trip_id == trip.id
    ).delete(
        synchronize_session=False
    )

    # =====================================================
    # DELETE TRIP
    # =====================================================

    db.delete(trip)

    db.commit()

    return {
        "message": "Trip deleted successfully.",

        "trip_id": trip_id
    }