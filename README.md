# Mentora
An Autonomous AI Learning System

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Mentora** is an AI-driven Data Structures and Algorithms (DSA) performance analyzer and personalized mentoring platform. It ingests student performance data (e.g., from LeetCode), analyzes strengths and weaknesses, and uses advanced AI—including a Retrieval-Augmented Generation (RAG) pipeline—to generate customized, actionable learning plans and problem recommendations.

---

## 📌 Version History

### [2.0.0] - 2026-03-15
#### "The Personal Tutor Release"
This version transforms Mentora from a static analyzer into an interactive, gamified learning experience with real-time AI guidance and persistent progress tracking.

**Key Features in v2.0.0:**
- **AI Tutor Chat:** Real-time interactive mentoring powered by Gemini 2.5 Flash, grounded in the student's actual performance data.
- **Gamified Learning (XP & Levels):** Introduced an XP-based leveling system (Beginner → Intermediate → Advanced) with daily streaks and active session tracking.
- **Dynamic Quiz System:** Automated topic-specific quizzes with instant feedback, scoring, and performance-based XP rewards.
- **Session Logging:** Comprehensive study session management with notes, duration tracking, and quality-of-study assessments.
- **Database Persistence:** Shifted core data management towards **PostgreSQL** with **SQLAlchemy** for session history and quiz results.
- **Enhanced CORS Support:** Broadened backend access to accommodate modern frontend deployments.

### [1.0.0] - 2026-03-07
#### "The Foundation Release"
The initial stable version establishing the core RAG pipeline and mentorship engine.

---

## 🚀 Features

- **Personal AI Tutor:** A dedicated chat interface where you can ask DSA questions, request code reviews, and get personalized study advice based on your weakest topics.
- **Performance Analysis:** Identifies your weakest topics, problem difficulty distribution, and generates a performance snapshot.
- **Gamification System:** Earn XP by MARKING problems as solved, completing quizzes, or logging study sessions. Level up as you master more concepts!
- **Dynamic Quizzes:** Test your knowledge with automated quizzes that adapt to your currently focused topic.
- **Risk Flag Detection:** Highlights cognitive gaps, such as solving too many easy problems or avoiding complex topics like DP.
- **7-Day Training Plans:** Recommends progressive problems and constructs structured training plans tailored directly to your detected gaps.

## 📂 Project Structure

- **`/backend`**: The core API built with **FastAPI**.
  - `main.py`: Main application entry and core analysis endpoints.
  - `chat_endpoint.py`: Router for AI Tutor chat, session logging, and quiz submissions.
  - `database.py`: SQLAlchemy models and PostgreSQL connection configuration.
- **`/frontend`**: The web application built with **React**, **Vite**, and **Vanilla CSS**.
  - `MentoraApp.jsx`: The central hub for the dashboard, tutor, and learning modules.
- **`/dsa_intelligence`**: Core AI and analytics engine.
  - `rag_layer.py`: Pinpoints weakest topics and queries the knowledge base via ChromaDB.
  - `analyzer_service.py`, `curriculum_service.py`: Business logic for performance diagnosis and plan generation.
- **`/ingestion`**: Data collection scripts for syncing with LeetCode.
- **`/knowledge_base`**: Domain-specific DSA theory used by the RAG model to ground AI logic.

## 🛠️ Tech Stack

- **Frontend:** React.js 19, Vite, Recharts, Vanilla CSS
- **Backend:** Python, FastAPI, Pandas, SQLAlchemy
- **Database:** PostgreSQL (Primary), ChromaDB (Vector Search)
- **AI/ML:** 
  - Generative AI: **Google Gemini 2.5 Flash**
  - Embeddings: HuggingFace Sentence Transformers (`all-MiniLM-L6-v2`)

## 🏃 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- PostgreSQL (Local or Cloud instance)
- A Google Gemini API Key.

### 1. Setup the Backend

```bash
# Navigate to the root directory
cd Mentora

# Create a virtual environment and activate it
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
# Ensure you have: fastapi, uvicorn, sqlalchemy, psycopg2-binary, google-generativeai

# Create a .env file
echo "GEMINI_API_KEY=your_key_here" > backend/.env
echo "DATABASE_URL=postgresql://user:pass@localhost/mentora" >> backend/.env

# Run the FastAPI server
uvicorn backend.main:app --reload
```

### 2. Setup the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## 🧠 How the AI Tutor Works

1. **Context Awareness:** Every message sent to the AI Tutor includes a payload of the student's latest performance snapshot (e.g., "Weak in DP, solved 150 problems, 65% Easy").
2. **System Instruction:** Gemini is prompted to act as a "Caring but Strict Mentor" who identifies bugs, suggests specific LeetCode problem numbers, and builds problem-solving intuition rather than just providing answers.
3. **Retrieval (RAG):** For complex queries, the system pulls theoretical context from `/knowledge_base` to ensure technical accuracy.
4. **Actionable Feedback:** The Tutor prioritizes bug fixes, edge-case analysis, and complexity tradeoffs in every code-related response.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


