from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.ai_trip_schema import AISaveTripRequest

from app.services.trip_service import save_ai_trip

from app.utils.auth import get_current_user

from app.models.user import User


router = APIRouter(
    prefix="/ai-trip",
    tags=["AI Trip Planner"]
)


# =========================================================
# SAVE AI GENERATED INSIDE CITY TRIP
# =========================================================

@router.post("/save")
def save_generated_trip(

    request: AISaveTripRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )

):

    try:

        result = save_ai_trip(

            db=db,

            user_id=current_user.id,

            title=request.title,

            location=request.location,

            places=request.places,

            place_ticket_total=request.place_ticket_total,

            bus_ticket=request.bus_ticket,

            total_ticket_cost=request.total_ticket_cost

        )

        if not result:

            raise HTTPException(
                status_code=400,
                detail="Unable to save trip."
            )

        return result

    except HTTPException:

        raise

    except Exception as e:

        db.rollback()

        print(
            "SAVE AI TRIP ERROR:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail="Unable to save trip. Please try again."

        )