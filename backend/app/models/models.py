from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Float
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from typing import Optional, List
from datetime import datetime
import uuid


# models.py- contains both SQLModel + Pydantic classes -> database models (table=True)
class User(SQLModel, table=True):
    #   id: int | None = Field(default = None, primary_key=True)
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --------------------
# Request Schema (Input)
# --------------------
class UserCreate(SQLModel):
    name: str
    email: str
    password: str


# # --------------------
# # Response Schema (Output)
# # --------------------
class UserResponse(SQLModel):
    id: int
    name: str
    email: str


class Document(SQLModel, table=True):
    id: Optional[int] | None = Field(default=None, primary_key=True)
    filename: str
    content: str
    # embedding: str  # Store as JSON string
    embedding: List[float] = Field(
        sa_column=Column(ARRAY(Float)))  # <-- native array
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class ChatLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_query: str
    response: str
    # context_used: str
    context_used: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # worflow if for fetching chats based on workflow
    workflow_id: Optional[int] = Field(default=None, foreign_key="workflow.id")


class Workflow(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None

    # components: dict                    # JSON of nodes and edges

    # defining as jsonB in postgres, just naming, the field as dict
    components: dict = Field(
        default_factory=dict,
        sa_column=Column(JSONB)
    )

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)  # Add this line
