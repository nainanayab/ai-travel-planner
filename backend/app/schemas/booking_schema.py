
from datetime import date, datetime

from pydantic import BaseModel


# =========================================================
# PLACE BOOKING
# =========================================================

class BookingCreate(BaseModel):

    place_id: int

    visit_date: date

    persons: int


# =========================================================
# HOTEL BOOKING
# =========================================================

class HotelBookingCreate(BaseModel):

    hotel_id: int

    check_in: date

    check_out: date

    persons: int

    rooms: int


# =========================================================
# TRANSPORT BOOKING
# =========================================================

class TransportBookingCreate(BaseModel):

    transport_id: int

    passengers: int


# =========================================================
# BOOKING RESPONSE
# =========================================================

class BookingResponse(BaseModel):

    # =====================================================
    # BASIC
    # =====================================================

    id: int

    user_id: int


    # =====================================================
    # PLACE
    # =====================================================

    place_id: int | None = None

    place_name: str | None = None


    # =====================================================
    # HOTEL
    # =====================================================

    hotel_id: int | None = None

    hotel_name: str | None = None


    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_id: int | None = None

    transport_company: str | None = None

    transport_vehicle: str | None = None

    transport_from: str | None = None

    transport_to: str | None = None


    # =====================================================
    # PLACE BOOKING
    # =====================================================

    visit_date: date | None = None


    # =====================================================
    # HOTEL BOOKING
    # =====================================================

    check_in: date | None = None

    check_out: date | None = None


    # =====================================================
    # PEOPLE
    # =====================================================

    persons: int | None = None


    # =====================================================
    # TRANSPORT PASSENGERS
    # =====================================================

    passengers: int | None = None


    # =====================================================
    # ROOMS
    # =====================================================

    rooms: int | None = None


    # =====================================================
    # HOTEL PRICING
    # =====================================================

    nights: int | None = None

    price_per_night: float | None = None


    # =====================================================
    # TOTAL PRICE
    # =====================================================

    total_price: float | None = None


    # =====================================================
    # STATUS
    # =====================================================

    status: str


    # =====================================================
    # CREATED
    # =====================================================

    created_at: datetime


    # =====================================================
    # SQLALCHEMY SUPPORT
    # =====================================================

    class Config:
        from_attributes = True







