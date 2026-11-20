from fastapi import APIRouter, Depends, Header, HTTPException
from models.aiModel import AIModel
import service.geminiaiService as geminiai
from service.jwtService import validateToken
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/gemini", tags=["Gemini AI Model"])


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ", 1)[1]
    payload = validateToken(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload

@router.post("/ai")
# async def ai(data: AIModel, payload: dict = Depends(validateToken)):
async def ai(data: AIModel, payload: dict = Depends(get_current_user)):
    return await geminiai.generateResponse(data)