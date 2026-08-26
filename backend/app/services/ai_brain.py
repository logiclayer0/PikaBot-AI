from app.config import settings
from groq import Groq


class AIBrainService:

  def __init__(self):
    if not settings.GROQ_API_KEY:
      raise ValueError("GROQ_API_KEY missing in environment variables!")
    # Explicitly pass the key from config settings
    self.client = Groq(api_key=settings.GROQ_API_KEY)
    # Standard active Groq model
    self.model = "openai/gpt-oss-120b"

  async def generate_response(
      self, prompt: str, history: list = None
  ) -> str:
    messages = [{
        "role": "system",
        "content": (
            "You are PikaBot, an intelligent, cute, and friendly AI assistant."
        ),
    }]

    if history:
      for item in history:
        messages.append({
            "role": item.get("role", "user"),
            "content": item.get("content", ""),
        })

    messages.append({"role": "user", "content": prompt})

    try:
      completion = self.client.chat.completions.create(
          model=self.model, messages=messages, temperature=0.7
      )
      return completion.choices[0].message.content
    except Exception as e:
      return f"AI Engine Error: {str(e)}"