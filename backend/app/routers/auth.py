from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import register_user, verify_user

router = APIRouter(prefix="/auth", tags=["Auth"])

class AuthData(BaseModel):
    username: str
    password: str

@router.post("/register")
def signup(data: AuthData):
    success, msg = register_user(data.username, data.password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg}

@router.post("/login")
def login(data: AuthData):
    if verify_user(data.username, data.password):
        return {"message": "Login successful", "username": data.username}
    raise HTTPException(status_code=401, detail="Invalid username or password")