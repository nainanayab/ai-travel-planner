from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Date,
    String,
    DateTime,
    Float,
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
    # PLACE BOOKING
    # =========================================================

    place_id = Column(
        Integer,
        ForeignKey("places.id"),
        nullable=True
    )

    # =========================================================
    # HOTEL BOOKING
    # =========================================================

    hotel_id = Column(
        Integer,
        ForeignKey("hotels.id"),
        nullable=True
    )

    # =========================================================
    # TRANSPORT BOOKING
    # =========================================================

    transport_id = Column(
        Integer,
        ForeignKey("transports.id"),
        nullable=True
    )

    # =========================================================
    # PLACE VISIT DATE
    # =========================================================

    visit_date = Column(
        Date,
        nullable=True
    )

    # =========================================================
    # HOTEL CHECK-IN
    # =========================================================

    check_in = Column(
        Date,
        nullable=True
    )

    # =========================================================
    # HOTEL CHECK-OUT
    # =========================================================

    check_out = Column(
        Date,
        nullable=True
    )

    # =========================================================
    # NUMBER OF PERSONS
    # =========================================================

    persons = Column(
        Integer,
        nullable=True
    )

    # =========================================================
    # TRANSPORT PASSENGERS
    # =========================================================

    passengers = Column(
        Integer,
        nullable=True
    )

    # =========================================================
    # NUMBER OF ROOMS
    # =========================================================

    rooms = Column(
        Integer,
        nullable=True
    )

    # =========================================================
    # HOTEL PRICE PER NIGHT
    # =========================================================

    price_per_night = Column(
        Float,
        nullable=True
    )

    # =========================================================
    # NUMBER OF NIGHTS
    # =========================================================

    nights = Column(
        Integer,
        nullable=True
    )

    # =========================================================
    # TOTAL BOOKING PRICE
    # =========================================================

    total_price = Column(
        Float,
        nullable=True
    )

    # =========================================================
    # BOOKING STATUS
    # =========================================================

    status = Column(
        String,
        default="Pending",
        nullable=False
    )

    # =========================================================
    # CREATED DATE
    # =========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # =========================================================
    # USER RELATIONSHIP
    # =========================================================

    user = relationship(
        "User",
        foreign_keys=[user_id]
    )

    # =========================================================
    # PLACE RELATIONSHIP
    # =========================================================

    place = relationship(
        "Place",
        foreign_keys=[place_id]
    )

    # =========================================================
    # HOTEL RELATIONSHIP
    # =========================================================

    hotel = relationship(
        "Hotel",
        foreign_keys=[hotel_id]
    )

    # =========================================================
    # TRANSPORT RELATIONSHIP
    # =========================================================

    transport = relationship(
        "Transport",
        foreign_keys=[transport_id]
    )