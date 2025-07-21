from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

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
    uploaded_at: datetime

# Chat Log
class ChatLogCreate(BaseModel):
    user_query: str
    response: str
    context_used: str

class ChatLogRead(ChatLogCreate):
    id: int
    created_at: datetime


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
    top_k: Optional[int] = 1           #Default to 1 if not provided
    workflow_id: Optional[int] = None 

    

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str]
    components: dict  

class WorkflowRead(WorkflowCreate):
    id: int
    name: str
    description: str
    components: dict
    created_at: datetime
    
    class Config:
        orm_mode = True