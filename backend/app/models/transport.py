
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Boolean,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Transport(Base):

    __tablename__ = "transports"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # USER
    # =====================================================

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    # =====================================================
    # TRIP
    # =====================================================

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=True
    )

    # =====================================================
    # TRIP STOP
    # =====================================================

    trip_stop_id = Column(
        Integer,
        ForeignKey("trip_stops.id"),
        nullable=True
    )

    # =====================================================
    # TRANSPORT TYPE
    # =====================================================

    transport_type = Column(
        String,
        nullable=True,
        default="Double Decker Bus"
    )

    vehicle_type = Column(
        String,
        nullable=True,
        default="Double Decker Bus"
    )

    # =====================================================
    # COMPANY
    # =====================================================

    company_name = Column(
        String,
        nullable=True
    )

    # Legacy field
    company = Column(
        String,
        nullable=True
    )

    # =====================================================
    # CONTACT
    # =====================================================

    phone = Column(
        String,
        nullable=True
    )

    # =====================================================
    # ROUTE
    # =====================================================

    route = Column(
        String,
        nullable=True
    )

    from_location = Column(
        String,
        nullable=True
    )

    to_location = Column(
        String,
        nullable=True
    )

    # =====================================================
    # TIMING
    # =====================================================

    departure_time = Column(
        String,
        nullable=True
    )

    arrival_time = Column(
        String,
        nullable=True
    )

    # =====================================================
    # SEATS
    # =====================================================

    total_seats = Column(
        Integer,
        nullable=True
    )

    available_seats = Column(
        Integer,
        nullable=True
    )

    # Legacy capacity
    capacity = Column(
        Integer,
        nullable=True
    )

    # =====================================================
    # PASSENGERS
    # =====================================================

    passengers = Column(
        Integer,
        nullable=True,
        default=1
    )

    # =====================================================
    # PRICE
    # =====================================================

    price_per_person = Column(
        Float,
        nullable=True
    )

    total_price = Column(
        Float,
        nullable=True,
        default=0
    )

    # =====================================================
    # JOURNEY TYPE
    # =====================================================

    journey_type = Column(
        String,
        nullable=True,
        default="Sightseeing"
    )

    # =====================================================
    # AVAILABILITY
    # =====================================================

    available = Column(
        Integer,
        nullable=True,
        default=1
    )

    # =====================================================
    # ACTIVE STATUS
    # =====================================================

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    # =====================================================
    # BOOKING / RECORD STATUS
    # =====================================================

    status = Column(
        String,
        nullable=False,
        default="Pending"
    )

    # =====================================================
    # CREATED
    # =====================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        foreign_keys=[user_id]
    )

    trip = relationship(
        "Trip",
        foreign_keys=[trip_id]
    )

    trip_stop = relationship(
        "TripStop",
        foreign_keys=[trip_stop_id]
    )

    # =====================================================
    # TRANSPORT BOOKINGS
    # =====================================================

    bookings = relationship(
        "TransportBooking",
        back_populates="transport",
        cascade="all, delete"
    )

