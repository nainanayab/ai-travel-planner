from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class BudgetTrip(Base):

    __tablename__ = "budget_trips"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False
    )

    travelers = Column(
        Integer,
        nullable=False
    )

    total_budget = Column(
        Float,
        nullable=False
    )

    trip = relationship(
        "Trip",
        backref="budget_trip"
    )