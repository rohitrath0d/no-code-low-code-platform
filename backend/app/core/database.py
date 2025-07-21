from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Loading environment variables
load_dotenv()

DATABASE_URL= os.getenv("DATABASE_URL")

# creating SQLModel engine
engine = create_engine(DATABASE_URL, echo=True)     #echo=True shows SQL logs

# Session generator
def get_Session():
  with Session(engine) as session:
    yield session
    
