# from fastapi import FASTAPI
from fastapi import FastAPI
from app.api.ping import router as ping_router
from app.api.users import router as user_router
from app.api.upload import router as upload_router
from app.api.query import router as query_router
from app.api.workflow import router as runworkflow_router
from app.api.chat_logs import router as chatlogs_router
from app.middlewares.auth import router as auth_router

from sqlmodel import SQLModel
from app.core.database import engine  # Assuming your db setup is in app/db.py
from app.models.models import Document 
from app.models.models import ChatLog
from fastapi.middleware.cors import CORSMiddleware



# app = FASTAPI()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_tables():
    SQLModel.metadata.create_all(engine)

create_tables()


# Include the ping router
app.include_router(ping_router)

# Including user router, and same will now include routers for other functions
app.include_router(user_router)
app.include_router(upload_router)
app.include_router(query_router)
app.include_router(runworkflow_router)
app.include_router(chatlogs_router)
app.include_router(auth_router)

@app.get("/")
def root():
  return {"message": "Welcome to the no-code/low-code backend services!! All up and running!"}