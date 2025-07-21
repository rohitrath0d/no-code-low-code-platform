from fastapi import APIRouter
from app.core.database import get_Session
from app.schemas.schemas import ChatLogRead
from app.models.models import ChatLog
from typing import List
from sqlmodel import select


router = APIRouter(prefix="/chatlogs", tags=["Chat Logs"])

@router.get("/chat-logs", response_model=List[ChatLogRead])
def get_chat_logs():
    with next(get_Session()) as session:
        logs = session.exec(select(ChatLog).order_by(ChatLog.created_at.desc())).all()
        return logs
