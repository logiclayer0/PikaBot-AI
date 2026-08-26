from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_brain import AIBrainService
from app.database import save_chat, get_chat_history

router = APIRouter(prefix="/chat", tags=["Chat"])
ai_brain = AIBrainService()

class ChatRequest(BaseModel):
    username: str
    message: str

@router.post("/message")
async def send_message(req: ChatRequest):
    history = get_chat_history(req.username)
    save_chat(req.username, "user", req.message)
    
    reply = await ai_brain.generate_response(req.message, history)
    save_chat(req.username, "assistant", reply)
    
    return {"reply": reply}

@router.get("/history/{username}")
def history(username: str):
    return {"history": get_chat_history(username)}