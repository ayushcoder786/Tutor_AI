from fastapi import FastAPI
from controller.authController import router as AuthRouter
app = FastAPI(title="TutorAI", description="An AI-powered tutoring platform", version="1.0.0")

app.include_router(AuthRouter)

@app.get("/home")
async def home():
    return {"message": "Welcome to TutorAI!"}

@app.get("/",tags=["Root"])
async def root():
    return {"message": "Welcome to TutorAI!"}
