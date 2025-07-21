from fastapi import Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from app.models.models import User
from app.core.database import get_Session
from dotenv import load_dotenv
import os
from fastapi import Header

load_dotenv()

SECRET_KEY= os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_Session)) -> User:
def get_current_user(authorization: str = Header(...), session: Session = Depends(get_Session)) -> User:
  if not authorization.startswith("Bearer "):
    raise HTTPException(status_code=401, detail="Invalid token format")
    
  token = authorization.split(" ")[1]
    
  credentials_exception = HTTPException(
      status_code=401,
      detail="Invalid credentials",
      headers={"WWW-Authenticate": "Bearer"},
  )

  try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
  except JWTError:
        raise credentials_exception

  user = session.exec(select(User).where(User.email == email)).first()
  if user is None:
        raise credentials_exception
    
  return user
