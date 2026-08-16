from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class TripStop(Base):

    __tablename__ = "trip_stops"

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

    place_id = Column(
        Integer,
        ForeignKey("places.id"),
        nullable=False
    )

    visit_date = Column(
        String,
        nullable=False
    )

    visit_time = Column(
        String,
        nullable=True
    )

    order_number = Column(
        Integer,
        nullable=True
    )

    place = relationship(
        "Place"
    )