from sqlalchemy.orm import Session

from app.models.trip_stop import TripStop
from app.schemas.trip_stop_schema import TripStopCreate


def create_trip_stop(
    db: Session,
    stop: TripStopCreate
):

    new_stop = TripStop(
        trip_id=stop.trip_id,
        place_id=stop.place_id,
        visit_date=stop.visit_date,
        visit_time=stop.visit_time,
        order_number=stop.order_number
    )

    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)

    return new_stop



def get_trip_stops(
    db: Session,
    trip_id: int
):

    return (
        db.query(TripStop)
        .filter(
            TripStop.trip_id == trip_id
        )
        .order_by(
            TripStop.order_number
        )
        .all()
    )

   



def delete_trip_stop(
    db: Session,
    stop_id: int
):

    stop = (
        db.query(TripStop)
        .filter(
            TripStop.id == stop_id
        )
        .first()
    )

    if not stop:
        return None

    db.delete(stop)
    db.commit()

    return stop