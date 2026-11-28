from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from models.aiModel import AIModel
import service.geminiaiService as geminiai
from service.jwtService import validateToken

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini AI Model"]
)


# STANDARD ANSWER
@router.post("/ai")
async def ai(
    data: AIModel,
    payload: dict = Depends(validateToken)
):
    return await geminiai.generateResponse(data)


# STREAMING ANSWER
@router.post("/stream/ai")
async def stream_ai(
    data: AIModel,
    payload: dict = Depends(validateToken)
):
    return StreamingResponse(
        geminiai.generateStreamResponse(data),
        media_type="text/plain"
    )

from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File, Form
from typing import Optional
from types import SimpleNamespace
@router.post("/image")
async def image(
    payload: dict = Depends(validateToken),
    query: str = Form(...),
    language: str = Form("English"),
    image: Optional[UploadFile] = File(None)):
    date = SimpleNamespace(query=query, language=language)
    return await geminiai.generateResponseImage(date, image)

from models.aiModel import videoModel
from service.geminiaiService import generateVideoResponse
@router.post("/video/generate")
async def analyzeVideo(data: videoModel, payload: dict = Depends(validateToken)):
    result = await generateVideoResponse(data)
    return result

@router.post("/tokenize")
async def tokenize(data: AIModel, payload: dict = Depends(validateToken)):
    return await geminiai.analyzeTokenization(data)