from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import Field

# shemas.py -> contains req/res structure -> request/response validation (table=False)

# Document


class QueryRequest(BaseModel):
    query: str
    top_k: int = 3          # optional:   top_k: int = 3  -> default if client doesn't send it
    custom_prompt: Optional[str] = ""
    workflow_id: Optional[int]


class DocumentCreate(BaseModel):
    id: int
    filename: str
    content: str
    # embedding: str
    embedding: List[float]


class DocumentRead(DocumentCreate):
    id: int
    file_id: str
    filename: str
    content: str
    embedding: List[float]  # Include if needed in response
    uploaded_at: datetime

    class Config:
        from_attributes = True  # This replaces the deprecated orm_mode

class UploadResponse(BaseModel):
    file_id: str
    document: DocumentRead
    status: str


# Chat Log
class ChatLogCreate(BaseModel):
    user_query: str
    response: str
    context_used: str


class ChatLogRead(ChatLogCreate):
    id: int
    created_at: datetime


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class Component(BaseModel):
    id: str
    type: str  # e.g., 'user_query', 'knowledge_base', 'llm_engine', 'output'
    config: Optional[dict] = {}


class WorkflowRunRequest(BaseModel):
    query: str
    # use_knowledge_base: Optional[bool] = True
    custom_prompt: Optional[str] = ""
    # top_k: Optional[int] = 3
    components: List[Component]
    top_k: Optional[int] = 1  # Default to 1 if not provided
    workflow_id: Optional[int] = None
    chat_history: Optional[List[ChatMessage]] = None


class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    # Make optional with empty dict default
    components: Optional[dict] = Field(default_factory=dict)


class WorkflowRead(WorkflowCreate):
    id: int
    name: str
    description: str
    components: dict
    created_at: datetime

    class Config:
        orm_mode = True

# class WorkflowSaveRequest(BaseModel):
#     id: int
#     nodes: List[dict]
#     edges: List[dict]
