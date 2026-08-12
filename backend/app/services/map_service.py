from app.models.place import Place


def get_google_maps_link(place: Place):

    if place.latitude is None or place.longitude is None:
        return None

    return (
        f"https://www.google.com/maps?q="
        f"{place.latitude},{place.longitude}"
    )


def get_trip_route(places):

    if not places:
        return None

    coordinates = []

    for place in places:

        if (
            place.latitude is not None
            and place.longitude is not None
        ):
            coordinates.append(
                f"{place.latitude},{place.longitude}"
            )

    if not coordinates:
        return None

    return (
        "https://www.google.com/maps/dir/"
        + "/".join(coordinates)
    )