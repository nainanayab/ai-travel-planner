from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.review_schema import ReviewCreate, ReviewResponse
from app.services.review_service import (
    create_review,
    get_place_reviews
)
from app.utils.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


# Add Review
@router.post("/", response_model=ReviewResponse)
def add_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return create_review(
        db=db,
        user_id=current_user.id,
        place_id=review.place_id,
        rating=review.rating,
        comment=review.comment
    )


# Get Place Reviews
@router.get(
    "/place/{place_id}",
    response_model=list[ReviewResponse]
)
def read_reviews(
    place_id: int,
    db: Session = Depends(get_db)
):

    return get_place_reviews(
        db,
        place_id
    )