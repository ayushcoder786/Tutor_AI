from pydantic import BaseModel

class AIModel(BaseModel):
    query: str
    language: str

