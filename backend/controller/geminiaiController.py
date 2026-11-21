# from fastapi import APIRouter, Depends, Header, HTTPException
# from models.aiModel import AIModel
# import service.geminiaiService as geminiai
# from service.jwtService import validateToken
# from fastapi.responses import StreamingResponse

# router = APIRouter(prefix="/gemini", tags=["Gemini AI Model"])


# def get_current_user(authorization: str = Header(default=None, alias="Authorization")):
#     print("Authorization received:", repr(authorization))
#     if not authorization:
#         raise HTTPException(status_code=401, detail="Token missing")

#     if authorization.lower().startswith("bearer "):
#         token = authorization[7:].strip()
#     else:
#         token = authorization.strip()

#     payload = validateToken(token)

#     if not payload:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")

#     return payload

# @router.post("/ai")
# # async def ai(data: AIModel, payload: dict = Depends(validateToken)):
# async def ai(data: AIModel, payload: dict = Depends(get_current_user)):
#     return await geminiai.generateResponse(data)

# @router.post("/stream/ai")
# async def streamAI(data: AIModel, payload: dict = Depends(get_current_user)):
#     return StreamingResponse(
#         geminiai.generateStreamResponse(data),
#         media_type="text/plain",
#         headers={
#             "Cache-Control": "no-cache",
#             "X-Accel-Buffering": "no"
#         }
#     )

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
