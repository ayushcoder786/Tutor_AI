from fastapi import APIRouter, Depends
from models.aiModel import AIModel
import service.geminiaiService as geminiai
from service.jwtService import validateToken
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/gemini", tags=["Gemini AI Model"])

@router.post("/ai")
async def ai(data: AIModel, payload: dict = Depends(validateToken)):
    return await geminiai.generateResponse(data)