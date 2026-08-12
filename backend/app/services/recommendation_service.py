from sqlalchemy.orm import Session

from app.models.place import Place
from app.models.favorite import Favorite
from app.models.review import Review
from app.models.preference import Preference


def get_recommendations(
    db: Session,
    user_id: int
):

    # Get user's preferences
    preferences = (
        db.query(Preference)
        .filter(
            Preference.user_id == user_id
        )
        .all()
    )


    # Get user's favorite places
    favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id
        )
        .all()
    )


    categories = []


    # Add categories from preferences
    for pref in preferences:
        categories.append(pref.category)


    # Add favorite place categories
    if favorites:

        favorite_place_ids = [
            fav.place_id for fav in favorites
        ]

        favorite_categories = (
            db.query(Place.category)
            .filter(
                Place.id.in_(favorite_place_ids)
            )
            .distinct()
            .all()
        )

        for cat in favorite_categories:
            categories.append(cat[0])


    # Remove duplicates
    categories = list(set(categories))


    # If no preference/favorites
    if not categories:

        return (
            db.query(Place)
            .order_by(Place.id.desc())
            .limit(5)
            .all()
        )


    # Find recommended places
    recommendations = (
        db.query(Place)
        .filter(
            Place.category.in_(categories)
        )
        .all()
    )


    result = []


    for place in recommendations:

        score = 0


        # Category matching score
        if place.category in categories:
            score += 50


        # Get reviews
        reviews = (
            db.query(Review)
            .filter(
                Review.place_id == place.id
            )
            .all()
        )


        average_rating = 0
        total_reviews = len(reviews)


        if reviews:

            average_rating = (
                sum(review.rating for review in reviews)
                /
                len(reviews)
            )


            # Rating score (max 30)
            score += int(average_rating * 6)


            # Popularity score (max 20)
            popularity_score = total_reviews * 2

            if popularity_score > 20:
                popularity_score = 20

            score += popularity_score



        result.append({

            "id": place.id,

            "name": place.name,

            "location": place.location,

            "category": place.category,

            "description": place.description,

            "average_rating": round(
                average_rating,
                2
            ),

            "total_reviews": total_reviews,

            "score": score

        })


    # Highest score first
    result.sort(
        key=lambda x: x["score"],
        reverse=True
    )


    return result