
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.place import Place
from app.models.hotel import Hotel


# =========================================================
# PLACE RESPONSE
# =========================================================

def build_place_booking_response(
    db: Session,
    booking: Booking
):

    place_name = None
    place_ticket_price = 0
    place_total_price = 0

    if booking.place_id is not None:

        place = (
            db.query(Place)
            .filter(Place.id == booking.place_id)
            .first()
        )

        if place:

            place_name = place.name

            place_ticket_price = float(
                place.ticket_price or 0
            )

            persons = int(
                booking.persons or 1
            )

            place_total_price = (
                place_ticket_price * persons
            )

    return {
        "id": booking.id,
        "user_id": booking.user_id,

        "place_id": booking.place_id,
        "place_name": place_name,

        "place_ticket_price": place_ticket_price,
        "place_total_price": place_total_price,

        "hotel_id": None,
        "hotel_name": None,

        "transport_id": None,
        "transport_company": None,
        "transport_vehicle": None,
        "transport_from": None,
        "transport_to": None,

        "visit_date": booking.visit_date,

        "check_in": None,
        "check_out": None,

        "persons": booking.persons,
        "passengers": None,
        "rooms": None,

        "nights": None,
        "price_per_night": None,
        "total_price": None,

        "meal_plan": None,
        "breakfast_selected": False,
        "dinner_selected": False,
        "breakfast_price": 0,
        "dinner_price": 0,
        "meal_total_price": 0,

        "wifi_required": None,

        "payment_method": None,
        "payment_status": None,
        "payment_reference": None,

        "status": booking.status,

        "created_at": booking.created_at,
    }


# =========================================================
# HOTEL RESPONSE
# =========================================================

def build_hotel_booking_response(
    db: Session,
    booking: Booking
):

    hotel_name = None

    if booking.hotel_id is not None:

        hotel = (
            db.query(Hotel)
            .filter(Hotel.id == booking.hotel_id)
            .first()
        )

        if hotel:
            hotel_name = hotel.name

    return {
        "id": booking.id,
        "user_id": booking.user_id,

        "place_id": None,
        "place_name": None,

        "place_ticket_price": None,
        "place_total_price": None,

        "hotel_id": booking.hotel_id,
        "hotel_name": hotel_name,

        "transport_id": None,
        "transport_company": None,
        "transport_vehicle": None,
        "transport_from": None,
        "transport_to": None,

        "visit_date": None,

        "check_in": booking.check_in,
        "check_out": booking.check_out,

        "persons": booking.persons,
        "passengers": None,
        "rooms": booking.rooms,

        "nights": booking.nights,
        "price_per_night": booking.price_per_night,
        "total_price": booking.total_price,

        # =====================================================
        # MEALS
        # =====================================================

        "meal_plan": booking.meal_plan or "none",

        "breakfast_selected": bool(
            booking.breakfast_selected
        ),

        "dinner_selected": bool(
            booking.dinner_selected
        ),

        "breakfast_price": float(
            booking.breakfast_price or 0
        ),

        "dinner_price": float(
            booking.dinner_price or 0
        ),

        "meal_total_price": float(
            booking.meal_total_price or 0
        ),

        # =====================================================
        # WIFI
        # =====================================================

        "wifi_required": booking.wifi_required,

        # =====================================================
        # PAYMENT
        # =====================================================

        "payment_method": booking.payment_method,

        "payment_status": booking.payment_status,

        "payment_reference": booking.payment_reference,

        # =====================================================
        # STATUS
        # =====================================================

        "status": booking.status,

        "created_at": booking.created_at,
    }


# =========================================================
# CREATE PLACE BOOKING
# =========================================================

def create_booking(
    db: Session,
    user_id: int,
    place_id: int,
    visit_date,
    persons: int
):

    if persons < 1:
        return None

    place = (
        db.query(Place)
        .filter(
            Place.id == place_id
        )
        .first()
    )

    if not place:
        return None

    ticket_price = float(
        place.ticket_price or 0
    )

    total_price = (
        ticket_price * persons
    )

    booking = Booking(

        user_id=user_id,

        place_id=place_id,

        visit_date=visit_date,

        persons=persons,

        place_ticket_price=ticket_price,

        place_total_price=total_price,

        status="Pending",
    )

    db.add(booking)

    db.commit()

    db.refresh(booking)

    return build_place_booking_response(
        db,
        booking
    )


# =========================================================
# CREATE HOTEL BOOKING
# =========================================================

def create_hotel_booking(
    db: Session,
    user_id: int,
    hotel_id: int,
    check_in,
    check_out,
    persons: int,
    rooms: int,
    meal_plan: str = "none",
    wifi_required: bool = True,
    payment_method: str = "online",
    breakfast_selected: bool = False,
    dinner_selected: bool = False
):

    # =====================================================
    # FIND HOTEL
    # =====================================================

    hotel = (
        db.query(Hotel)
        .filter(
            Hotel.id == hotel_id
        )
        .first()
    )

    if not hotel:
        return None

    # =====================================================
    # VALIDATE PERSONS
    # =====================================================

    if persons < 1:
        return None

    # =====================================================
    # VALIDATE ROOMS
    # =====================================================

    if rooms < 1:
        return None

    # =====================================================
    # VALIDATE DATES
    # =====================================================

    if not check_in or not check_out:
        return None

    if check_out <= check_in:
        return None

    # =====================================================
    # CALCULATE NIGHTS
    # =====================================================

    nights = (
        check_out - check_in
    ).days

    if nights <= 0:
        return None

    # =====================================================
    # NORMALIZE MEAL
    # =====================================================

    meal_plan = (
        meal_plan or "none"
    ).lower().strip()

    # =====================================================
    # NORMALIZE BREAKFAST / DINNER
    # =====================================================

    breakfast_selected = bool(
        breakfast_selected
    )

    dinner_selected = bool(
        dinner_selected
    )

    # =====================================================
    # KEEP MEAL PLAN CONSISTENT
    # =====================================================

    if breakfast_selected and dinner_selected:

        meal_plan = "both"

    elif breakfast_selected:

        meal_plan = "breakfast"

    elif dinner_selected:

        meal_plan = "dinner"

    else:

        meal_plan = "none"

    # =====================================================
    # BREAKFAST CHECK
    # =====================================================

    if (
        breakfast_selected
        and not hotel.breakfast_included
    ):
        return None

    # =====================================================
    # DINNER CHECK
    # =====================================================

    if (
        dinner_selected
        and not hotel.dinner_included
    ):
        return None

    # =====================================================
    # WIFI CHECK
    # =====================================================

    wifi_required = bool(
        wifi_required
    )

    if (
        wifi_required
        and not hotel.wifi_included
    ):
        return None

    # =====================================================
    # PAYMENT METHOD
    # =====================================================

    payment_method = (
        payment_method or "online"
    ).lower().strip()

    allowed_payment_methods = {
        "online",
        "cash",
    }

    if payment_method not in allowed_payment_methods:
        return None

    # =====================================================
    # HOTEL PRICE
    # =====================================================

    price_per_night = float(
        hotel.price_per_night or 0
    )

    if price_per_night <= 0:
        return None

    # =====================================================
    # MEAL PRICES
    #
    # Safe handling:
    # If Hotel model does not have these fields,
    # price remains 0.
    # =====================================================

    breakfast_price = 0.0
    dinner_price = 0.0

    if breakfast_selected:

        breakfast_price = float(
            getattr(
                hotel,
                "breakfast_price",
                0
            ) or 0
        )

    if dinner_selected:

        dinner_price = float(
            getattr(
                hotel,
                "dinner_price",
                0
            ) or 0
        )

    # =====================================================
    # MEAL TOTAL
    # =====================================================

    meal_total_price = (
        breakfast_price
        + dinner_price
    ) * nights * rooms

    # =====================================================
    # ROOM TOTAL
    # =====================================================

    room_total_price = (
        price_per_night
        * nights
        * rooms
    )

    # =====================================================
    # FINAL TOTAL
    # =====================================================

    total_price = (
        room_total_price
        + meal_total_price
    )

    # =====================================================
    # PAYMENT STATUS
    # =====================================================

    payment_status = "pending"

    # =====================================================
    # CREATE BOOKING
    # =====================================================

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

        # =================================================
        # MEAL
        # =================================================

        meal_plan=meal_plan,

        breakfast_selected=breakfast_selected,

        dinner_selected=dinner_selected,

        breakfast_price=breakfast_price,

        dinner_price=dinner_price,

        meal_total_price=meal_total_price,

        # =================================================
        # WIFI
        # =================================================

        wifi_required=wifi_required,

        # =================================================
        # PAYMENT
        # =================================================

        payment_method=payment_method,

        payment_status=payment_status,

        payment_reference=None,

        # =================================================
        # STATUS
        # =================================================

        status="Pending",
    )

    db.add(booking)

    db.commit()

    db.refresh(booking)

    return build_hotel_booking_response(
        db,
        booking
    )


# =========================================================
# GET PLACE BOOKINGS
# =========================================================

def get_place_bookings(
    db: Session,
    user_id: int
):

    bookings = (
        db.query(Booking)
        .filter(
            Booking.user_id == user_id,
            Booking.place_id.isnot(None),
            Booking.hotel_id.is_(None)
        )
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

    return [
        build_place_booking_response(
            db,
            booking
        )
        for booking in bookings
    ]


# =========================================================
# GET HOTEL BOOKINGS
# =========================================================

def get_hotel_bookings(
    db: Session,
    user_id: int
):

    bookings = (
        db.query(Booking)
        .filter(
            Booking.user_id == user_id,
            Booking.hotel_id.isnot(None),
            Booking.place_id.is_(None)
        )
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

    return [
        build_hotel_booking_response(
            db,
            booking
        )
        for booking in bookings
    ]


# =========================================================
# GET ALL USER BOOKINGS
# =========================================================

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

    result = []

    for booking in bookings:

        if booking.hotel_id is not None:

            result.append(
                build_hotel_booking_response(
                    db,
                    booking
                )
            )

        elif booking.place_id is not None:

            result.append(
                build_place_booking_response(
                    db,
                    booking
                )
            )

    return result


# =========================================================
# CANCEL BOOKING
# =========================================================

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

    if (
        booking.status
        and booking.status.lower() == "cancelled"
    ):

        if booking.hotel_id is not None:

            return build_hotel_booking_response(
                db,
                booking
            )

        if booking.place_id is not None:

            return build_place_booking_response(
                db,
                booking
            )

        return None

    booking.status = "Cancelled"

    db.commit()

    db.refresh(booking)

    if booking.hotel_id is not None:

        return build_hotel_booking_response(
            db,
            booking
        )

    if booking.place_id is not None:

        return build_place_booking_response(
            db,
            booking
        )

    return None


# =========================================================
# UPDATE PAYMENT
# =========================================================

def update_payment_status(
    db: Session,
    booking_id: int,
    user_id: int,
    payment_status: str,
    payment_reference: str | None = None
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

    allowed_statuses = {
        "pending",
        "paid",
        "failed",
        "refunded",
    }

    payment_status = (
        payment_status or "pending"
    ).lower().strip()

    if payment_status not in allowed_statuses:
        return None

    booking.payment_status = payment_status

    booking.payment_reference = payment_reference

    if payment_status == "paid":

        booking.status = "Confirmed"

    elif payment_status == "failed":

        booking.status = "Payment Failed"

    elif payment_status == "refunded":

        booking.status = "Refunded"

    db.commit()

    db.refresh(booking)

    if booking.hotel_id is not None:

        return build_hotel_booking_response(
            db,
            booking
        )

    if booking.place_id is not None:

        return build_place_booking_response(
            db,
            booking
        )

    return None


# =========================================================
# ADMIN - GET ALL BOOKINGS
# =========================================================

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

    result = []

    for booking in bookings:

        if booking.hotel_id is not None:

            result.append(
                build_hotel_booking_response(
                    db,
                    booking
                )
            )

        elif booking.place_id is not None:

            result.append(
                build_place_booking_response(
                    db,
                    booking
                )
            )

    return result


# =========================================================
# ADMIN - UPDATE BOOKING STATUS
# =========================================================

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

    status = (
        status or "Pending"
    ).strip()

    booking.status = status

    if status.lower() == "confirmed":

        if booking.payment_method == "cash":

            booking.payment_status = "pending"

    if status.lower() == "cancelled":

        if booking.payment_status == "paid":

            booking.payment_status = "refunded"

    db.commit()

    db.refresh(booking)

    if booking.hotel_id is not None:

        return build_hotel_booking_response(
            db,
            booking
        )

    if booking.place_id is not None:

        return build_place_booking_response(
            db,
            booking
        )

    return None
