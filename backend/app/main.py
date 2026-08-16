from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine


# =========================================================
# LOAD ALL MODELS
# =========================================================

import app.models


# =========================================================
# ROUTERS
# =========================================================

from app.routers.user_router import router as user_router
from app.routers.place_router import router as place_router
from app.routers.admin_router import router as admin_router
from app.routers.preference_router import router as preference_router
from app.routers.chat_router import router as chat_router
from app.routers.review_router import router as review_router
from app.routers.favorite_router import router as favorite_router
from app.routers.booking_router import router as booking_router
from app.routers.hotel_router import router as hotel_router
from app.routers.recommendation_router import router as recommendation_router
from app.routers.trip_router import router as trip_router
from app.routers.trip_stop_router import router as trip_stop_router
from app.routers.ai_trip_router import router as ai_trip_router
from app.routers.ai_save_router import router as ai_save_router
from app.routers.weather_router import router as weather_router
from app.routers.transport_router import router as transport_router

from app.routers.transport_booking_router import (
    router as transport_booking_router
)

from app.routers.budget_trip_router import (
    router as budget_trip_router
)

from app.routers.budget_transport_router import (
    router as budget_transport_router
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AI Tourism Platform",
    version="1.0.0",
    description="AI-powered tourism and travel management platform",
)


# =========================================================
# STATIC FILES
# =========================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# REGISTER ROUTERS
# =========================================================

# ---------------------------------------------------------
# USER
# ---------------------------------------------------------

app.include_router(user_router)


# ---------------------------------------------------------
# PLACES
# ---------------------------------------------------------

app.include_router(place_router)


# ---------------------------------------------------------
# ADMIN
# ---------------------------------------------------------

app.include_router(admin_router)


# ---------------------------------------------------------
# USER PREFERENCES
# ---------------------------------------------------------

app.include_router(preference_router)


# ---------------------------------------------------------
# AI CHAT
# ---------------------------------------------------------

app.include_router(chat_router)


# ---------------------------------------------------------
# REVIEWS
# ---------------------------------------------------------

app.include_router(review_router)


# ---------------------------------------------------------
# FAVORITES / WISHLIST
# ---------------------------------------------------------

app.include_router(favorite_router)


# ---------------------------------------------------------
# BOOKINGS
# ---------------------------------------------------------

app.include_router(booking_router)


# ---------------------------------------------------------
# HOTELS
# ---------------------------------------------------------

app.include_router(hotel_router)


# ---------------------------------------------------------
# RECOMMENDATIONS
# ---------------------------------------------------------

app.include_router(recommendation_router)


# ---------------------------------------------------------
# TRIPS
# ---------------------------------------------------------

app.include_router(trip_router)


# ---------------------------------------------------------
# TRIP STOPS
# ---------------------------------------------------------

app.include_router(trip_stop_router)


# ---------------------------------------------------------
# AI TRIP PLANNER
# ---------------------------------------------------------

app.include_router(ai_trip_router)


# ---------------------------------------------------------
# SAVE AI TRIP
# ---------------------------------------------------------

app.include_router(ai_save_router)


# ---------------------------------------------------------
# WEATHER
# ---------------------------------------------------------

app.include_router(weather_router)


# ---------------------------------------------------------
# TRANSPORT
# ---------------------------------------------------------

app.include_router(transport_router)


# ---------------------------------------------------------
# TRANSPORT BOOKINGS
# ---------------------------------------------------------

app.include_router(transport_booking_router)


# ---------------------------------------------------------
# BUDGET TRIP
# ---------------------------------------------------------

app.include_router(budget_trip_router)


# ---------------------------------------------------------
# BUDGET TRANSPORT
# ---------------------------------------------------------

app.include_router(budget_transport_router)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "AI Tourism Platform API is running",
        "status": "success"
    }
