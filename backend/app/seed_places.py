from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.place import Place


def seed_places():

    db: Session = SessionLocal()

    places = [

        # =====================================================
        # BAHWALPUR
        # =====================================================

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
        ),

        # =====================================================
        # LAHORE
        # =====================================================

        Place(
            name="Lahore Fort",
            location="Lahore",
            description="A historic Mughal fort and one of Lahore's most important heritage landmarks.",
            category="Historical",
            image_url="lahore_fort.jpg",
            latitude=31.5880,
            longitude=74.3150
        ),

        Place(
            name="Badshahi Mosque",
            location="Lahore",
            description="A magnificent Mughal-era mosque located near Lahore Fort.",
            category="Historical",
            image_url="badshahi_mosque.jpg",
            latitude=31.5880,
            longitude=74.3100
        ),

        Place(
            name="Minar-e-Pakistan",
            location="Lahore",
            description="A famous national monument located in Greater Iqbal Park.",
            category="Historical",
            image_url="minar_e_pakistan.jpg",
            latitude=31.5925,
            longitude=74.3095
        ),

        Place(
            name="Lahore Museum",
            location="Lahore",
            description="A major museum containing historical, cultural and archaeological collections.",
            category="Museum",
            image_url="lahore_museum.jpg",
            latitude=31.5656,
            longitude=74.3148
        ),

        # =====================================================
        # MULTAN
        # =====================================================

        Place(
            name="Multan Fort",
            location="Multan",
            description="A historic fort area offering views of Multan and its important heritage sites.",
            category="Historical",
            image_url="multan_fort.jpg",
            latitude=30.1970,
            longitude=71.4680
        ),

        Place(
            name="Shrine of Shah Rukn-e-Alam",
            location="Multan",
            description="A famous Sufi shrine known for its beautiful architecture and cultural importance.",
            category="Religious",
            image_url="shah_rukn_e_alam.jpg",
            latitude=30.1980,
            longitude=71.4685
        ),

        Place(
            name="Multan Ghanta Ghar",
            location="Multan",
            description="A historic clock tower and one of the recognizable landmarks of Multan.",
            category="Historical",
            image_url="multan_ghanta_ghar.jpg",
            latitude=30.1965,
            longitude=71.4695
        ),

        Place(
            name="Multan Museum",
            location="Multan",
            description="A cultural museum featuring historical and archaeological collections from the region.",
            category="Museum",
            image_url="multan_museum.jpg",
            latitude=30.1950,
            longitude=71.4750
        ),
    ]

    # =========================================================
    # ADD ONLY IF PLACE DOES NOT ALREADY EXIST
    # =========================================================

    for place in places:

        existing = db.query(Place).filter(
            Place.name == place.name
        ).first()

        if not existing:
            db.add(place)

    db.commit()
    db.close()

    print("Bahawalpur, Lahore and Multan places added successfully.")


if __name__ == "__main__":
    seed_places()