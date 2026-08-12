from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.admin import admin_required
from app.db.database import get_db
from app.schemas.place_schema import PlaceCreate, PlaceResponse
from app.services.map_service import get_google_maps_link

from app.services.place_service import (
    create_place,
    get_places,
    get_place,
    search_places,
    update_place,
    delete_place,
    get_nearby_places
)

router = APIRouter(
    prefix="/places",
    tags=["Tourism Places"]
)


# -----------------------------
# Add Place (Admin Only)
# -----------------------------
@router.post("/", response_model=PlaceResponse)
def add_place(
    place: PlaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    return create_place(db, place)


# -----------------------------
# Get All Places
# -----------------------------
@router.get("/", response_model=list[PlaceResponse])
def read_places(
    db: Session = Depends(get_db)
):

    return get_places(db)


# -----------------------------
# Search Places
# -----------------------------
@router.get("/search")
def search(
    location: str = None,
    category: str = None,
    db: Session = Depends(get_db)
):

    return search_places(
        db,
        location,
        category
    )


# -----------------------------
# Update Place (Admin Only)
# -----------------------------
@router.put("/{place_id}", response_model=PlaceResponse)
def update(
    place_id: int,
    place: PlaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    updated_place = update_place(
        db,
        place_id,
        place
    )

    if not updated_place:
        raise HTTPException(
            status_code=404,
            detail="Place not found"
        )

    return updated_place


# -----------------------------
# Delete Place (Admin Only)
# -----------------------------
@router.delete("/{place_id}")
def delete(
    place_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    deleted_place = delete_place(
        db,
        place_id
    )

    if not deleted_place:
        raise HTTPException(
            status_code=404,
            detail="Place not found"
        )

    return {
        "message": "Place deleted successfully"
    }


# -----------------------------
# Get Single Place
# -----------------------------

@router.get("/nearby")
def nearby_places(
    latitude: float,
    longitude: float,
    radius: float = 10,
    db: Session = Depends(get_db)
):

    return get_nearby_places(
        db,
        latitude,
        longitude,
        radius
    )

@router.get("/{place_id}", response_model=PlaceResponse)
def read_place(
    place_id: int,
    db: Session = Depends(get_db)
):

    place = get_place(
        db,
        place_id
    )

    if not place:
        raise HTTPException(
            status_code=404,
            detail="Place not found"
        )

    return place