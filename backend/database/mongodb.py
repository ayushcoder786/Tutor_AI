from fastapi import FastAPI
from pymongo import AsyncMongoClient
from core.config import settings



client =AsyncMongoClient(settings.mongodb_url)
db = client[settings.mongodb_dbname]