from google import genai
from core.config import settings
client=genai.Client(api_key=settings.gemini_apikey)
async def generateResponse(data):
    try:
        prompt = f"""
        Your answer will be given in the mentioned Language: {data.language}
        Question: {data.query}
        """

        response=await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=prompt
        )
        return {"status": True, "response": response.text} 
    except Exception as e:
        return {"status": False, "message": str(e)}

async def generateStreamResponse(data):
    try:
        prompt = f"""
        Your answer will be given in the mentioned Language: {data.language}
        Question: {data.query}
        """

        async for chunk in await client.aio.models.generate_content_stream(
            model=settings.gemini_model,
            contents=prompt
        ):
            if chunk.text:
                yield chunk.text

    except Exception as e:
        yield f"\n[Error]: {str(e)}"

