from pydantic import BaseModel


# =========================================================
# AI TRIP REQUEST
# =========================================================

class AITripRequest(BaseModel):

    location: str

    days: int

    category: str | None = None


# =========================================================
# SAVE AI TRIP REQUEST
# DAYS FRONTEND SE NAHI AAYENGE
# =========================================================

class AISaveTripRequest(BaseModel):

    title: str

    location: str

    places: list[int]

    place_ticket_total: float = 0

    bus_ticket: float = 300

    total_ticket_cost: float = 300