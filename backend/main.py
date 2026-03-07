import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from ingestion.fetch_leetcode import fetch_leetcode
import os

load_dotenv()

app = FastAPI(title="Mentora API")

# ------------------------------------
# CORS
# ------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------
# Services
# ------------------------------------
from backend.services.snapshot_service import compute_snapshot
from backend.services.analyzer_service import analyze_performance
from dsa_intelligence.rag_layer import generate_rag_analysis


# ------------------------------------
# Paths
# ------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


# ------------------------------------
# API Endpoint
# ------------------------------------
@app.get("/analysis")
def analysis():

    # STEP 1: fetch latest LeetCode data
    fetch_leetcode()

    # STEP 2: compute performance snapshot
    snapshot = compute_snapshot(DATA_DIR)

    # STEP 3: detect risk flags
    risk_flags = analyze_performance(snapshot)

    # STEP 4: run RAG AI analysis
    ai_output = generate_rag_analysis()

    return {
        "snapshot": snapshot,
        "risk_flags": risk_flags,
        "analysis": ai_output
    }

@app.post("/sync")
def sync_leetcode():

    fetch_leetcode()

    return {"status": "LeetCode profile synced"}

@app.get("/progress")
def progress():

    difficulty_file = os.path.join(DATA_DIR, "difficulty_history.csv")

    df = pd.read_csv(difficulty_file)

    latest = df.groupby(["timestamp", "difficulty"])["count"].max().reset_index()

    easy = latest[latest["difficulty"] == "Easy"]
    medium = latest[latest["difficulty"] == "Medium"]
    hard = latest[latest["difficulty"] == "Hard"]

    data = []

    for i in range(len(easy)):
        data.append({
            "time": easy.iloc[i]["timestamp"],
            "easy": int(easy.iloc[i]["count"]),
            "medium": int(medium.iloc[i]["count"]),
            "hard": int(hard.iloc[i]["count"])
        })

    return data