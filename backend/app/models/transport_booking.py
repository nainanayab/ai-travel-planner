
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from app.db.database import Base


class TransportBooking(Base):

    __tablename__ = "transport_bookings"

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
        nullable=False,
        index=True
    )

    # =====================================================
    # TRANSPORT
    # =====================================================

    transport_id = Column(
        Integer,
        ForeignKey("transports.id"),
        nullable=False,
        index=True
    )

    # =====================================================
    # PASSENGERS
    # =====================================================

    passengers = Column(
        Integer,
        nullable=False,
        default=1
    )

    # =====================================================
    # PRICE
    # =====================================================

    price_per_person = Column(
        Float,
        nullable=False,
        default=0
    )

    total_price = Column(
        Float,
        nullable=False,
        default=0
    )

    # =====================================================
    # STATUS
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
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    user = relationship(
        "User",
        back_populates="transport_bookings"
    )

    transport = relationship(
        "Transport",
        back_populates="bookings"
    )
