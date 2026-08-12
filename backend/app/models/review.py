from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    place_id = Column(Integer, ForeignKey("places.id"))

    rating = Column(Integer, nullable=False)

    comment = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )