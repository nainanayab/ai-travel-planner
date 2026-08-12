from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.trip_stop_schema import TripStopCreate
from app.schemas.trip_stop_schema import TripStopResponse

from app.services.trip_stop_service import (
    create_trip_stop,
    get_trip_stops,
    delete_trip_stop
)


router = APIRouter(
    prefix="/trip-stops",
    tags=["Trip Stops"]
)


@router.post("/")
def add_trip_stop(
    stop: TripStopCreate,
    db: Session = Depends(get_db)
):

    return create_trip_stop(
        db,
        stop
    )




@router.get(
    "/{trip_id}",
    response_model=list[TripStopResponse]
)
def view_trip_stops(
    trip_id: int,
    db: Session = Depends(get_db)
):

    return get_trip_stops(
        db,
        trip_id
    )



@router.delete("/{stop_id}")
def remove_trip_stop(
    stop_id: int,
    db: Session = Depends(get_db)
):

    return delete_trip_stop(
        db,
        stop_id
    )