from fastapi import APIRouter
from app.core.database import get_Session
from app.schemas.schemas import ChatLogRead
from app.models.models import ChatLog
from typing import List
from sqlmodel import select


router = APIRouter(prefix="/api/chat-logs", tags=["Chat Logs"])

# @router.get("/chat-logs", response_model=List[ChatLogRead])
@router.get("/", response_model=List[ChatLogRead])
def get_chat_logs():
    with next(get_Session()) as session:
        logs = session.exec(select(ChatLog).order_by(ChatLog.created_at.desc())).all()
        return logs

@router.get("/{workflow_id}", response_model=List[ChatLogRead])
def get_logs_for_workflow(workflow_id: int):
    with next(get_Session()) as session:
        logs = session.exec(
            select(ChatLog)
            .where(ChatLog.workflow_id == workflow_id)
            .order_by(ChatLog.created_at.desc())
        ).all()
        return logs