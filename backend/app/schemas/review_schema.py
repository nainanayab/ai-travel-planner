from pydantic import BaseModel, Field
from datetime import datetime


class ReviewCreate(BaseModel):

    place_id: int

    rating: int = Field(
        ge=1,
        le=5
    )

    comment: str


class ReviewResponse(BaseModel):

    id: int
    user_id: int
    user_name: str
    place_id: int
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True