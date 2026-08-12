from sqlalchemy.orm import Session

from app.models.transport import Transport
from app.models.transport_booking import TransportBooking


# =========================================================
# CREATE TRANSPORT BOOKING
# =========================================================

def create_transport_booking(
    db: Session,
    user_id: int,
    transport_id: int,
    passengers: int,
):

    # -----------------------------------------------------
    # VALIDATE PASSENGERS
    # -----------------------------------------------------

    if passengers < 1:
        return None

    # -----------------------------------------------------
    # FIND TRANSPORT
    # -----------------------------------------------------

    transport = (
        db.query(Transport)
        .filter(
            Transport.id == transport_id,
            Transport.is_active == True,
        )
        .first()
    )

    if not transport:
        return None

    # -----------------------------------------------------
    # CHECK AVAILABLE SEATS
    # -----------------------------------------------------

    available_seats = transport.available_seats or 0

    if passengers > available_seats:
        return None

    # -----------------------------------------------------
    # PRICE
    # -----------------------------------------------------

    price_per_person = transport.price_per_person or 0

    total_price = passengers * price_per_person

    # -----------------------------------------------------
    # CREATE BOOKING
    # -----------------------------------------------------

    booking = TransportBooking(
        user_id=user_id,
        transport_id=transport_id,
        passengers=passengers,
        price_per_person=price_per_person,
        total_price=total_price,
        status="Pending",
    )

    # -----------------------------------------------------
    # REDUCE AVAILABLE SEATS
    # -----------------------------------------------------

    transport.available_seats = (
        available_seats - passengers
    )

    transport.available = (
        transport.available_seats
    )

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    db.add(booking)

    db.commit()

    db.refresh(booking)

    return booking


# =========================================================
# GET MY TRANSPORT BOOKINGS
# =========================================================

def get_user_transport_bookings(
    db: Session,
    user_id: int,
):

    return (
        db.query(TransportBooking)
        .filter(
            TransportBooking.user_id == user_id
        )
        .order_by(
            TransportBooking.created_at.desc()
        )
        .all()
    )


# =========================================================
# GET SINGLE TRANSPORT BOOKING
# =========================================================

def get_transport_booking(
    db: Session,
    booking_id: int,
    user_id: int,
):

    return (
        db.query(TransportBooking)
        .filter(
            TransportBooking.id == booking_id,
            TransportBooking.user_id == user_id,
        )
        .first()
    )