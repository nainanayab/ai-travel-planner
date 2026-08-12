import os

from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

from app.models.place import Place
from app.services.route_optimizer import optimize_route


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_trip_plan(
    db: Session,
    location: str,
    days: int,
    category: str = None
):

    query = db.query(Place).filter(
        Place.location.ilike(f"%{location}%")
    )


    if category:
        query = query.filter(
            Place.category.ilike(f"%{category}%")
        )


    places = query.limit(days * 3).all()


    if not places:
        return {
            "message": "No places found for this destination"
        }


    places = optimize_route(places)


    place_info = ""


    for place in places:

        place_info += f"""
Name: {place.name}
Category: {place.category}
Description: {place.description}
Location: {place.location}

"""


    prompt = f"""
You are an AI Tourism Planner.

Create a {days} day travel itinerary for {location}.

Use only these places:

{place_info}

Give:
- Day wise plan
- Best visiting order
- Short travel tips
- Explain why each place is worth visiting

"""


    try:

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )


        return {
            "destination": location,
            "days": days,
            "ai_itinerary": response.text
        }


    except Exception as e:

        return {
            "error": str(e)
        }