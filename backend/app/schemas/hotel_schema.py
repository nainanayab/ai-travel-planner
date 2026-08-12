from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class HotelCreate(BaseModel):
    name: str
    location: str

    address: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

    rating: Optional[float] = None
    price_per_night: Optional[float] = None

    phone: Optional[str] = None
    email: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None


class HotelResponse(HotelCreate):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)