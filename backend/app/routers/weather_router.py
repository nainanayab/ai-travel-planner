from fastapi import APIRouter, HTTPException

from app.services.weather_service import get_weather


router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


@router.get("/{city}")
def weather(city: str):

    result = get_weather(city)

    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result
        )

    return result