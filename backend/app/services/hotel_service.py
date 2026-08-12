from sqlalchemy.orm import Session

from app.models.hotel import Hotel
from app.schemas.hotel_schema import HotelCreate


def create_hotel(
    db: Session,
    hotel_data: HotelCreate
):
    hotel = Hotel(
        name=hotel_data.name,
        location=hotel_data.location,
        address=hotel_data.address,
        description=hotel_data.description,
        image_url=hotel_data.image_url,
        category=hotel_data.category,
        rating=hotel_data.rating,
        price_per_night=hotel_data.price_per_night,
        phone=hotel_data.phone,
        email=hotel_data.email,
        latitude=hotel_data.latitude,
        longitude=hotel_data.longitude,
    )

    db.add(hotel)
    db.commit()
    db.refresh(hotel)

    return hotel


def get_hotels(db: Session):
    return db.query(Hotel).order_by(
        Hotel.id.desc()
    ).all()


def get_hotel(
    db: Session,
    hotel_id: int
):
    return db.query(Hotel).filter(
        Hotel.id == hotel_id
    ).first()


def search_hotels(
    db: Session,
    search: str
):
    return db.query(Hotel).filter(
        Hotel.name.ilike(f"%{search}%")
        | Hotel.location.ilike(f"%{search}%")
        | Hotel.category.ilike(f"%{search}%")
    ).all()


def update_hotel(
    db: Session,
    hotel_id: int,
    hotel_data: HotelCreate
):
    hotel = get_hotel(db, hotel_id)

    if not hotel:
        return None

    for field, value in hotel_data.model_dump().items():
        setattr(hotel, field, value)

    db.commit()
    db.refresh(hotel)

    return hotel


def delete_hotel(
    db: Session,
    hotel_id: int
):
    hotel = get_hotel(db, hotel_id)

    if not hotel:
        return None

    db.delete(hotel)
    db.commit()

    return hotel