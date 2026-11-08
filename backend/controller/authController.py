import service.authService as auth
from fastapi import APIRouter
from models.authModel import SignupModel, LoginModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
async def signup(data: SignupModel):
    return auth.signup(data)

@router.post("/login")
async def login(data: LoginModel):
    return auth.login(data)