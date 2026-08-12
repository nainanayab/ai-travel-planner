from app.models.place import Place


def optimize_route(places: list[Place]):

    return sorted(
        places,
        key=lambda place: (
            place.latitude if place.latitude is not None else 0,
            place.longitude if place.longitude is not None else 0
        )
    )