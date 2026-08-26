import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

  GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
  JWT_SECRET: str = os.getenv("JWT_SECRET", "pikabot_secret_key_2026")
  ALGORITHM: str = "HS256"


settings = Settings()