from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    Boolean,
)
from sqlalchemy.sql import func

from app.db.database import Base


class Hotel(Base):

    __tablename__ = "hotels"

    # =====================================================
    # BASIC
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    address = Column(
        String,
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    image_url = Column(
        String,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    rating = Column(
        Float,
        nullable=True
    )

    price_per_night = Column(
        Float,
        nullable=True
    )

    phone = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )

    # =====================================================
    # HOTEL FACILITIES
    # =====================================================

    breakfast_included = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true"
    )

    dinner_included = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true"
    )

    wifi_included = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true"
    )

    # =====================================================
    # OPTIONAL MEAL PRICES
    # =====================================================

    breakfast_price = Column(
        Float,
        nullable=False,
        default=0,
        server_default="0"
    )

    dinner_price = Column(
        Float,
        nullable=False,
        default=0,
        server_default="0"
    )

    # =====================================================
    # CREATED
    # =====================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )