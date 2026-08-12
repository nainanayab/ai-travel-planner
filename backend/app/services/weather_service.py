
import os
import requests

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_weather(city: str):

    if not API_KEY:
        return {
            "error": "OPENWEATHER_API_KEY is not configured"
        }

    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}"
        f"&appid={API_KEY}"
        "&units=metric"
    )

    try:
        response = requests.get(
            url,
            timeout=30
        )

        if response.status_code != 200:
            return {
                "status_code": response.status_code,
                "error": response.text
            }

        data = response.json()

        return {
            "city": data["name"],
            "temperature": data["main"]["temp"],
            "weather": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]
        }

    except requests.RequestException as e:
        return {
            "error": f"Weather service unavailable: {str(e)}"
        }
    