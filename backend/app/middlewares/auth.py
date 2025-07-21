from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.models import User
from app.core.database import get_Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import Body
from fastapi import Form
import os

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY= os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  
@router.post("/refresh")
def refresh_token(refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(data={"sub": email}, expires_delta=timedelta(minutes=30))
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@router.post("/login")
# def login_user(email: str, password: str, session: Session = Depends(get_Session)):
def login_user( email: str = Form(...), password: str = Form(...), session: Session = Depends(get_Session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=30))
    refresh_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(days=7))
    return {
      "access_token": access_token, 
      "refresh_token": refresh_token,
      "token_type": "bearer"
    }
