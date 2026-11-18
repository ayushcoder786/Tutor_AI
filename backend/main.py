from fastapi import FastAPI
from controller.authController import router as AuthRouter
from controller.init import *
from database.mongodb import lifespan
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TutorAI", 
    description="An AI-powered tutoring platform", 
    version="1.0.0",
    lifespan=lifespan
    )

#Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)

app.include_router(AuthRouter)
app.include_router(GeminiAIRouter)

@app.get("/home")
async def home():
    return {"message": "Welcome to TutorAI!"}

@app.get("/",tags=["Root"])
async def root():
    return {"message": "Welcome to TutorAI!"}
