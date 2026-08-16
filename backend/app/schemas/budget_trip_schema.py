from typing import Literal

from pydantic import BaseModel, Field


# =========================================================
# AI BUDGET TRIP REQUEST
# =========================================================

class BudgetTripRequest(BaseModel):

    # -----------------------------------------------------
    # DESTINATION
    # -----------------------------------------------------

    location: str = Field(
        ...,
        min_length=2,
        description="Destination city or location",
    )

    # -----------------------------------------------------
    # NUMBER OF DAYS
    # -----------------------------------------------------

    days: int = Field(
        ...,
        ge=1,
        description="Number of travel days",
    )

    # -----------------------------------------------------
    # NUMBER OF TRAVELERS
    # -----------------------------------------------------

    persons: int = Field(
        ...,
        ge=1,
        description="Number of travelers",
    )

    # -----------------------------------------------------
    # TOTAL BUDGET
    # -----------------------------------------------------

    budget: float = Field(
        ...,
        ge=0,
        description="Total available budget",
    )

    # -----------------------------------------------------
    # STARTING CITY
    # -----------------------------------------------------

    from_city: str = Field(
        ...,
        min_length=2,
        description="City from which the trip starts",
    )

    # -----------------------------------------------------
    # TRAVEL STYLE
    # -----------------------------------------------------

    travel_style: Literal[
        "budget",
        "standard",
        "luxury",
    ] = Field(
        default="budget",
        description="Travel style",
    )

    # -----------------------------------------------------
    # OPTIONAL SERVICES
    # -----------------------------------------------------

    include_hotel: bool = True

    include_transport: bool = True

    include_food: bool = True

    include_activities: bool = True


# =========================================================
# AI BUDGET TRIP RESPONSE
# =========================================================

class BudgetTripResponse(BaseModel):

    # -----------------------------------------------------
    # BASIC TRIP INFORMATION
    # -----------------------------------------------------

    location: str

    days: int

    persons: int

    budget: float

    # -----------------------------------------------------
    # HOTEL INFORMATION
    # -----------------------------------------------------

    hotel_name: str | None = None

    breakfast_included: bool = False

    dinner_included: bool = False

    wifi_included: bool = False

    # -----------------------------------------------------
    # HOTEL COST
    # -----------------------------------------------------

    hotel_cost: float = 0

    # -----------------------------------------------------
    # TRANSPORT COST
    # -----------------------------------------------------

    transport_cost: float = 0

    # -----------------------------------------------------
    # ALL TRANSPORT OPTIONS
    # -----------------------------------------------------

    transport_options: list[dict] = Field(
        default_factory=list
    )

    # -----------------------------------------------------
    # FOOD COST
    # -----------------------------------------------------

    food_cost: float = 0

    # -----------------------------------------------------
    # ACTIVITIES COST
    # -----------------------------------------------------

    activities_cost: float = 0

    # -----------------------------------------------------
    # MISCELLANEOUS COST
    # -----------------------------------------------------

    miscellaneous_cost: float = 0

    # -----------------------------------------------------
    # TOTAL COST
    # -----------------------------------------------------

    total_cost: float = 0

    # -----------------------------------------------------
    # REMAINING BUDGET
    # -----------------------------------------------------

    remaining_budget: float = 0

    # -----------------------------------------------------
    # BUDGET STATUS
    # -----------------------------------------------------

    budget_status: str

    # -----------------------------------------------------
    # DAY-BY-DAY ITINERARY
    # -----------------------------------------------------

    itinerary: list[dict] = Field(
        default_factory=list
    )