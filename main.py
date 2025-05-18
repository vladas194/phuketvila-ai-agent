from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str

QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation "

@app.post("/chat")
async def chat(request: QueryRequest):
    headers = {
        "Authorization": f"Bearer {QWEN_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "qwen-max",  # можно использовать qwen-plus/qwen-turbo
        "input": {
            "prompt": request.message
        },
        "parameters": {}
    }

    try:
        response = requests.post(QWEN_ENDPOINT, headers=headers, json=payload)
        data = response.json()
        return {"response": data["output"]["text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"status": "AI Agent is running!"}
