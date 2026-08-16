from sqlalchemy.orm import Session

from app.models.review import Review
from app.models.user import User


# =====================================================
# CREATE REVIEW
# =====================================================

def create_review(
    db: Session,
    user_id: int,
    place_id: int,
    rating: int,
    comment: str
):

    review = Review(
        user_id=user_id,
        place_id=place_id,
        rating=rating,
        comment=comment
    )

    db.add(review)

    try:

        db.commit()
        db.refresh(review)

    except Exception as e:

        db.rollback()

        print(
            "CREATE REVIEW ERROR:",
            str(e)
        )

        raise

    # =================================================
    # GET USER NAME
    # =================================================

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    # =================================================
    # RETURN REVIEW RESPONSE
    # =================================================

    return {
        "id": review.id,

        "user_id": review.user_id,

        "user_name": (
            user.full_name
            if user and user.full_name
            else "Anonymous User"
        ),

        "place_id": review.place_id,

        "rating": review.rating,

        "comment": review.comment,

        "created_at": review.created_at,
    }


# =====================================================
# GET PLACE REVIEWS
# =====================================================

def get_place_reviews(
    db: Session,
    place_id: int
):

    reviews = (
        db.query(
            Review,
            User.full_name
        )
        .join(
            User,
            User.id == Review.user_id
        )
        .filter(
            Review.place_id == place_id
        )
        .order_by(
            Review.id.desc()
        )
        .all()
    )

    result = []

    for review, user_name in reviews:

        result.append({
            "id": review.id,
            "user_id": review.user_id,
            "user_name": user_name or "Anonymous User",
            "place_id": review.place_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at
        })

    return result


# =====================================================
# AVERAGE RATING
# =====================================================

def get_average_rating(
    db: Session,
    place_id: int
):

    reviews = (
        db.query(Review)
        .filter(
            Review.place_id == place_id
        )
        .all()
    )

    if not reviews:

        return {
            "average_rating": 0,
            "total_reviews": 0
        }

    average = (
        sum(
            review.rating
            for review in reviews
        )
        / len(reviews)
    )

    return {
        "average_rating": round(
            average,
            2
        ),
        "total_reviews": len(reviews)
    }