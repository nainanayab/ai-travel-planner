
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.place import Place
from app.models.hotel import Hotel


# ==========================================
# HELPER - BUILD BOOKING RESPONSE
# ==========================================

def build_booking_response(
    db: Session,
    booking: Booking
):
    place_name = None
    hotel_name = None

    # ==========================================
    # PLACE NAME
    # ==========================================

    if booking.place_id is not None:

        place = (
            db.query(Place)
            .filter(Place.id == booking.place_id)
            .first()
        )

        if place:
            place_name = place.name

    # ==========================================
    # HOTEL NAME
    # ==========================================

    if booking.hotel_id is not None:

        hotel = (
            db.query(Hotel)
            .filter(Hotel.id == booking.hotel_id)
            .first()
        )

        if hotel:
            hotel_name = hotel.name

    # ==========================================
    # COMPLETE RESPONSE
    # ==========================================

    return {
        "id": booking.id,

        "user_id": booking.user_id,

        # Place
        "place_id": booking.place_id,
        "place_name": place_name,

        # Hotel
        "hotel_id": booking.hotel_id,
        "hotel_name": hotel_name,

        # Place booking
        "visit_date": booking.visit_date,

        # Hotel booking
        "check_in": booking.check_in,
        "check_out": booking.check_out,

        # People / rooms
        "persons": booking.persons,
        "rooms": booking.rooms,

        # Hotel pricing
        "nights": booking.nights,
        "price_per_night": booking.price_per_night,
        "total_price": booking.total_price,

        # Status
        "status": booking.status,

        # Created
        "created_at": booking.created_at,
    }


# ==========================================
# CREATE PLACE BOOKING
# ==========================================

def create_booking(
    db: Session,
    user_id: int,
    place_id: int,
    visit_date,
    persons: int
):

    # ==========================================
    # VALIDATE PERSONS
    # ==========================================

    if persons < 1:
        return None

    # ==========================================
    # CHECK PLACE EXISTS
    # ==========================================

    place = (
        db.query(Place)
        .filter(Place.id == place_id)
        .first()
    )

    if not place:
        return None

    # ==========================================
    # CREATE PLACE BOOKING
    # ==========================================

    booking = Booking(
        user_id=user_id,
        place_id=place_id,
        visit_date=visit_date,
        persons=persons,
        status="Pending",
    )

    # ==========================================
    # SAVE
    # ==========================================

    db.add(booking)

    db.commit()

    db.refresh(booking)

    # ==========================================
    # RETURN COMPLETE RESPONSE
    # ==========================================

    return build_booking_response(
        db,
        booking
    )


# ==========================================
# CREATE HOTEL BOOKING
# ==========================================

def create_hotel_booking(
    db: Session,
    user_id: int,
    hotel_id: int,
    check_in,
    check_out,
    persons: int,
    rooms: int
):

    # ==========================================
    # CHECK HOTEL EXISTS
    # ==========================================

    hotel = (
        db.query(Hotel)
        .filter(Hotel.id == hotel_id)
        .first()
    )

    if not hotel:
        return None

    # ==========================================
    # VALIDATE PERSONS
    # ==========================================

    if persons < 1:
        return None

    # ==========================================
    # VALIDATE ROOMS
    # ==========================================

    if rooms < 1:
        return None

    # ==========================================
    # CALCULATE NIGHTS
    # ==========================================

    nights = (
        check_out - check_in
    ).days

    if nights <= 0:
        return None

    # ==========================================
    # HOTEL PRICE
    # ==========================================

    price_per_night = (
        hotel.price_per_night or 0
    )

    # ==========================================
    # TOTAL PRICE
    #
    # price × nights × rooms
    # ==========================================

    total_price = (
        price_per_night
        * nights
        * rooms
    )

    # ==========================================
    # CREATE HOTEL BOOKING
    # ==========================================

    booking = Booking(

        user_id=user_id,

        hotel_id=hotel_id,

        check_in=check_in,

        check_out=check_out,

        persons=persons,

        rooms=rooms,

        nights=nights,

        price_per_night=price_per_night,

        total_price=total_price,

        status="Pending",
    )

    # ==========================================
    # SAVE
    # ==========================================

    db.add(booking)

    db.commit()

    db.refresh(booking)

    # ==========================================
    # RETURN COMPLETE RESPONSE
    # ==========================================

    return build_booking_response(
        db,
        booking
    )


# ==========================================
# GET USER BOOKINGS
# ==========================================

def get_bookings(
    db: Session,
    user_id: int
):

    bookings = (
        db.query(Booking)
        .filter(
            Booking.user_id == user_id
        )
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

    return [
        build_booking_response(
            db,
            booking
        )
        for booking in bookings
    ]


# ==========================================
# CANCEL BOOKING
# ==========================================

def cancel_booking(
    db: Session,
    booking_id: int,
    user_id: int
):

    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.user_id == user_id
        )
        .first()
    )

    if not booking:
        return None

    # ==========================================
    # ALREADY CANCELLED
    # ==========================================

    if (
        booking.status
        and booking.status.lower()
        == "cancelled"
    ):
        return build_booking_response(
            db,
            booking
        )

    # ==========================================
    # CANCEL
    # ==========================================

    booking.status = "Cancelled"

    db.commit()

    db.refresh(booking)

    return build_booking_response(
        db,
        booking
    )


# ==========================================
# GET ALL BOOKINGS - ADMIN
# ==========================================

def get_all_bookings(
    db: Session
):

    bookings = (
        db.query(Booking)
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

    return [
        build_booking_response(
            db,
            booking
        )
        for booking in bookings
    ]


# ==========================================
# UPDATE BOOKING STATUS - ADMIN
# ==========================================

def update_booking_status(
    db: Session,
    booking_id: int,
    status: str
):

    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id
        )
        .first()
    )

    if not booking:
        return None

    # ==========================================
    # UPDATE STATUS
    # ==========================================

    booking.status = status

    db.commit()

    db.refresh(booking)

    return build_booking_response(
        db,
        booking
    )


