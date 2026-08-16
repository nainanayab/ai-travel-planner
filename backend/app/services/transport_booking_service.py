
from sqlalchemy.orm import Session

from app.models.transport import Transport
from app.models.transport_booking import TransportBooking


# =========================================================
# ATTACH TRANSPORT DETAILS
# =========================================================

def attach_transport_details(booking):

    transport = booking.transport

    if not transport:
        return booking

    booking.transport_company = (
        transport.company_name
        or transport.company
        or "Transport"
    )

    booking.transport_vehicle = (
        transport.vehicle_type
        or transport.transport_type
        or "Vehicle"
    )

    booking.transport_type = (
        transport.transport_type
        or "City Transport"
    )

    booking.transport_from = (
        transport.from_location
        or "N/A"
    )

    booking.transport_to = (
        transport.to_location
        or "N/A"
    )

    booking.transport_route = (
        transport.route
        or (
            f"{transport.from_location or 'N/A'}"
            f" → "
            f"{transport.to_location or 'N/A'}"
        )
    )

    booking.departure_time = (
        transport.departure_time
    )

    booking.arrival_time = (
        transport.arrival_time
    )

    return booking


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
    # FIND ACTIVE TRANSPORT
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
    # AVAILABLE SEATS
    # -----------------------------------------------------

    available_seats = (
        transport.available_seats or 0
    )

    if passengers > available_seats:
        return None

    # -----------------------------------------------------
    # PRICE
    # -----------------------------------------------------

    price_per_person = (
        transport.price_per_person or 0
    )

    total_price = (
        passengers * price_per_person
    )

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
    # REDUCE SEATS
    # -----------------------------------------------------

    new_available_seats = (
        available_seats - passengers
    )

    transport.available_seats = (
        new_available_seats
    )

    # Keep old `available` column synchronized
    if hasattr(transport, "available"):
        transport.available = (
            new_available_seats
        )

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    db.add(booking)

    db.commit()

    db.refresh(booking)

    return attach_transport_details(booking)


# =========================================================
# GET MY TRANSPORT BOOKINGS
# =========================================================

def get_user_transport_bookings(
    db: Session,
    user_id: int,
):

    bookings = (
        db.query(TransportBooking)
        .filter(
            TransportBooking.user_id == user_id
        )
        .order_by(
            TransportBooking.created_at.desc()
        )
        .all()
    )

    for booking in bookings:
        attach_transport_details(booking)

    return bookings


# =========================================================
# GET SINGLE TRANSPORT BOOKING
# =========================================================

def get_transport_booking(
    db: Session,
    booking_id: int,
    user_id: int,
):

    booking = (
        db.query(TransportBooking)
        .filter(
            TransportBooking.id == booking_id,
            TransportBooking.user_id == user_id,
        )
        .first()
    )

    if not booking:
        return None

    return attach_transport_details(booking)


# =========================================================
# CANCEL TRANSPORT BOOKING
# =========================================================

def cancel_transport_booking(
    db: Session,
    booking_id: int,
    user_id: int,
):

    # -----------------------------------------------------
    # FIND BOOKING
    # -----------------------------------------------------

    booking = (
        db.query(TransportBooking)
        .filter(
            TransportBooking.id == booking_id,
            TransportBooking.user_id == user_id,
        )
        .first()
    )

    if not booking:
        return None

    # -----------------------------------------------------
    # ALREADY CANCELLED
    # -----------------------------------------------------

    if (
        booking.status
        and booking.status.lower() == "cancelled"
    ):
        return attach_transport_details(booking)

    # -----------------------------------------------------
    # FIND TRANSPORT
    # -----------------------------------------------------

    transport = (
        db.query(Transport)
        .filter(
            Transport.id == booking.transport_id
        )
        .first()
    )

    # -----------------------------------------------------
    # RESTORE SEATS
    # -----------------------------------------------------

    if transport:

        current_available = (
            transport.available_seats or 0
        )

        total_seats = (
            transport.total_seats
            or transport.capacity
            or 0
        )

        restored_seats = (
            current_available
            + booking.passengers
        )

        # Never exceed capacity
        if total_seats > 0:
            restored_seats = min(
                restored_seats,
                total_seats
            )

        transport.available_seats = (
            restored_seats
        )

        if hasattr(transport, "available"):
            transport.available = (
                restored_seats
            )

    # -----------------------------------------------------
    # UPDATE STATUS
    # -----------------------------------------------------

    booking.status = "Cancelled"

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    db.commit()

    db.refresh(booking)

    return attach_transport_details(booking)

