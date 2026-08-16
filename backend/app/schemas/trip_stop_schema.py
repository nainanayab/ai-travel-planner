from pydantic import BaseModel


class TripStopCreate(BaseModel):

    trip_id: int

    place_id: int

    visit_date: str

    visit_time: str | None = None

    order_number: int | None = None


class PlaceInfo(BaseModel):

    id: int

    name: str

    location: str

    category: str | None = None

    class Config:
        from_attributes = True


class TripStopResponse(BaseModel):

    id: int

    visit_date: str

    visit_time: str | None = None

    order_number: int | None = None

    place: PlaceInfo

    class Config:
        from_attributes = True