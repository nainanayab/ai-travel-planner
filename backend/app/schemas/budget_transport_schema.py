from pydantic import BaseModel, Field
from typing import Optional


# =========================================================
# CREATE BUDGET TRANSPORT
# =========================================================

class BudgetTransportCreate(BaseModel):

    from_city: str = Field(
        ...,
        min_length=1,
        description="Starting city",
    )

    to_city: str = Field(
        ...,
        min_length=1,
        description="Destination city",
    )

    transport_type: str = Field(
        ...,
        min_length=1,
        description="Type of transport",
    )

    distance_km: Optional[float] = Field(
        default=None,
        ge=0,
        description="Distance in kilometers",
    )

    travel_time_hours: Optional[float] = Field(
        default=None,
        ge=0,
        description="Travel time in hours",
    )

    cost: Optional[float] = Field(
        default=None,
        ge=0,
        description="Transport cost",
    )


# =========================================================
# BUDGET TRANSPORT RESPONSE
# =========================================================

class BudgetTransportResponse(BaseModel):

    id: int

    from_city: str

    to_city: str

    transport_type: str

    distance_km: Optional[float] = None

    travel_time_hours: Optional[float] = None

    cost: Optional[float] = None

    # =====================================================
    # PYDANTIC V2
    # =====================================================

    class Config:
        from_attributes = True