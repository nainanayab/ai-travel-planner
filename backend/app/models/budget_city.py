from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class BudgetCity(Base):

    __tablename__ = "budget_cities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    budget_trip_id = Column(
        Integer,
        ForeignKey("budget_trips.id"),
        nullable=False
    )

    city_name = Column(
        String,
        nullable=False
    )

    days = Column(
        Integer,
        nullable=False
    )

    hotel_cost = Column(
        Float,
        default=0
    )

    breakfast_cost = Column(
        Float,
        default=0
    )

    lunch_cost = Column(
        Float,
        default=0
    )

    dinner_cost = Column(
        Float,
        default=0
    )

    local_transport_cost = Column(
        Float,
        default=0
    )

    activity_cost = Column(
        Float,
        default=0
    )

    entry_fee = Column(
        Float,
        default=0
    )

    miscellaneous_cost = Column(
        Float,
        default=0
    )

    budget_trip = relationship(
        "BudgetTrip",
        backref="cities"
    )