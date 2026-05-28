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

    response = client.moderations.create(
        model="omni-moderation-latest",
        input=text
    )

    flagged = response.results[0].flagged

    if flagged:
        return {
            "status": "BLOCKED"
        }

    return {
        "status": "APPROVED"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )