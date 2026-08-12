from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.chat_schema import ChatRequest
from app.services.chat_service import chat_with_ai

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    return chat_with_ai(
        db,
        request.message
    )