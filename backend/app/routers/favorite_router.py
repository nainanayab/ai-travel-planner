from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.favorite_schema import (
    FavoriteCreate,
    FavoriteResponse
)

from app.services.favorite_service import (
    add_favorite,
    get_favorites,
    remove_favorite
)

from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)


# Add Favorite
@router.post("/", response_model=FavoriteResponse)
def create(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return add_favorite(
        db,
        current_user.id,
        favorite.place_id
    )


# Get User Favorites
@router.get("/", response_model=list[FavoriteResponse])
def read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_favorites(
        db,
        current_user.id
    )


# Remove Favorite
@router.delete("/{place_id}")
def delete(
    place_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    result = remove_favorite(
        db,
        current_user.id,
        place_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Favorite not found"
        )

    return result