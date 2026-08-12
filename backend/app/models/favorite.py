from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Favorite(Base):

    __tablename__ = "favorites"


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


    place_id = Column(
        Integer,
        ForeignKey("places.id"),
        nullable=False
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    # Relationships
    user = relationship(
        "User",
        back_populates="favorites"
    )


    place = relationship(
        "Place"
    )