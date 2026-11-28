from pydantic import BaseModel

class AIModel(BaseModel):
    query: str
    language: str

from pydantic import BaseModel, HttpUrl 
class videoModel(BaseModel):
    query: str
    language: str = "English"
    youtube_url: HttpUrl

