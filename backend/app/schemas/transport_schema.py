
from datetime import datetime

from pydantic import BaseModel, Field


# =========================================================
# CREATE TRANSPORT
# =========================================================

class TransportCreate(BaseModel):

    # =====================================================
    # TRIP
    # =====================================================

    trip_id: int | None = None
    trip_stop_id: int | None = None

    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_type: str = "City Sightseeing"
    vehicle_type: str = "Double Decker Bus"

    company_name: str
    company: str | None = None

    # =====================================================
    # ROUTE
    # =====================================================

    route: str | None = None

    from_location: str
    to_location: str

    # =====================================================
    # TIMING
    # =====================================================

    departure_time: str | None = None
    arrival_time: str | None = None

    # =====================================================
    # SEATS
    # =====================================================

    total_seats: int = Field(
        default=50,
        ge=1
    )

    available_seats: int = Field(
        default=50,
        ge=0
    )

    capacity: int | None = Field(
        default=None,
        ge=0
    )

    passengers: int = Field(
        default=1,
        ge=1
    )

    # =====================================================
    # PRICE
    # =====================================================

    price_per_person: float = Field(
        default=0,
        ge=0
    )

    total_price: float = Field(
        default=0,
        ge=0
    )

    # =====================================================
    # JOURNEY
    # =====================================================

    journey_type: str = "Sightseeing"

    # =====================================================
    # AVAILABILITY
    # =====================================================

    available: int = Field(
        default=50,
        ge=0
    )

    # =====================================================
    # STATUS
    # =====================================================

    status: str = "Pending"

    # =====================================================
    # CONTACT
    # =====================================================

    phone: str | None = None


# =========================================================
# UPDATE TRANSPORT
# =========================================================

class TransportUpdate(BaseModel):

    transport_type: str | None = None
    vehicle_type: str | None = None

    company_name: str | None = None
    company: str | None = None

    route: str | None = None

    from_location: str | None = None
    to_location: str | None = None

    departure_time: str | None = None
    arrival_time: str | None = None

    total_seats: int | None = Field(
        default=None,
        ge=1
    )

    available_seats: int | None = Field(
        default=None,
        ge=0
    )

    capacity: int | None = Field(
        default=None,
        ge=0
    )

    passengers: int | None = Field(
        default=None,
        ge=1
    )

    price_per_person: float | None = Field(
        default=None,
        ge=0
    )

    journey_type: str | None = None

    phone: str | None = None

    status: str | None = None

    is_active: bool | None = None


# =========================================================
# TRANSPORT RESPONSE
# =========================================================

class TransportResponse(BaseModel):

    id: int

    user_id: int | None = None

    trip_id: int | None = None
    trip_stop_id: int | None = None

    transport_type: str | None = None
    vehicle_type: str | None = None

    company_name: str | None = None
    company: str | None = None

    route: str | None = None

    from_location: str | None = None
    to_location: str | None = None

    departure_time: str | None = None
    arrival_time: str | None = None

    total_seats: int | None = None
    available_seats: int | None = None
    capacity: int | None = None
    passengers: int | None = None

    price_per_person: float | None = None
    total_price: float | None = None

    journey_type: str | None = None

    available: int | None = None

    is_active: bool | None = None

    status: str | None = None

    phone: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True


# =========================================================
# CREATE TRANSPORT BOOKING
# =========================================================

class TransportBookingCreate(BaseModel):

    transport_id: int

    passengers: int = Field(
        default=1,
        ge=1
    )


# =========================================================
# TRANSPORT BOOKING RESPONSE
# =========================================================

class TransportBookingResponse(BaseModel):

    # =====================================================
    # BOOKING
    # =====================================================

    id: int

    user_id: int

    transport_id: int

    # =====================================================
    # TRANSPORT DETAILS
    # =====================================================

    transport_company: str | None = None

    transport_vehicle: str | None = None

    transport_type: str | None = None

    transport_from: str | None = None

    transport_to: str | None = None

    transport_route: str | None = None

    departure_time: str | None = None

    arrival_time: str | None = None

    # =====================================================
    # BOOKING DETAILS
    # =====================================================

    passengers: int

    price_per_person: float

    total_price: float

    status: str

    created_at: datetime

    class Config:
        from_attributes = True

