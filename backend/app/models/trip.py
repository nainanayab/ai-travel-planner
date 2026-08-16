from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func

from app.db.database import Base


class Trip(Base):

    __tablename__ = "trips"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    start_date = Column(
        String,
        nullable=False
    )

    end_date = Column(
        String,
        nullable=False
    )

    # ==========================================
    # TICKET COSTS
    # ==========================================

    place_ticket_total = Column(
        Float,
        default=0,
        nullable=False
    )

    bus_ticket = Column(
        Float,
        default=300,
        nullable=False
    )

    total_ticket_cost = Column(
        Float,
        default=300,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    