from pydantic import BaseModel


class AITripRequest(BaseModel):
    location: str
    days: int
    category: str | None = None


class AISaveTripRequest(BaseModel):
    title: str
    places: list[int]