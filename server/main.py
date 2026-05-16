from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from .ai.utils import summarize_text, extract_tasks

load_dotenv()

app = FastAPI(title="TaskZen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Welcome to TaskZen API", "status": "active"}

@app.post("/ai/summarize")
async def summarize(req: AIRequest):
    try:
        summary = await summarize_text(req.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/extract-tasks")
async def tasks(req: AIRequest):
    try:
        tasks = await extract_tasks(req.text)
        return {"tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}
