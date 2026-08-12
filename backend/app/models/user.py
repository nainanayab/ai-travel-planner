
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):

    __tablename__ = "users"

    # =====================================================
    # ID
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =====================================================
    # USER INFORMATION
    # =====================================================

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        default="tourist"
    )

    # =====================================================
    # CREATED
    # =====================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # =====================================================
    # PREFERENCES
    # =====================================================

    preferences = relationship(
        "Preference",
        back_populates="user",
        cascade="all, delete"
    )

    # =====================================================
    # FAVORITES
    # =====================================================

    favorites = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete"
    )

    # =====================================================
    # TRANSPORT BOOKINGS
    # =====================================================

    transport_bookings = relationship(
        "TransportBooking",
        back_populates="user",
        cascade="all, delete"
    )
