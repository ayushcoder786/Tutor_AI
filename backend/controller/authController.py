import service.authService as auth
from fastapi import APIRouter, Request
from models.authModel import SignupModel, LoginModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
async def signup(data: SignupModel, request:Request):
    return await auth.signup(data, request.app.state.db)

@router.post("/login")
async def login(data: LoginModel, request:Request):
    return await auth.login(data, request.app.state.db)

@router.get("/rbac")
async def rbac(request: Request):
    authorization = request.headers.get("Authorization", "")

    if not authorization.startswith("Bearer "):
        return {
            "status": False,
            "message": "Authorization token missing"
        }

    token = authorization.split(" ", 1)[1]

    return await auth.rbac(token, request.app.state.db)