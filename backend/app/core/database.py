from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Loading environment variables
load_dotenv()

DATABASE_URL= os.getenv("DATABASE_URL")

if not DATABASE_URL:
  raise RuntimeError("❌ GEMINI_API_KEY environment variable is not set")

# creating SQLModel engine
engine = create_engine(DATABASE_URL, echo=True)     #echo=True shows SQL logs

# Session generator
def get_Session():
  with Session(engine) as session:
    yield session
    
