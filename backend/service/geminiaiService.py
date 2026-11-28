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


from google.genai import types
async def generateResponseImage(data,image=None):
    try:
        prompt = f"""
        Your answer will be given in the mentioned Language: {data.language}
        Question: {data.query}
        """

        content = [prompt]
        if image:
            image_bytes = await image.read()
            content.append(types.Part.from_bytes(
                data=image_bytes, mime_type=image.content_type
            ))        

        response=await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=content
        )
        return {
            "status": True, 
            "response": response.text
        } 
    except Exception as e:
        return {
            "status": False, 
            "message": str(e)
        }

async def generateVideoResponse(data):
    try:
        prompt = f"""
        Your answer will be given in the mentioned Language: {data.language}
        Question: {data.query}
        """

        content = [prompt]
        if data.youtube_url:
            content.append(types.Part.from_url(
                url=data.youtube_url
            ))        

        response=await client.aio.models.generate_content(
            model=settings.gemini_model,
            contents=content
        )
        return {
            "status": True, 
            "response": response.text
        } 
    except Exception as e:
        return {
            "status": False, 
            "message": str(e)
        }

import asyncio
from transformers import AutoTokenizer
from functools import lru_cache

@lru_cache(maxsize=1)
def get_tokenizer(modelName):
    return AutoTokenizer.from_pretrained(modelName)

def tokenizeText(text, modelName):
    tokenizer = get_tokenizer(modelName)
    # tokenizer = loadTokenizer(modelName)
    encoded = tokenizer(text, add_special_tokens=False)
    tokens = tokenizer.convert_ids_to_tokens(encoded["input_ids"])
    return {
        "tokenizer": modelName,
        "tokens": tokens,
        "token_ids": encoded["input_ids"],
        "token_count": len(encoded["input_ids"])
    }

async def analyzeTokenization(data):
    try:
        tokenizers = {
            "BPE": "gpt2",
            "WordPiece": "bert-base-multilingual-cased",
            "SentencePiece": "google/mt5-small"
        }
        results = {}
        for algorithm, modelName in tokenizers.items():
            results[algorithm] = await asyncio.to_thread(tokenizeText, data.query, modelName)
        return{
            "status": True,
            "language": data.language,
            "query_text": data.query,
            "results": results
        }  
    except Exception as e:
        return {"status": False, "message": str(e)}