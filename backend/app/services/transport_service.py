from sqlalchemy.orm import Session

from app.models.transport import Transport
from app.models.trip import Trip
from app.models.trip_stop import TripStop

# =========================================================

# CREATE TRANSPORT

# =========================================================

def create_transport(
    db: Session,
    user_id: int | None,
    trip_id: int | None,
    trip_stop_id: int | None,
    transport_type: str,
    vehicle_type: str,
    company_name: str,
    route: str | None,
    from_location: str,
    to_location: str,
    departure_time: str | None,
    arrival_time: str | None,
    total_seats: int,
    available_seats: int,
    price_per_person: float,
    passengers: int = 1,
    journey_type: str = "Sightseeing",
    phone: str | None = None,
):

    # =====================================================
    # CLEAN VALUES
    # =====================================================

    transport_type = (
        transport_type.strip()
        if transport_type
        else ""
    )

    vehicle_type = (
        vehicle_type.strip()
        if vehicle_type
        else ""
    )

    company_name = (
        company_name.strip()
        if company_name
        else ""
    )

    from_location = (
        from_location.strip()
        if from_location
        else ""
    )

    to_location = (
        to_location.strip()
        if to_location
        else ""
    )

    journey_type = (
        journey_type.strip()
        if journey_type
        else "Sightseeing"
    )

    # =====================================================
    # VALIDATE REQUIRED TEXT
    # =====================================================

    if not transport_type:
        return None

    if not vehicle_type:
        return None

    if not company_name:
        return None

    if not from_location:
        return None

    if not to_location:
        return None

    # =====================================================
    # TRANSPORT RULE
    # =====================================================
    # City sightseeing = Double Decker Bus
    # City to City = Coaster
    # =====================================================

    if journey_type.lower() == "sightseeing":

        if vehicle_type.lower() != "double decker bus":
            return None

        transport_type = "City Sightseeing"

    elif journey_type.lower() == "city to city":

        if vehicle_type.lower() != "coaster":
            return None

        transport_type = "City to City"

    else:
        return None

    # =====================================================
    # VALIDATE SEATS
    # =====================================================

    if total_seats < 1:
        return None

    if available_seats < 0:
        return None

    if available_seats > total_seats:
        return None

    # =====================================================
    # VALIDATE PASSENGERS
    # =====================================================

    if passengers < 1:
        return None

    if passengers > total_seats:
        return None

    # =====================================================
    # VALIDATE PRICE
    # =====================================================

    if price_per_person < 0:
        return None

    # =====================================================
    # CHECK TRIP
    # =====================================================

    if trip_id is not None:

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

    # =====================================================
    # CHECK TRIP STOP
    # =====================================================

    if trip_stop_id is not None:

        trip_stop = (
            db.query(TripStop)
            .filter(
                TripStop.id == trip_stop_id
            )
            .first()
        )

        if not trip_stop:
            return None

        if trip_id is not None:

            if trip_stop.trip_id != trip_id:
                return None

        elif trip_stop.trip_id is not None:

            trip_id = trip_stop.trip_id

    # =====================================================
    # CALCULATE TOTAL PRICE
    # =====================================================

    total_price = passengers * price_per_person

    # =====================================================
    # CREATE TRANSPORT
    # =====================================================

    transport = Transport(
        user_id=user_id,

        trip_id=trip_id,
        trip_stop_id=trip_stop_id,

        transport_type=transport_type,
        vehicle_type=vehicle_type,

        company_name=company_name,
        company=company_name,

        route=route.strip() if route else None,

        from_location=from_location,
        to_location=to_location,

        departure_time=departure_time,
        arrival_time=arrival_time,

        total_seats=total_seats,
        available_seats=available_seats,

        capacity=total_seats,
        passengers=passengers,

        price_per_person=price_per_person,
        total_price=total_price,

        journey_type=journey_type,

        available=available_seats,

        is_active=True,
        status="Pending",

        phone=phone.strip() if phone else None,
    )

    db.add(transport)
    db.commit()
    db.refresh(transport)

    return transport

# =====================================================
# CLEAN TEXT
# =====================================================

    transport_type = transport_type.strip() if transport_type else ""
    vehicle_type = vehicle_type.strip() if vehicle_type else ""
    company_name = company_name.strip() if company_name else ""
    from_location = from_location.strip() if from_location else ""
    to_location = to_location.strip() if to_location else ""
    route = route.strip() if route else None
    journey_type = journey_type.strip() if journey_type else "Sightseeing"
    phone = phone.strip() if phone else None

# =====================================================
# VALIDATE REQUIRED TEXT
# =====================================================

    if not transport_type:
     return None

    if not vehicle_type:
        return None

    if not company_name:
        return None

    if not from_location:
        return None

    if not to_location:
        return None

# =====================================================
# CITY / CITY-TO-CITY RULE
# =====================================================

# Double Decker Bus is for city sightseeing
    if vehicle_type.lower() == "double decker bus":

        if journey_type.lower() != "sightseeing":
            return None

    if transport_type.lower() not in [
        "city sightseeing",
        "sightseeing bus",
        "double decker bus",
    ]:
        return None

# Coaster is for city-to-city
    if vehicle_type.lower() == "coaster":

        if journey_type.lower() != "city to city":
            return None

    if transport_type.lower() not in [
        "city to city",
        "coaster",
    ]:
        return None

# =====================================================
# VALIDATE SEATS
# =====================================================

    if total_seats < 1:
        return None

    if available_seats < 0:
        return None

    if available_seats > total_seats:
        return None

# =====================================================
# VALIDATE PASSENGERS
# =====================================================

    if passengers < 1:
        return None

    if passengers > total_seats:
        return None

# =====================================================
# VALIDATE PRICE
# =====================================================

    if price_per_person < 0:
        return None

# =====================================================
# CHECK TRIP
# =====================================================

    if trip_id is not None:

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

# =====================================================
# CHECK TRIP STOP
# =====================================================

    if trip_stop_id is not None:

        trip_stop = (
        db.query(TripStop)
        .filter(
            TripStop.id == trip_stop_id
        )
        .first()
    )

    if not trip_stop:
        return None

    # Stop must belong to selected trip
    if trip_id is not None:

        if trip_stop.trip_id != trip_id:
            return None

    # If trip was not provided,
    # automatically use the stop's trip
    elif trip_stop.trip_id is not None:

        trip_id = trip_stop.trip_id

# =====================================================
# CALCULATE TOTAL PRICE
# =====================================================

    total_price = passengers * price_per_person

# =====================================================
# CREATE TRANSPORT
# =====================================================

    transport = Transport(
        user_id=user_id,

    # -------------------------------------------------
    # TRIP
    # -------------------------------------------------

    trip_id=trip_id,
    trip_stop_id=trip_stop_id,

    # -------------------------------------------------
    # TRANSPORT
    # -------------------------------------------------

    transport_type=transport_type,
    vehicle_type=vehicle_type,

    company_name=company_name,

    # Legacy field
    company=company_name,

    # -------------------------------------------------
    # ROUTE
    # -------------------------------------------------

    route=route,

    from_location=from_location,
    to_location=to_location,

    # -------------------------------------------------
    # TIMING
    # -------------------------------------------------

    departure_time=departure_time,
    arrival_time=arrival_time,

    # -------------------------------------------------
    # SEATS
    # -------------------------------------------------

    total_seats=total_seats,
    available_seats=available_seats,

    capacity=total_seats,

    passengers=passengers,

    # -------------------------------------------------
    # PRICE
    # -------------------------------------------------

    price_per_person=price_per_person,
    total_price=total_price,

    # -------------------------------------------------
    # JOURNEY
    # -------------------------------------------------

    journey_type=journey_type,

    # -------------------------------------------------
    # AVAILABILITY
    # -------------------------------------------------

    available=available_seats,

    is_active=True,

    # -------------------------------------------------
    # STATUS
    # -------------------------------------------------

    status="Pending",

    # -------------------------------------------------
    # CONTACT
    # -------------------------------------------------

    phone=phone,
)

    db.add(transport)
    db.commit()
    db.refresh(transport)

    return transport


# =========================================================

# GET USER TRANSPORT

# =========================================================

def get_user_transport(
db: Session,
user_id: int
):


    return (
    db.query(Transport)
    .filter(
        Transport.user_id == user_id,
        Transport.is_active == True
    )
    .order_by(
        Transport.created_at.desc()
    )
    .all()
)


# =========================================================

# GET ALL ACTIVE TRANSPORT

# =========================================================

def get_all_transport(
db: Session
):


    return (
    db.query(Transport)
    .filter(
        Transport.is_active == True
    )
    .order_by(
        Transport.created_at.desc()
    )
    .all()
)


# =========================================================

# GET TRANSPORT FOR TRIP

# =========================================================

def get_trip_transport(
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

    return (
    db.query(Transport)
    .filter(
        Transport.trip_id == trip_id,
        Transport.is_active == True
    )
    .order_by(
        Transport.created_at.desc()
    )
    .all()
)


# =========================================================

# GET TRANSPORT FOR TRIP STOP

# =========================================================

def get_trip_stop_transport(
db: Session,
trip_stop_id: int,
user_id: int
):


    trip_stop = (
    db.query(TripStop)
    .filter(
        TripStop.id == trip_stop_id
    )
    .first()
)

    if not trip_stop:
        return None

    trip = (
    db.query(Trip)
    .filter(
        Trip.id == trip_stop.trip_id,
        Trip.user_id == user_id
    )
    .first()
)

    if not trip:
        return None

    return (
    db.query(Transport)
    .filter(
        Transport.trip_stop_id == trip_stop_id,
        Transport.is_active == True
    )
    .order_by(
        Transport.created_at.desc()
    )
    .all()
)


# =========================================================

# GET SINGLE TRANSPORT

# =========================================================

def get_transport(
db: Session,
transport_id: int,
user_id: int
):


    transport = (
    db.query(Transport)
    .filter(
        Transport.id == transport_id,
        Transport.is_active == True
    )
    .first()
)

    if not transport:
        return None

# -----------------------------------------------------
# DIRECT USER OWNERSHIP
# -----------------------------------------------------

    if transport.user_id == user_id:
        return transport

# -----------------------------------------------------
# TRIP OWNERSHIP
# -----------------------------------------------------

    if transport.trip_id is not None:

        trip = (
        db.query(Trip)
        .filter(
            Trip.id == transport.trip_id,
            Trip.user_id == user_id
        )
        .first()
    )

    if trip:
        return transport

    return None


# =========================================================

# UPDATE TRANSPORT

# =========================================================

def update_transport(
db: Session,
transport_id: int,
user_id: int,
transport_type: str | None = None,
vehicle_type: str | None = None,
company_name: str | None = None,
route: str | None = None,
from_location: str | None = None,
to_location: str | None = None,
departure_time: str | None = None,
arrival_time: str | None = None,
total_seats: int | None = None,
available_seats: int | None = None,
capacity: int | None = None,
passengers: int | None = None,
price_per_person: float | None = None,
journey_type: str | None = None,
phone: str | None = None,
status: str | None = None,
is_active: bool | None = None,
):

    transport = get_transport(
    db=db,
    transport_id=transport_id,
    user_id=user_id
)

    if not transport:
     return None

# =====================================================
# TEXT
# =====================================================

    if transport_type is not None:

        if not transport_type.strip():
            return None

    transport.transport_type = transport_type.strip()

    if vehicle_type is not None:

        if not vehicle_type.strip():
            return None

    transport.vehicle_type = vehicle_type.strip()

    if company_name is not None:

        if not company_name.strip():
            return None

    transport.company_name = company_name.strip()
    transport.company = company_name.strip()

    if route is not None:

        transport.route = (
        route.strip()
        if route.strip()
        else None
    )

    if from_location is not None:

        if not from_location.strip():
            return None

    transport.from_location = from_location.strip()

    if to_location is not None:

        if not to_location.strip():
            return None

    transport.to_location = to_location.strip()

# =====================================================
# TIMING
# =====================================================

    if departure_time is not None:
        transport.departure_time = departure_time

    if arrival_time is not None:
        transport.arrival_time = arrival_time

# =====================================================
# SEATS
# =====================================================

    new_total_seats = (
    total_seats
    if total_seats is not None
    else transport.total_seats
)

    new_available_seats = (
    available_seats
    if available_seats is not None
    else transport.available_seats
)

    if new_total_seats < 1:
        return None

    if new_available_seats < 0:
        return None

    if new_available_seats > new_total_seats:
        return None

    if total_seats is not None:

        transport.total_seats = total_seats
    transport.capacity = total_seats

    if capacity is not None:

        if capacity < 1:
            return None

    if new_available_seats > capacity:
        return None

    transport.capacity = capacity

    if available_seats is not None:

        transport.available_seats = available_seats
        transport.available = available_seats

# =====================================================
# PASSENGERS
# =====================================================

    if passengers is not None:

        if passengers < 1:
            return None

    if passengers > new_total_seats:
        return None

    transport.passengers = passengers

# =====================================================
# PRICE
# =====================================================

    if price_per_person is not None:

        if price_per_person < 0:
            return None

    transport.price_per_person = price_per_person

# =====================================================
# JOURNEY
# =====================================================

    if journey_type is not None:

        if not journey_type.strip():
                return None

    transport.journey_type = journey_type.strip()

# =====================================================
# VALIDATE VEHICLE / JOURNEY COMBINATION
# =====================================================

    current_vehicle = (
    transport.vehicle_type or ""
).lower()

    current_journey = (
    transport.journey_type or ""
).lower()

    if current_vehicle == "double decker bus":

        if current_journey != "sightseeing":
            return None

    if current_vehicle == "coaster":

        if current_journey != "city to city":
            return None

# =====================================================
# RECALCULATE TOTAL PRICE
# =====================================================

    current_passengers = transport.passengers or 1
    current_price = transport.price_per_person or 0

    transport.total_price = (
    current_passengers * current_price
)

# =====================================================
# PHONE
# =====================================================

    if phone is not None:

        transport.phone = (
        phone.strip()
        if phone.strip()
        else None
    )

# =====================================================
# STATUS
# =====================================================

    if status is not None:
        transport.status = status

# =====================================================
# ACTIVE
# =====================================================

    if is_active is not None:
        transport.is_active = is_active

# =====================================================
# SAVE
# =====================================================

    db.commit()
    db.refresh(transport)

    return transport


# =========================================================

# DELETE / DEACTIVATE TRANSPORT

# =========================================================

def delete_transport(
db: Session,
transport_id: int,
user_id: int
):


    transport = get_transport(
    db=db,
    transport_id=transport_id,
    user_id=user_id
)

    if not transport:
        return None

    transport.is_active = False
    transport.status = "Cancelled"

    db.commit()
    db.refresh(transport)

    return transport


# =========================================================

# GET TRIP TRANSPORT TOTAL

# =========================================================

def get_trip_transport_total(
    db: Session,
    trip_id: int,
    user_id: int
):
    # -----------------------------------------------------
    # CHECK TRIP
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # GET ACTIVE TRANSPORT
    # -----------------------------------------------------

    transports = (
        db.query(Transport)
        .filter(
            Transport.trip_id == trip_id,
            Transport.is_active == True
        )
        .all()
    )

    # -----------------------------------------------------
    # CALCULATE TOTAL
    # -----------------------------------------------------

    total = 0.0

    for transport in transports:
        passengers = transport.passengers or 1
        price = transport.price_per_person or 0

        total += passengers * price

    return total