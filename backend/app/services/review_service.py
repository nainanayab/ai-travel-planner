from sqlalchemy.orm import Session

from app.models.review import Review


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
    db.commit()
    db.refresh(review)

    return review



def get_place_reviews(
    db: Session,
    place_id: int
):

    return (
        db.query(Review)
        .filter(
            Review.place_id == place_id
        )
        .order_by(
            Review.id.desc()
        )
        .all()
    )



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
        sum(review.rating for review in reviews)
        / len(reviews)
    )

    return {
        "average_rating": round(average, 2),
        "total_reviews": len(reviews)
    }