from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.place import Place
from app.services.map_service import get_trip_route


def save_ai_trip(
    db: Session,
    user_id: int,
    title: str,
    places: list
):

    trip = Trip(
        user_id=user_id,
        title=title,
        start_date="2026-08-01",
        end_date="2026-08-03"
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)


    order = 1

    for place_id in places:

        stop = TripStop(
            trip_id=trip.id,
            place_id=place_id,
            visit_date="2026-08-01",
            order_number=order
        )

        db.add(stop)

        order += 1


    db.commit()
    trip_places = (
    db.query(Place)
    .filter(Place.id.in_(places))
    .all()
)

    return {
    "trip_id": trip.id,
    "title": trip.title,
    "google_maps_route": get_trip_route(trip_places)
}

