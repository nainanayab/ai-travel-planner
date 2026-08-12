from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Preference(Base):

    __tablename__ = "preferences"

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

    category = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=True
    )

    user = relationship(
    "User",
    back_populates="preferences"
)