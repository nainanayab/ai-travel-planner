from sqlalchemy.orm import Session

from app.models.place import Place
from app.schemas.place_schema import PlaceCreate
from app.utils.distance import calculate_distance
from app.services.map_service import get_google_maps_link
from app.utils.maps import generate_google_maps_link


def create_place(db: Session, place: PlaceCreate):

    existing_place = db.query(Place).filter(
        Place.name.ilike(place.name)
    ).first()

    if existing_place:
        return existing_place

    new_place = Place(
        name=place.name,
        location=place.location,
        description=place.description,
        image_url=place.image_url,
        category=place.category,
        latitude=place.latitude,
        longitude=place.longitude
    )

    db.add(new_place)
    db.commit()
    db.refresh(new_place)

    return new_place


def get_places(db: Session):

    places = (
        db.query(Place)
        .order_by(
            Place.location.ilike("%Bahawalpur%").desc(),
            Place.location.ilike("%Lahore%").desc(),
            Place.location.ilike("%Multan%").desc(),
            Place.id.asc()
        )
        .all()
    )

    result = []

    for place in places:

        result.append(
            {
                "id": place.id,
                "name": place.name,
                "location": place.location,
                "description": place.description,
                "category": place.category,
                "image_url": place.image_url,
                "latitude": place.latitude,
                "longitude": place.longitude,
                "created_at": place.created_at,
                "google_maps": get_google_maps_link(place)
            }
        )

    return result


def get_place(db: Session, place_id: int):

    place = db.query(Place).filter(
        Place.id == place_id
    ).first()

    if not place:
        return None

    return {
        "id": place.id,
        "name": place.name,
        "location": place.location,
        "description": place.description,
        "image_url": place.image_url,
        "category": place.category,
        "latitude": place.latitude,
        "longitude": place.longitude,
        "created_at": place.created_at,
        "google_maps": generate_google_maps_link(
            place.latitude,
            place.longitude
        )
    }


def search_places(
    db: Session,
    location: str = None,
    category: str = None
):

    query = db.query(Place)

    if location:
        query = query.filter(
            Place.location.ilike(
                f"%{location}%"
            )
        )

    if category:
        query = query.filter(
            Place.category.ilike(
                f"%{category}%"
            )
        )

    return query.all()


def update_place(
    db: Session,
    place_id: int,
    place_data: PlaceCreate
):

    place = db.query(Place).filter(
        Place.id == place_id
    ).first()

    if not place:
        return None

    place.name = place_data.name
    place.location = place_data.location
    place.description = place_data.description
    place.image_url = place_data.image_url
    place.category = place_data.category
    place.latitude = place_data.latitude
    place.longitude = place_data.longitude

    db.commit()
    db.refresh(place)

    return place


def delete_place(
    db: Session,
    place_id: int
):

    place = db.query(Place).filter(
        Place.id == place_id
    ).first()

    if not place:
        return None

    db.delete(place)
    db.commit()

    return {
        "message": "Place deleted successfully",
        "deleted_id": place_id
    }


def get_nearby_places(
    db: Session,
    latitude: float,
    longitude: float,
    radius: float
):

    places = db.query(Place).all()

    nearby_places = []

    for place in places:

        if (
            place.latitude is None
            or place.longitude is None
        ):
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            place.latitude,
            place.longitude
        )

        if distance <= radius:

            nearby_places.append(
                {
                    "id": place.id,
                    "name": place.name,
                    "location": place.location,
                    "category": place.category,
                    "distance_km": round(distance, 2),
                    "google_maps": generate_google_maps_link(
                        place.latitude,
                        place.longitude
                    )
                }
            )

    nearby_places.sort(
        key=lambda x: x["distance_km"]
    )

    return nearby_places