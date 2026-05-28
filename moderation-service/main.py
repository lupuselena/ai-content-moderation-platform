from fastapi import FastAPI
from openai import OpenAI
from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()


@app.get("/")
def root():
    return {
        "message": "Moderation Service Running"
    }

@app.get("/health")
def health():
    return {
        "status": "UP"
    }

@app.post("/api/moderate")
def moderate_text(payload: dict):
    text = payload.get("text", "")

    try:
        response = client.moderations.create(
            model="omni-moderation-latest",
            input=text
        )

        flagged = response.results[0].flagged

        if flagged:
            return {
                "status": "BLOCKED",
                "provider": "OpenAI"
            }

        return {
            "status": "APPROVED",
            "provider": "OpenAI"
        }

    except Exception as e:
        toxic_words = ["hate", "hurt", "kill", "attack"]

        if any(word in text.lower() for word in toxic_words):
            return {
                "status": "BLOCKED",
                "provider": "Local fallback",
                "reason": "OpenAI unavailable or rate limited"
            }

        return {
            "status": "APPROVED",
            "provider": "Local fallback",
            "reason": "OpenAI unavailable or rate limited"
        }
    
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )