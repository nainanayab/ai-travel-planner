from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.recommendation_service import get_recommendations
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/recommendations",
    tags=["AI Recommendations"]
)


@router.get("/")
def recommend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_recommendations(
        db,
        current_user.id
    )