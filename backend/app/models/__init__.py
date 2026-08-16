# =========================================================
# IMPORT ALL SQLAlchemy MODELS
# =========================================================

from app.models.user import User
from app.models.place import Place
from app.models.preference import Preference
from app.models.favorite import Favorite

from app.models.transport import Transport
from app.models.transport_booking import TransportBooking

from app.models.trip import Trip
from app.models.trip_stop import TripStop

from app.models.budget import BudgetTrip
from app.models.budget_city import BudgetCity
from app.models.budget_transport import BudgetTransport

from app.models.hotel import Hotel
from app.models.booking import Booking