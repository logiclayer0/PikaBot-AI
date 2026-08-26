from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import auth, chat

app = FastAPI(title="PikaBot API")

# React Frontend CORS configuration
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

@app.get("/")
def root():
    return {"status": "PikaBot Backend Engine Running!"}