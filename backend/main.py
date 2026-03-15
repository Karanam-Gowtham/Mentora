"""
Mentora Backend API
Main FastAPI application with all endpoints
"""

import pandas as pd
import os
import json
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
from backend.chat_endpoint import router as chat_router


# Load environment variables
load_dotenv()

# ============================================================================
# FastAPI App Initialization
# ============================================================================

app = FastAPI(
    title="Mentora API",
    description="AI-Powered DSA Learning Platform",
    version="2.0.0"
)

# ✅ Include chat router - provides /chat, /log-session, /submit-quiz
app.include_router(chat_router)

# ============================================================================
# CORS Configuration
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# File Paths
# ============================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

CACHE_FILE = os.path.join(DATA_DIR, "analysis_cache.json")
STATE_FILE = os.path.join(DATA_DIR, "state_snapshot.json")
LEETCODE_DATA_FILE = os.path.join(DATA_DIR, "leetcode_data.json")

# ============================================================================
# Pydantic Models
# ============================================================================

class Attempt(BaseModel):
    problem: str
    topic: str
    difficulty: str
    result: str
    time_taken: int

# ============================================================================
# Health Check
# ============================================================================

@app.get("/")
def health():
    """Health check endpoint"""
    return {
        "status": "Mentora API running",
        "version": "2.0.0",
        "endpoints": [
            "/analysis",
            "/sync",
            "/progress",
            "/velocity",
            "/training",
            "/submit-attempt",
            "/chat",
            "/log-session",
            "/submit-quiz"
        ]
    }

# ============================================================================
# Analysis Endpoint
# ============================================================================

@app.get("/analysis")
def analysis():
    """
    Get student performance analysis
    Returns: snapshot, skills, risk_flags, AI analysis, training, curriculum
    """
    if not os.path.exists(CACHE_FILE):
        return {
            "status": "error",
            "message": "No analysis available. Run /sync first."
        }

    with open(CACHE_FILE, "r") as f:
        return json.load(f)

# ============================================================================
# Sync Pipeline
# ============================================================================

@app.post("/sync")
def sync_leetcode():
    """
    Sync LeetCode data and regenerate analysis
    """
    # Fetch latest LeetCode data
    fetch_leetcode()

    # Check if data has changed
    current_hash = compute_file_hash(LEETCODE_DATA_FILE)
    previous_hash = None

    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            previous_state = json.load(f)
            previous_hash = previous_state.get("data_hash")

    # Compute student performance snapshot
    snapshot = compute_snapshot(DATA_DIR)
    
    # Compute skill scores per topic
    skills = compute_skill_scores(DATA_DIR)

    # Load previous state for comparison
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

    # Update state
    state = update_state(DATA_DIR, snapshot, skills)
    state["data_hash"] = current_hash

    # Analyze performance and detect risk flags
    risk_flags = analyze_performance(snapshot)

    # Generate daily insight
    insight = generate_daily_insight(snapshot, skills, risk_flags)

    # Get weakest topic
    weakest_topic = snapshot.get("weakest_topic")

    # Only regenerate RAG analysis if weakest topic changed
    if previous_topic != weakest_topic or previous_analysis is None:
        print(f"Weakest topic changed: {previous_topic} → {weakest_topic}")
        print("Generating new RAG analysis...")
        ai_output = generate_rag_analysis()
    else:
        print("Weakest topic unchanged, reusing previous analysis")
        ai_output = previous_analysis

    # Select training problems
    training = select_training_problems(weakest_topic, skills, DATA_DIR)

    # Generate curriculum
    curriculum = generate_curriculum(weakest_topic, skills)

    # Build result
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

    # Cache the result
    with open(CACHE_FILE, "w") as f:
        json.dump(result, f, indent=2)

    return {
        "status": "success",
        "message": "Synced and analysis generated",
        "weakest_topic": weakest_topic,
        "data_changed": previous_hash != current_hash
    }

# ============================================================================
# Progress Endpoint
# ============================================================================

@app.get("/progress")
def progress():
    """Get progress data for charts"""
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
            "medium": int(medium.iloc[i]["count"]) if i < len(medium) else 0,
            "hard": int(hard.iloc[i]["count"]) if i < len(hard) else 0
        })

    return data

# ============================================================================
# Velocity Endpoint
# ============================================================================

@app.get("/velocity")
def learning_velocity():
    """Get learning velocity data"""
    difficulty_file = os.path.join(DATA_DIR, "difficulty_history.csv")

    if not os.path.exists(difficulty_file):
        return []

    df = pd.read_csv(difficulty_file)
    summary = df.groupby("timestamp")["count"].sum().reset_index()

    data = []
    for _, row in summary.iterrows():
        data.append({
            "date": row["timestamp"],
            "solved": int(row["count"])
        })

    return data

# ============================================================================
# Training Endpoint
# ============================================================================

@app.get("/training")
def get_training():
    """Get recommended training problems"""
    if not os.path.exists(CACHE_FILE):
        return {"status": "error", "message": "Run /sync first"}

    with open(CACHE_FILE, "r") as f:
        data = json.load(f)

    return data.get("training", [])

# ============================================================================
# Skill Growth Endpoint
# ============================================================================

@app.get("/skill-growth")
def skill_growth():
    """Get skill growth over time per topic"""
    skill_file = os.path.join(DATA_DIR, "topic_history.csv")

    if not os.path.exists(skill_file):
        return []

    df = pd.read_csv(skill_file)

    topics = ["Array", "Tree", "Graph", "Dynamic Programming"]
    result = []

    for topic in topics:
        topic_df = df[df["topic"] == topic]
        for _, row in topic_df.iterrows():
            result.append({
                "topic": topic,
                "time": row["timestamp"],
                "score": row["problems_solved"]
            })

    return result

# ============================================================================
# Attempt Recording
# ============================================================================

@app.post("/submit-attempt")
def submit_attempt(data: Attempt):
    """Record a problem attempt"""
    record_attempt(
        DATA_DIR,
        data.problem,
        data.topic,
        data.difficulty,
        data.result,
        data.time_taken
    )

    return {"status": "success", "message": "Attempt recorded"}

# ============================================================================
# Application Startup
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("=" * 60)
    print("🚀 Mentora API Started")
    print("=" * 60)
    print(f"📁 Data Directory: {DATA_DIR}")
    print(f"📊 Cache File: {CACHE_FILE}")
    print(f"🔑 API Key Configured: {'✅' if os.getenv('GEMINI_API_KEY') else '❌'}")
    print("=" * 60)
    print("📚 Available Endpoints:")
    print("   GET  /           - Health check")
    print("   GET  /analysis   - Get student analysis")
    print("   POST /sync       - Sync LeetCode data")
    print("   GET  /progress   - Get progress chart data")
    print("   GET  /velocity   - Get velocity chart data")
    print("   GET  /training   - Get recommended problems")
    print("   POST /submit-attempt - Record problem attempt")
    print("   POST /chat       - AI tutor chat [NEW]")
    print("   POST /log-session - Log study session [NEW]")
    print("   POST /submit-quiz - Submit quiz results [NEW]")
    print("=" * 60)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)