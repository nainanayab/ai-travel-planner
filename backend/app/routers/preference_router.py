from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.preference_schema import PreferenceCreate
from app.services.preference_service import (
    create_preference,
    get_user_preferences
)


router = APIRouter(
    prefix="/preferences",
    tags=["User Preferences"]
)


# Create Preference
@router.post("/{user_id}")
def add_preference(
    user_id: int,
    preference: PreferenceCreate,
    db: Session = Depends(get_db)
):

    return create_preference(
        db,
        user_id,
        preference
    )


# Get User Preferences
@router.get("/{user_id}")
def read_preferences(
    user_id: int,
    db: Session = Depends(get_db)
):

    return get_user_preferences(
        db,
        user_id
    )