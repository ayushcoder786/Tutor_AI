from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    mongodb_url: str
    mongodb_dbname: str
    jwt_secretkey: str
    frontend_url: str
    gemini_apikey: str
    gemini_model: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Config()
