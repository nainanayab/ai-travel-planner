from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.utils.security import hash_password


def create_user(db: Session, user: UserCreate):

    new_user = User(
    full_name=user.full_name,
    email=user.email,
    password=hash_password(user.password),
    phone=user.phone
)

   

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email
    }