from app.db.database import engine, Base
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.booking import Booking
Base.metadata.create_all(bind=engine)

print("Database tables created")