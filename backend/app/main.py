from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import auth, chat, life_manager, user_stats

app = FastAPI(title="PikaBot-AI OS Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(life_manager.router)
app.include_router(user_stats.router)

@app.get("/")
def home():
    return {"status": "PikaBot Engine Active ⚡"}
