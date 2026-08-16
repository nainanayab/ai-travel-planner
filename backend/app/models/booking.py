
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Date,
    String,
    DateTime,
    Float,
    Boolean,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Booking(Base):

    __tablename__ = "bookings"

    # =========================================================
    # PRIMARY KEY
    # =========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================================
    # USER
    # =========================================================

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # =========================================================
    # PLACE
    # =========================================================

    place_id = Column(
        Integer,
        ForeignKey("places.id"),
        nullable=True
    )

    # =========================================================
    # HOTEL
    # =========================================================

    hotel_id = Column(
        Integer,
        ForeignKey("hotels.id"),
        nullable=True
    )

    # =========================================================
    # TRANSPORT
    # =========================================================

    transport_id = Column(
        Integer,
        ForeignKey("transports.id"),
        nullable=True
    )

    # =========================================================
    # PLACE DATE
    # =========================================================

    visit_date = Column(
        Date,
        nullable=True
    )

    # =========================================================
    # HOTEL DATES
    # =========================================================

    check_in = Column(
        Date,
        nullable=True
    )

    check_out = Column(
        Date,
        nullable=True
    )

    # =========================================================
    # PEOPLE
    # =========================================================

    persons = Column(
        Integer,
        nullable=True
    )

    passengers = Column(
        Integer,
        nullable=True
    )

    rooms = Column(
        Integer,
        nullable=True
    )

    # =========================================================
    # HOTEL PRICE
    # =========================================================

    price_per_night = Column(
        Float,
        nullable=True
    )

    nights = Column(
        Integer,
        nullable=True
    )

    total_price = Column(
        Float,
        nullable=True
    )

    # =========================================================
    # PLACE TICKET
    # =========================================================

    place_ticket_price = Column(
        Float,
        nullable=True
    )

    place_total_price = Column(
        Float,
        nullable=True
    )

    # =========================================================
    # HOTEL MEAL
    # =========================================================

    meal_plan = Column(
        String,
        nullable=True,
        default="none",
        server_default="none"
    )

    breakfast_selected = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    dinner_selected = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    breakfast_price = Column(
        Float,
        nullable=True,
        default=0
    )

    dinner_price = Column(
        Float,
        nullable=True,
        default=0
    )

    meal_total_price = Column(
        Float,
        nullable=True,
        default=0
    )

    # =========================================================
    # WIFI
    # =========================================================

    wifi_required = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true"
    )

    # =========================================================
    # PAYMENT
    # =========================================================

    payment_method = Column(
        String,
        nullable=False,
        default="online",
        server_default="online"
    )

    payment_status = Column(
        String,
        nullable=False,
        default="pending",
        server_default="pending"
    )

    payment_reference = Column(
        String,
        nullable=True
    )

    # =========================================================
    # BOOKING STATUS
    # =========================================================

    status = Column(
        String,
        nullable=False,
        default="Pending",
        server_default="Pending"
    )

    # =========================================================
    # CREATED
    # =========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # =========================================================
    # RELATIONSHIPS
    # =========================================================

    user = relationship(
        "User",
        foreign_keys=[user_id]
    )

    place = relationship(
        "Place",
        foreign_keys=[place_id]
    )

    hotel = relationship(
        "Hotel",
        foreign_keys=[hotel_id]
    )

    transport = relationship(
        "Transport",
        foreign_keys=[transport_id]
    )
