from google import genai
from core.config import settings
client=genai.Client(api_key=settings.gemini_apikey)
async def generateResponse(data):
    try:
        response=await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=data.query
        )
        return {"status": True, "response": response.text} 
    except Exception as e:
        return {"status": False, "message": str(e)}