from sqlalchemy.orm import Session, joinedload

from app.models.favorite import Favorite


def add_favorite(
    db: Session,
    user_id: int,
    place_id: int
):

    favorite = Favorite(
        user_id=user_id,
        place_id=place_id
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return (
        db.query(Favorite)
        .options(joinedload(Favorite.place))
        .filter(Favorite.id == favorite.id)
        .first()
    )


def get_favorites(
    db: Session,
    user_id: int
):

    return (
        db.query(Favorite)
        .options(joinedload(Favorite.place))
        .filter(Favorite.user_id == user_id)
        .all()
    )


def remove_favorite(
    db: Session,
    user_id: int,
    place_id: int
):

    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.place_id == place_id
        )
        .first()
    )

    if not favorite:
        return None

    db.delete(favorite)
    db.commit()

    return {"message": "Favorite removed"}