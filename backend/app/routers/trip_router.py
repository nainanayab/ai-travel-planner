from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.trip_schema import TripCreate
from app.services.trip_service import (
    create_trip,
    get_user_trips,
    get_trip,
    delete_trip
)
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


@router.post("/")
def create_new_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_trip(
        db,
        trip,
        current_user.id
    )


@router.get("/")
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_trips(
        db,
        current_user.id
    )


@router.get("/{trip_id}")
def get_single_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_trip(
        db,
        trip_id,
        current_user.id
    )


@router.delete("/{trip_id}")
def remove_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_trip(
        db,
        trip_id,
        current_user.id
    )