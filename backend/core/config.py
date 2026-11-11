from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    mongodb_url: str
    mongodb_dbname: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Config()
