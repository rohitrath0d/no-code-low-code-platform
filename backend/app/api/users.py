from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_Session
# from app.models.user import User, UserCreate, UserResponse
from app.models.models import User, UserCreate, UserResponse
from passlib.context import CryptContext
from app.middlewares.auth_helpers import get_current_user
from app.models.models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["Users"])

# Create user
# @router.post("/", response_model=User)
@router.post("/", response_model=UserResponse)
# def create_user(user: User, session: Session = Depends(get_Session)):
def create_user(user_create: UserCreate, session: Session = Depends(get_Session)):
  # existingUser = session.exec(select(User).where(User.email == user.email)).first()
  existingUser = session.exec(select(User).where(User.email == user_create.email)).first()
  if existingUser:
    raise HTTPException(status_code=400, detail= "Email already registered")
  
  hashed = pwd_context.hash(user_create.password)
  
  # Convert pydantic model to DB model
  # user = User.from_orm(user_create)
  user = User(name=user_create.name, email=user_create.email, hashed_password=hashed)
  session.add(user)
  session.commit()
  session.refresh(user)
  return user

# Get all Users
# @router.get("/", response_model=list[User])
@router.get("/", response_model=list[UserResponse])
def get_users(session: Session = Depends(get_Session)):
  users= session.exec(select(User)).all()
  return users


@router.get("/me", response_model=UserResponse)
def get_logged_in_user(current_user: User = Depends(get_current_user)):
    return current_user
