from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.budget_transport import BudgetTransport
from app.schemas.budget_transport_schema import (
    BudgetTransportCreate,
    BudgetTransportResponse,
)


router = APIRouter(
    prefix="/budget-transports",
    tags=["Budget Transport"],
)


# =========================================================
# CREATE BUDGET TRANSPORT
# =========================================================

@router.post(
    "/",
    response_model=BudgetTransportResponse,
)
def create_budget_transport(
    transport: BudgetTransportCreate,
    db: Session = Depends(get_db),
):

    if not transport.from_city.strip():
        raise HTTPException(
            status_code=400,
            detail="From city is required",
        )

    if not transport.to_city.strip():
        raise HTTPException(
            status_code=400,
            detail="To city is required",
        )

    if not transport.transport_type.strip():
        raise HTTPException(
            status_code=400,
            detail="Transport type is required",
        )

    if transport.cost is not None and transport.cost < 0:
        raise HTTPException(
            status_code=400,
            detail="Transport cost cannot be negative",
        )

    new_transport = BudgetTransport(
        from_city=transport.from_city.strip(),
        to_city=transport.to_city.strip(),
        transport_type=transport.transport_type.strip(),
        distance_km=transport.distance_km,
        travel_time_hours=transport.travel_time_hours,
        cost=transport.cost,
    )

    db.add(new_transport)
    db.commit()
    db.refresh(new_transport)

    return new_transport


# =========================================================
# GET ALL BUDGET TRANSPORTS
# =========================================================

@router.get(
    "/",
    response_model=list[BudgetTransportResponse],
)
def get_budget_transports(
    db: Session = Depends(get_db),
):

    return (
        db.query(BudgetTransport)
        .order_by(BudgetTransport.cost.asc())
        .all()
    )


# =========================================================
# SEARCH AFFORDABLE TRANSPORT
#
# DIFFERENT CITIES:
#   Coaster
#   Train
#   Private Car
#
# SAME CITY:
#   Double Decker Bus
#   Private Car
#
# Double Decker Bus is NOT allowed between cities.
# =========================================================

@router.get(
    "/search/affordable",
    response_model=list[BudgetTransportResponse],
)
def search_affordable_transport(
    from_city: str,
    to_city: str,
    budget: float,
    db: Session = Depends(get_db),
):

    from_city_clean = from_city.strip()
    to_city_clean = to_city.strip()

    if not from_city_clean:
        raise HTTPException(
            status_code=400,
            detail="From city is required",
        )

    if not to_city_clean:
        raise HTTPException(
            status_code=400,
            detail="To city is required",
        )

    if budget < 0:
        raise HTTPException(
            status_code=400,
            detail="Budget cannot be negative",
        )

    # =====================================================
    # SAME CITY OR DIFFERENT CITY
    # =====================================================

    same_city = (
        from_city_clean.lower()
        == to_city_clean.lower()
    )

    # =====================================================
    # BASE QUERY
    # =====================================================

    query = (
        db.query(BudgetTransport)
        .filter(
            BudgetTransport.from_city.ilike(
                from_city_clean
            ),
            BudgetTransport.to_city.ilike(
                to_city_clean
            ),
            BudgetTransport.cost.isnot(None),
            BudgetTransport.cost <= budget,
        )
    )

    # =====================================================
    # DIFFERENT CITY
    # =====================================================

    if not same_city:

        query = query.filter(
            BudgetTransport.transport_type.ilike(
                "Coaster"
            )
            |
            BudgetTransport.transport_type.ilike(
                "Train"
            )
            |
            BudgetTransport.transport_type.ilike(
                "Private Car"
            )
        )

    # =====================================================
    # SAME CITY
    # =====================================================

    else:

        query = query.filter(
            BudgetTransport.transport_type.ilike(
                "Double Decker Bus"
            )
            |
            BudgetTransport.transport_type.ilike(
                "Private Car"
            )
        )

    # =====================================================
    # RETURN CHEAPEST FIRST
    # =====================================================

    return (
        query
        .order_by(
            BudgetTransport.cost.asc()
        )
        .all()
    )


# =========================================================
# GET SINGLE BUDGET TRANSPORT
# =========================================================

@router.get(
    "/{transport_id}",
    response_model=BudgetTransportResponse,
)
def get_budget_transport(
    transport_id: int,
    db: Session = Depends(get_db),
):

    transport = (
        db.query(BudgetTransport)
        .filter(
            BudgetTransport.id == transport_id
        )
        .first()
    )

    if not transport:
        raise HTTPException(
            status_code=404,
            detail="Budget transport not found",
        )

    return transport


# =========================================================
# DELETE BUDGET TRANSPORT
# =========================================================

@router.delete(
    "/{transport_id}",
)
def delete_budget_transport(
    transport_id: int,
    db: Session = Depends(get_db),
):

    transport = (
        db.query(BudgetTransport)
        .filter(
            BudgetTransport.id == transport_id
        )
        .first()
    )

    if not transport:
        raise HTTPException(
            status_code=404,
            detail="Budget transport not found",
        )

    db.delete(transport)
    db.commit()

    return {
        "message": "Budget transport deleted successfully",
        "id": transport_id,
    }