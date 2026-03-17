from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI()

class ChatPayload(BaseModel):
    message: str
    history: list = None

@app.post("/api/chat")
async def chat_endpoint(payload: ChatPayload):
    return {"status": "success", "reply": "Test reply"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)
