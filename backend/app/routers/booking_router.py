
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.booking_schema import (
    BookingCreate,
    HotelBookingCreate,
    BookingResponse,
)

from app.services.booking_service import (
    create_booking,
    create_hotel_booking,
    get_bookings,
    get_place_bookings,
    get_hotel_bookings,
    cancel_booking,
    get_all_bookings,
    update_booking_status,
)

from app.utils.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


# =========================================================
# CREATE PLACE BOOKING
# =========================================================

@router.post(
    "/",
    response_model=BookingResponse,
)
def book_place(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    result = create_booking(
        db=db,
        user_id=current_user.id,
        place_id=booking.place_id,
        visit_date=booking.visit_date,
        persons=booking.persons,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Place not found or invalid booking details.",
        )

    return result


# =========================================================
# CREATE HOTEL BOOKING
# =========================================================

@router.post(
    "/hotel",
    response_model=BookingResponse,
)
def book_hotel(
    booking: HotelBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # -----------------------------------------------------
    # VALIDATE DATES
    # -----------------------------------------------------

    if booking.check_out <= booking.check_in:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date.",
        )

    # -----------------------------------------------------
    # VALIDATE PERSONS
    # -----------------------------------------------------

    if booking.persons < 1:
        raise HTTPException(
            status_code=400,
            detail="Persons must be at least 1.",
        )

    # -----------------------------------------------------
    # VALIDATE ROOMS
    # -----------------------------------------------------

    if booking.rooms < 1:
        raise HTTPException(
            status_code=400,
            detail="Rooms must be at least 1.",
        )

    # -----------------------------------------------------
    # CREATE HOTEL BOOKING
    # -----------------------------------------------------

    result = create_hotel_booking(
        db=db,
        user_id=current_user.id,
        hotel_id=booking.hotel_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        persons=booking.persons,
        rooms=booking.rooms,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found or invalid hotel booking.",
        )

    return result


# =========================================================
# GET ALL MY BOOKINGS
# =========================================================

@router.get(
    "/",
    response_model=list[BookingResponse],
)
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_bookings(
        db=db,
        user_id=current_user.id,
    )


# =========================================================
# GET MY PLACE BOOKINGS ONLY
# =========================================================

@router.get(
    "/my",
    response_model=list[BookingResponse],
)
def my_place_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_place_bookings(
        db=db,
        user_id=current_user.id,
    )


# =========================================================
# GET MY HOTEL BOOKINGS ONLY
# =========================================================

@router.get(
    "/my-hotels",
    response_model=list[BookingResponse],
)
def my_hotel_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_hotel_bookings(
        db=db,
        user_id=current_user.id,
    )


# =========================================================
# CANCEL BOOKING
# =========================================================

@router.delete(
    "/{booking_id}",
    response_model=BookingResponse,
)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    result = cancel_booking(
        db=db,
        booking_id=booking_id,
        user_id=current_user.id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Booking not found.",
        )

    return result


# =========================================================
# ADMIN - GET ALL BOOKINGS
# =========================================================

@router.get(
    "/admin/all",
    response_model=list[BookingResponse],
)
def admin_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required.",
        )

    return get_all_bookings(db)


# =========================================================
# ADMIN - UPDATE BOOKING STATUS
# =========================================================

@router.put(
    "/admin/{booking_id}/status",
    response_model=BookingResponse,
)
def change_booking_status(
    booking_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required.",
        )

    status = status.lower().strip()

    if status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be approved or rejected.",
        )

    result = update_booking_status(
        db=db,
        booking_id=booking_id,
        status=status,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Booking not found.",
        )

    return result
