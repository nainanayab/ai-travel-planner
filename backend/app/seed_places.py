from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.place import Place


def seed_places():

    db: Session = SessionLocal()

    places = [
        Place(
            name="Noor Mahal",
            location="Bahawalpur",
            description="A beautiful historical palace built in Italian and Islamic architectural style.",
            category="Historical",
            image_url="noor_mahal.jpg",
            latitude=29.3956,
            longitude=71.6836
        ),

        Place(
            name="Darbar Mahal",
            location="Bahawalpur",
            description="A royal palace known for its impressive architecture and heritage.",
            category="Historical",
            image_url="darbar_mahal.jpg",
            latitude=29.3925,
            longitude=71.6835
        ),

        Place(
            name="Bahawalpur Museum",
            location="Bahawalpur",
            description="A museum containing historical artifacts and cultural collections.",
            category="Museum",
            image_url="bahawalpur_museum.jpg",
            latitude=29.3950,
            longitude=71.6830
        )
    ]

    for place in places:
        existing = db.query(Place).filter(
        Place.name == place.name
    ).first()

    if not existing:
        db.add(place)

    db.commit()

    db.close()

    print("Bahawalpur places added successfully")


if __name__ == "__main__":
    seed_places()