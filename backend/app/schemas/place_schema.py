from pydantic import BaseModel
from datetime import datetime


class PlaceCreate(BaseModel):

    name: str

    location: str

    description: str | None = None

    image_url: str | None = None

    category: str | None = None

    latitude: float | None = None

    longitude: float | None = None



class PlaceResponse(BaseModel):

    id: int

    name: str

    location: str

    description: str | None = None

    image_url: str | None = None

    category: str | None = None

    latitude: float | None = None

    longitude: float | None = None

    created_at: datetime

    google_maps: str | None = None


    class Config:
        from_attributes = True