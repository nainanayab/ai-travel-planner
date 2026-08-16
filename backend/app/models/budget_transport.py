from sqlalchemy import Column, Integer, String, Float

from app.db.database import Base


# =========================================================
# BUDGET TRANSPORT MODEL
# =========================================================

class BudgetTransport(Base):

    __tablename__ = "budget_transports"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # =====================================================
    # ROUTE INFORMATION
    # =====================================================

    from_city = Column(
        String,
        nullable=False,
        index=True,
    )

    to_city = Column(
        String,
        nullable=False,
        index=True,
    )

    # =====================================================
    # TRANSPORT INFORMATION
    # =====================================================

    transport_type = Column(
        String,
        nullable=False,
    )

    # =====================================================
    # DISTANCE
    # =====================================================

    distance_km = Column(
        Float,
        nullable=True,
    )

    # =====================================================
    # TRAVEL TIME
    # =====================================================

    travel_time_hours = Column(
        Float,
        nullable=True,
    )

    # =====================================================
    # TRANSPORT COST
    # =====================================================

    cost = Column(
        Float,
        nullable=True,
    )