from sqlalchemy.orm import Session

from app.models.preference import Preference
from app.schemas.preference_schema import PreferenceCreate


def create_preference(
    db: Session,
    user_id: int,
    preference: PreferenceCreate
):

    new_preference = Preference(
        user_id=user_id,
        category=preference.category,
        location=preference.location
    )

    db.add(new_preference)
    db.commit()
    db.refresh(new_preference)

    return new_preference


def get_user_preferences(
    db: Session,
    user_id: int
):

    return db.query(Preference).filter(
        Preference.user_id == user_id
    ).all()