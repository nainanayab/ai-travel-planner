
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User

from app.schemas.transport_schema import (
    TransportBookingCreate,
    TransportBookingResponse,
)

from app.services.transport_booking_service import (
    create_transport_booking,
    get_user_transport_bookings,
    get_transport_booking,
    cancel_transport_booking,
)

from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/transport-bookings",
    tags=["Transport Booking"],
)


# =========================================================
# CREATE TRANSPORT BOOKING
# =========================================================

@router.post(
    "/",
    response_model=TransportBookingResponse,
)
def create_booking(
    booking: TransportBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Book seats on an active transport service.
    """

    result = create_transport_booking(
        db=db,
        user_id=current_user.id,
        transport_id=booking.transport_id,
        passengers=booking.passengers,
    )

    if not result:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to create transport booking. "
                "Check transport availability and "
                "number of passengers."
            ),
        )

    return result


# =========================================================
# GET MY TRANSPORT BOOKINGS
# =========================================================

@router.get(
    "/",
    response_model=list[TransportBookingResponse],
)
def my_transport_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all transport bookings of the logged-in user.
    """

    return get_user_transport_bookings(
        db=db,
        user_id=current_user.id,
    )


# =========================================================
# GET SINGLE TRANSPORT BOOKING
# =========================================================

@router.get(
    "/{booking_id}",
    response_model=TransportBookingResponse,
)
def single_transport_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get one transport booking belonging to
    the logged-in user.
    """

    result = get_transport_booking(
        db=db,
        booking_id=booking_id,
        user_id=current_user.id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Transport booking not found.",
        )

    return result


# =========================================================
# CANCEL TRANSPORT BOOKING
# =========================================================

@router.delete(
    "/{booking_id}",
    response_model=TransportBookingResponse,
)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancel the logged-in user's transport booking.

    The cancelled passengers' seats are restored
    to the transport service.
    """

    result = cancel_transport_booking(
        db=db,
        booking_id=booking_id,
        user_id=current_user.id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Transport booking not found.",
        )

    return result
