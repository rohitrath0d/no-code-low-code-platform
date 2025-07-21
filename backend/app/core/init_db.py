from sqlmodel import SQLModel
# from app.models.user import User
from app.models.models import User
from app.core.database import engine


def init_db():
  SQLModel.metadata.create_all(engine)
  
if __name__ == "__main__":
  init_db()