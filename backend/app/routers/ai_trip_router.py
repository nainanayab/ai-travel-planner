from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.ai_trip_service import generate_trip_plan
from app.schemas.ai_trip_schema import AITripRequest


router = APIRouter(
    prefix="/ai-trip",
    tags=["AI Trip Planner"]
)

@router.post("/plan")
def create_ai_plan(
    request: AITripRequest,
    db: Session = Depends(get_db)
):

    return generate_trip_plan(
        db,
        request.location,
        request.days,
        request.category
    )