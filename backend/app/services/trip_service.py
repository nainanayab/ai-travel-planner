from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.schemas.trip_schema import TripCreate


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


def get_user_trips(
    db: Session,
    user_id: int
):

    return (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .all()
    )


def get_trip(
    db: Session,
    trip_id: int,
    user_id: int
):

    return (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == user_id
        )
        .first()
    )


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

    db.delete(trip)
    db.commit()

    return trip