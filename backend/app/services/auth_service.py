from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import verify_password
from app.utils.jwt import create_access_token


def login_user(
    db: Session,
    email: str,
    password: str
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    if not user:
        return None


    if not verify_password(
        password,
        user.password
    ):
        return None


    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
    )


    return {
        "access_token": token,
        "token_type": "bearer"
    }