from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class QueryRequest(BaseModel):
    message: str

QWEN_API_KEY = os.getenv('QWEN_API_KEY')
QWEN_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation '

@app.post('/chat')
async def chat(request: QueryRequest):
    headers = {
        'Authorization': f'Bearer {QWEN_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'qwen-max',
        'input': {'prompt': request.message}
    }

    try:
        response = requests.post(QWEN_ENDPOINT, json=payload, headers=headers)
        return {'response': response.json()['output']['text']}
    except Exception as e:
        raise HTTPException(500, detail=str(e))

@app.get('/')
def home():
    return {'status': 'AI Agent is running'}
