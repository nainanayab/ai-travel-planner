from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.hotel_schema import (
    HotelCreate,
    HotelResponse
)

from app.services.hotel_service import (
    create_hotel,
    get_hotels,
    get_hotel,
    search_hotels,
    update_hotel,
    delete_hotel
)


router = APIRouter(
    prefix="/hotels",
    tags=["Hotels"]
)


@router.post(
    "/",
    response_model=HotelResponse
)
def create_hotel_endpoint(
    hotel: HotelCreate,
    db: Session = Depends(get_db)
):
    return create_hotel(db, hotel)


@router.get(
    "/",
    response_model=list[HotelResponse]
)
def get_hotels_endpoint(
    search: str | None = Query(
        default=None
    ),
    db: Session = Depends(get_db)
):

    if search:
        return search_hotels(db, search)

    return get_hotels(db)


@router.get(
    "/{hotel_id}",
    response_model=HotelResponse
)
def get_hotel_endpoint(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    hotel = get_hotel(db, hotel_id)

    if not hotel:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return hotel


@router.put(
    "/{hotel_id}",
    response_model=HotelResponse
)
def update_hotel_endpoint(
    hotel_id: int,
    hotel: HotelCreate,
    db: Session = Depends(get_db)
):
    updated_hotel = update_hotel(
        db,
        hotel_id,
        hotel
    )

    if not updated_hotel:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return updated_hotel


@router.delete(
    "/{hotel_id}"
)
def delete_hotel_endpoint(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    deleted_hotel = delete_hotel(
        db,
        hotel_id
    )

    if not deleted_hotel:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return {
        "message": "Hotel deleted successfully"
    }