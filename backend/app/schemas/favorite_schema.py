from pydantic import BaseModel
from datetime import datetime


class FavoriteCreate(BaseModel):
    place_id: int



class PlaceMiniResponse(BaseModel):
    id: int
    name: str
    location: str
    description: str | None = None
    image_url: str | None = None
    category: str | None = None

    class Config:
        from_attributes = True



class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    place_id: int
    created_at: datetime
    place: PlaceMiniResponse


    class Config:
        from_attributes = True