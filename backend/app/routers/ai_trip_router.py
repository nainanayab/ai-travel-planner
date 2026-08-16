from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.services.ai_trip_service import (
    generate_trip_plan
)

from app.services.ai_save_service import (
    save_ai_trip
)

from app.schemas.ai_trip_schema import (
    AISaveTripRequest,
)

from app.utils.auth import get_current_user
from app.models.user import User


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/ai-trip",
    tags=["AI Trip Planner"]
)


# =========================================================
# GENERATE INSIDE CITY TRIP
# =========================================================

@router.post("/plan")
def create_ai_plan(
    request: dict,
    db: Session = Depends(get_db),
):
    """
    Generate an Inside City trip using
    user-selected tourist destinations.

    The user does not select trip duration.
    """

    # =====================================================
    # LOCATION
    # =====================================================

    location = request.get("location")

    if not location:
        raise HTTPException(
            status_code=400,
            detail="Please select a city."
        )

    location = str(location).strip()

    if not location:
        raise HTTPException(
            status_code=400,
            detail="Please select a city."
        )

    # =====================================================
    # SELECTED PLACE IDS
    # =====================================================

    place_ids = request.get("place_ids")

    if not isinstance(place_ids, list):
        raise HTTPException(
            status_code=400,
            detail="Please select your destinations."
        )

    if len(place_ids) == 0:
        raise HTTPException(
            status_code=400,
            detail="Please select at least one destination."
        )

    # =====================================================
    # CLEAN PLACE IDS
    # =====================================================

    cleaned_place_ids = []

    for place_id in place_ids:

        try:
            cleaned_place_ids.append(int(place_id))

        except (TypeError, ValueError):
            raise HTTPException(
                status_code=400,
                detail="Invalid tourist place selection."
            )

    # =====================================================
    # CATEGORY
    # =====================================================

    category = request.get("category")

    if category:
        category = str(category).strip()

    # =====================================================
    # GENERATE PLAN
    # =====================================================

    result = generate_trip_plan(
        db=db,
        location=location,
        place_ids=cleaned_place_ids,
        category=category,
    )

    # =====================================================
    # HANDLE ERROR
    # =====================================================

    if result.get("error"):
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )

    # =====================================================
    # HANDLE MESSAGE
    # =====================================================

    if result.get("message"):
        return result

    # =====================================================
    # RETURN PLAN
    # =====================================================

    return result


# =========================================================
# SAVE AI TRIP
# =========================================================

@router.post("/save")
def save_ai_generated_trip(
    request: AISaveTripRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Save generated Inside City trip
    for the currently logged-in user.

    Trip duration is NOT requested from the user
    and is NOT received from the frontend.

    The trip service handles the required internal
    date calculation automatically.
    """

    # =====================================================
    # TITLE
    # =====================================================

    if not request.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Trip title is required."
        )

    # =====================================================
    # LOCATION
    # =====================================================

    if not request.location.strip():
        raise HTTPException(
            status_code=400,
            detail="Trip location is required."
        )

    # =====================================================
    # PLACES
    # =====================================================

    if not request.places:
        raise HTTPException(
            status_code=400,
            detail="At least one tourist place is required."
        )

    # =====================================================
    # SAVE
    # =====================================================

    result = save_ai_trip(
        db=db,

        user_id=current_user.id,

        title=request.title.strip(),

        location=request.location.strip(),

        places=request.places,

        place_ticket_total=request.place_ticket_total,

        bus_ticket=request.bus_ticket,

        total_ticket_cost=request.total_ticket_cost,
    )

    # =====================================================
    # PLACES NOT FOUND
    # =====================================================

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Selected tourist places were not found."
        )

    # =====================================================
    # SUCCESS
    # =====================================================

    return result