from contextlib import asynccontextmanager
from fastapi import FastAPI
from pymongo import AsyncMongoClient
from core.config import settings

client =AsyncMongoClient(settings.mongodb_url)
db = client[settings.mongodb_dbname]

async def dbConnect():
    await client.admin.command('ping')
    return db

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = await dbConnect()
    try:
        yield
    finally:
        await dbDisconnect()

async def dbDisconnect():
    await client.close()