from pydantic import BaseModel


class TripCreate(BaseModel):

    title: str

    start_date: str

    end_date: str