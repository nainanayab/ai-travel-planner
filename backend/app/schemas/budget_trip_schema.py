
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
        description="Tourist destination"
    )

    # -----------------------------------------------------
    # TRIP DURATION
    # -----------------------------------------------------

    days: int = Field(
        ...,
        ge=1,
        le=30,
        description="Number of travel days"
    )

    # -----------------------------------------------------
    # TRAVELERS
    # -----------------------------------------------------

    persons: int = Field(
        default=1,
        ge=1,
        le=50,
        description="Number of travelers"
    )

    # -----------------------------------------------------
    # TOTAL BUDGET
    # -----------------------------------------------------

    budget: float = Field(
        ...,
        ge=0,
        description="Total trip budget in PKR"
    )

    # -----------------------------------------------------
    # TRAVEL STYLE
    # -----------------------------------------------------

    travel_style: str = Field(
        default="Budget",
        description="Budget, Standard or Luxury"
    )

    # -----------------------------------------------------
    # INCLUDE SERVICES
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
    # BUDGET BREAKDOWN
    # -----------------------------------------------------

    hotel_cost: float

    transport_cost: float

    food_cost: float

    activities_cost: float

    miscellaneous_cost: float

    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    total_cost: float

    remaining_budget: float

    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    budget_status: str

    # -----------------------------------------------------
    # AI-GENERATED ITINERARY
    # -----------------------------------------------------

    itinerary: list
