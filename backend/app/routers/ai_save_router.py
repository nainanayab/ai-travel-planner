from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.ai_save_service import save_ai_trip
from app.utils.auth import get_current_user
from app.models.user import User
from app.schemas.ai_trip_schema import AISaveTripRequest


router = APIRouter(
    prefix="/ai-trip",
    tags=["AI Trip Planner"]
)


@router.post("/save")
def save_plan(
    data: AISaveTripRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return save_ai_trip(
        db,
        current_user.id,
        data.title,
        data.places
    )