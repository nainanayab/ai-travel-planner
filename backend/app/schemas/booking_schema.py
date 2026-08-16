
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


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

    # =====================================================
    # MEAL
    # =====================================================

    meal_plan: str = "none"

    breakfast_selected: bool = False
    dinner_selected: bool = False

    # =====================================================
    # WIFI
    # =====================================================

    wifi_required: bool = True

    # =====================================================
    # PAYMENT
    # =====================================================

    payment_method: str = "online"


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

    id: int
    user_id: int

    # =====================================================
    # PLACE
    # =====================================================

    place_id: Optional[int] = None
    place_name: Optional[str] = None

    place_ticket_price: Optional[float] = None
    place_total_price: Optional[float] = None

    # =====================================================
    # HOTEL
    # =====================================================

    hotel_id: Optional[int] = None
    hotel_name: Optional[str] = None

    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_id: Optional[int] = None

    transport_company: Optional[str] = None
    transport_vehicle: Optional[str] = None
    transport_from: Optional[str] = None
    transport_to: Optional[str] = None

    # =====================================================
    # DATES
    # =====================================================

    visit_date: Optional[date] = None

    check_in: Optional[date] = None
    check_out: Optional[date] = None

    # =====================================================
    # PEOPLE
    # =====================================================

    persons: Optional[int] = None
    passengers: Optional[int] = None
    rooms: Optional[int] = None

    # =====================================================
    # HOTEL PRICING
    # =====================================================

    nights: Optional[int] = None

    price_per_night: Optional[float] = None

    total_price: Optional[float] = None

    # =====================================================
    # HOTEL SERVICES
    # =====================================================

    meal_plan: Optional[str] = None

    breakfast_selected: bool = False
    dinner_selected: bool = False

    breakfast_price: Optional[float] = None
    dinner_price: Optional[float] = None
    meal_total_price: Optional[float] = None

    wifi_required: Optional[bool] = None

    # =====================================================
    # PAYMENT
    # =====================================================

    payment_method: Optional[str] = None

    payment_status: Optional[str] = None

    payment_reference: Optional[str] = None

    # =====================================================
    # STATUS
    # =====================================================

    status: str

    created_at: datetime

    # =====================================================
    # PYDANTIC V2
    # =====================================================

    model_config = ConfigDict(
        from_attributes=True
    )




