from sqlalchemy import create_engine
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

try:
    connection = engine.connect()
    print("✅ Database Connected Successfully!")
    connection.close()
except Exception as e:
    print("❌ Connection Failed")
    print(e)