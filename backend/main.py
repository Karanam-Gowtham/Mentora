import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from backend.ingestion.fetch_leetcode import fetch_leetcode
from backend.services.problem_selector import select_training_problems
from backend.services.snapshot_service import compute_snapshot
from backend.services.analyzer_service import analyze_performance
from backend.services.skill_service import compute_skill_scores
from backend.services.curriculum_service import generate_curriculum
from backend.services.attempt_service import record_attempt
from backend.services.state_service import update_state
from backend.services.hash_service import compute_file_hash
from backend.services.insight_service import generate_daily_insight

from dsa_intelligence.rag_layer import generate_rag_analysis

import os
import json

load_dotenv()

app = FastAPI(title="Mentora API")

# ------------------------------------
# CORS
# ------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------
# Paths
# ------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

CACHE_FILE = os.path.join(DATA_DIR, "analysis_cache.json")
STATE_FILE = os.path.join(DATA_DIR, "state_snapshot.json")

LEETCODE_DATA_FILE = os.path.join(DATA_DIR, "leetcode_data.json")

# ------------------------------------
# Attempt Schema
# ------------------------------------

class Attempt(BaseModel):
    problem: str
    topic: str
    difficulty: str
    result: str
    time_taken: int


# ------------------------------------
# Health Check
# ------------------------------------

@app.get("/")
def health():
    return {"status": "Mentora API running"}


# ------------------------------------
# Analysis Endpoint
# ------------------------------------

@app.get("/analysis")
def analysis():

    if not os.path.exists(CACHE_FILE):
        return {"status": "No analysis available. Run /sync first."}

    with open(CACHE_FILE, "r") as f:
        return json.load(f)


# ------------------------------------
# Sync Pipeline
# ------------------------------------

@app.post("/sync")
def sync_leetcode():

    fetch_leetcode()

    current_hash = compute_file_hash(LEETCODE_DATA_FILE)
    previous_hash = None

    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            previous_state = json.load(f)
            previous_hash = previous_state.get("data_hash")

    if previous_hash == current_hash:
        print("No new data — recomputing insights only")

    snapshot = compute_snapshot(DATA_DIR)

    skills = compute_skill_scores(DATA_DIR)

    previous_topic = None
    previous_analysis = None

    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            previous_state = json.load(f)
            previous_topic = previous_state.get("weakest_topic")

    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
            previous_analysis = cache.get("analysis")

    state = update_state(DATA_DIR, snapshot, skills)
    state["data_hash"] = current_hash

    risk_flags = analyze_performance(snapshot)

    insight = generate_daily_insight(snapshot, skills, risk_flags)

    weakest_topic = snapshot.get("weakest_topic")

    if previous_topic != weakest_topic:
        ai_output = generate_rag_analysis()
    else:
        ai_output = previous_analysis

    training = select_training_problems(weakest_topic, skills, DATA_DIR)

    curriculum = generate_curriculum(weakest_topic, skills)

    result = {
        "state": state,
        "snapshot": snapshot,
        "skills": skills,
        "risk_flags": risk_flags,
        "analysis": ai_output,
        "training": training,
        "curriculum": curriculum,
        "insight": insight
    }

    with open(CACHE_FILE, "w") as f:
        json.dump(result, f, indent=2)

    return {"status": "Synced and analysis generated"}


# ------------------------------------
# Progress Endpoint
# ------------------------------------

@app.get("/progress")
def progress():

    difficulty_file = os.path.join(DATA_DIR, "difficulty_history.csv")

    if not os.path.exists(difficulty_file):
        return []

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


# ------------------------------------
# Training Endpoint
# ------------------------------------

@app.get("/training")
def get_training():

    if not os.path.exists(CACHE_FILE):
        return {"status": "Run /sync first"}

    with open(CACHE_FILE, "r") as f:
        data = json.load(f)

    return data.get("training", [])


# ------------------------------------
# Attempt Memory
# ------------------------------------

@app.post("/submit-attempt")
def submit_attempt(data: Attempt):

    record_attempt(
        DATA_DIR,
        data.problem,
        data.topic,
        data.difficulty,
        data.result,
        data.time_taken
    )

    return {"status": "attempt recorded"}