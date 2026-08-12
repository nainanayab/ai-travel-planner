from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User

from app.schemas.transport_schema import (
    TransportCreate,
    TransportUpdate,
    TransportResponse,
)

from app.services.transport_service import (
    create_transport,
    get_user_transport,
    get_all_transport,
    get_trip_transport,
    get_trip_stop_transport,
    get_transport,
    update_transport,
    delete_transport,
    get_trip_transport_total,
)

from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/transports",
    tags=["Transport"],
)


# =========================================================
# GET ALL ACTIVE TRANSPORT
# =========================================================

@router.get(
    "/",
    response_model=list[TransportResponse],
)
def all_transport(
    db: Session = Depends(get_db),
):
    """
    Public list of all active transport services.
    """

    return get_all_transport(db)


# =========================================================
# CREATE TRANSPORT
# =========================================================

@router.post(
    "/",
    response_model=TransportResponse,
)
def create_new_transport(
    transport: TransportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a transport service.

    City sightseeing:
        Double Decker Bus

    City-to-city:
        Coaster

    Transport can optionally belong to:
        Trip
        TripStop
    """

    result = create_transport(
        db=db,

        # -------------------------------------------------
        # USER
        # -------------------------------------------------

        user_id=current_user.id,

        # -------------------------------------------------
        # TRIP
        # -------------------------------------------------

        trip_id=transport.trip_id,
        trip_stop_id=transport.trip_stop_id,

        # -------------------------------------------------
        # TRANSPORT
        # -------------------------------------------------

        transport_type=transport.transport_type,
        vehicle_type=transport.vehicle_type,

        company_name=transport.company_name,

        # -------------------------------------------------
        # ROUTE
        # -------------------------------------------------

        route=transport.route,

        from_location=transport.from_location,
        to_location=transport.to_location,

        # -------------------------------------------------
        # TIMING
        # -------------------------------------------------

        departure_time=transport.departure_time,
        arrival_time=transport.arrival_time,

        # -------------------------------------------------
        # SEATS
        # -------------------------------------------------

        total_seats=transport.total_seats,
        available_seats=transport.available_seats,

        passengers=transport.passengers,

        # -------------------------------------------------
        # PRICE
        # -------------------------------------------------

        price_per_person=transport.price_per_person,

        # -------------------------------------------------
        # JOURNEY
        # -------------------------------------------------

        journey_type=transport.journey_type,

        # -------------------------------------------------
        # CONTACT
        # -------------------------------------------------

        phone=transport.phone,
    )

    if not result:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to create transport. "
                "Check trip, trip stop, route, seats, "
                "passengers, price and required fields."
            ),
        )

    return result


# =========================================================
# GET MY TRANSPORT
# =========================================================

@router.get(
    "/my",
    response_model=list[TransportResponse],
)
def my_transport(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get active transport created by the logged-in user.
    """

    return get_user_transport(
        db=db,
        user_id=current_user.id,
    )


# =========================================================
# GET TRANSPORT FOR TRIP
# =========================================================

@router.get(
    "/trip/{trip_id}",
    response_model=list[TransportResponse],
)
def trip_transport(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all active transport belonging to a Trip.
    """

    result = get_trip_transport(
        db=db,
        trip_id=trip_id,
        user_id=current_user.id,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found.",
        )

    return result


# =========================================================
# GET TOTAL TRANSPORT COST FOR TRIP
# IMPORTANT: KEEP THIS BEFORE /{transport_id}
# =========================================================

@router.get(
    "/trip/{trip_id}/total",
)
def trip_transport_total(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate total transport cost for a Trip.
    """

    result = get_trip_transport_total(
        db=db,
        trip_id=trip_id,
        user_id=current_user.id,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found.",
        )

    return {
        "trip_id": trip_id,
        "transport_total": result,
    }


# =========================================================
# GET TRANSPORT FOR TRIP STOP
# =========================================================

@router.get(
    "/trip-stop/{trip_stop_id}",
    response_model=list[TransportResponse],
)
def trip_stop_transport(
    trip_stop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all active transport assigned to a TripStop.
    """

    result = get_trip_stop_transport(
        db=db,
        trip_stop_id=trip_stop_id,
        user_id=current_user.id,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Trip stop not found.",
        )

    return result


# =========================================================
# GET SINGLE TRANSPORT
# =========================================================

@router.get(
    "/{transport_id}",
    response_model=TransportResponse,
)
def single_transport(
    transport_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get one transport service accessible to
    the logged-in user.
    """

    result = get_transport(
        db=db,
        transport_id=transport_id,
        user_id=current_user.id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Transport not found.",
        )

    return result


# =========================================================
# UPDATE TRANSPORT
# =========================================================

@router.put(
    "/{transport_id}",
    response_model=TransportResponse,
)
def edit_transport(
    transport_id: int,
    transport: TransportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing transport service.
    """

    result = update_transport(
        db=db,

        transport_id=transport_id,

        user_id=current_user.id,

        # -------------------------------------------------
        # COMPANY
        # -------------------------------------------------

        company_name=transport.company_name,

        # -------------------------------------------------
        # VEHICLE
        # -------------------------------------------------

        vehicle_type=transport.vehicle_type,

        # -------------------------------------------------
        # LOCATION
        # -------------------------------------------------

        from_location=transport.from_location,
        to_location=transport.to_location,

        # -------------------------------------------------
        # TIMING
        # -------------------------------------------------

        departure_time=transport.departure_time,
        arrival_time=transport.arrival_time,

        # -------------------------------------------------
        # SEATS
        # -------------------------------------------------

        total_seats=transport.total_seats,
        available_seats=transport.available_seats,

        # -------------------------------------------------
        # PRICE
        # -------------------------------------------------

        price_per_person=transport.price_per_person,

        # -------------------------------------------------
        # CONTACT
        # -------------------------------------------------

        phone=transport.phone,

        # -------------------------------------------------
        # STATUS
        # -------------------------------------------------

        status=transport.status,

        # -------------------------------------------------
        # ACTIVE
        # -------------------------------------------------

        is_active=transport.is_active,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail=(
                "Transport not found or "
                "update failed."
            ),
        )

    return result


# =========================================================
# DELETE / DEACTIVATE TRANSPORT
# =========================================================

@router.delete(
    "/{transport_id}",
    response_model=TransportResponse,
)
def remove_transport(
    transport_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Soft-delete/deactivate transport.

    Database record remains, but:
        is_active = False
        status = Cancelled
    """

    result = delete_transport(
        db=db,

        transport_id=transport_id,

        user_id=current_user.id,
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Transport not found.",
        )

    return result