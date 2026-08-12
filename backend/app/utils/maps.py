def generate_google_maps_link(
    latitude: float,
    longitude: float
):
    if latitude is None or longitude is None:
        return None

    return f"https://www.google.com/maps?q={latitude},{longitude}"