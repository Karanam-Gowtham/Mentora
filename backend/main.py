from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Mentora API")

# ✅ ADD CORS HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.services.snapshot_service import compute_snapshot
from backend.services.analyzer_service import analyze_performance
from backend.services.ai_service import generate_ai_analysis

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")

@app.get("/analysis")
def analysis():

    snapshot = compute_snapshot(DATA_DIR)
    risk_flags = analyze_performance(snapshot)
    ai_output = generate_ai_analysis(snapshot, risk_flags)

    return {
        "snapshot": snapshot,
        "risk_flags": risk_flags,
        "analysis": ai_output
    }