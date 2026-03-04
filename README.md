# Mentora

**Mentora** is an AI-driven Data Structures and Algorithms (DSA) performance analyzer and personalized mentoring platform. It ingests student performance data (e.g., from LeetCode), analyzes strengths and weaknesses, and uses advanced AI—including a Retrieval-Augmented Generation (RAG) pipeline—to generate customized, actionable learning plans and problem recommendations.

## 🚀 Features

- **Performance Analysis:** Identifies a student's weakest topics, problem difficulty distribution, and generates a performance snapshot.
- **Risk Flag Detection:** Highlights cognitive gaps, such as solving too many easy problems but failing on complex ones.
- **AI-Powered Mentoring:** Uses Google's Gemini 2.5 Flash model off a vector database context (RAG) to provide deep insights into the root causes of mistakes.
- **Personalized Planning:** Recommends progressive problems and constructs 7-day structured training plans tailored directly to the student's weakest areas.
- **Knowledge-Backed:** Integrates a built-in knowledge base (Graphs, DP, Trees, Heap, etc.) using ChromaDB to ground AI recommendations in solid DSA theory.

## 📂 Project Structure

- **`/backend`**: The core API built with **FastAPI**. It exposes endpoints like `/analysis` which serve performance snapshots, risk flags, and Gemini-generated improvement plans.
- **`/frontend`**: The web application built with **React**, **Vite**, and **TailwindCSS**, providing a smooth user interface to view stats and AI recommendations.
- **`/dsa_intelligence`**: Contains core AI and analytics scripts:
  - `rag_layer.py`: Uses ChromaDB, `SentenceTransformer`, and Gemini to pinpoint weakest topics and query the knowledge base.
  - `analyzer.py`, `recommender.py`: Performance analysis and problem recommendation logic.
- **`/ingestion`**: Scripts (like `fetch_leetcode.py`) responsible for collecting user data and updating the history datasets.
- **`/knowledge_base`**: Contains domain-specific theory (e.g., `dp.txt`, `graph.txt`) used by the RAG model to provide precise answers.

## 🛠️ Tech Stack

- **Frontend:** React.js 19, Vite, TailwindCSS 4
- **Backend:** Python, FastAPI, Pandas
- **AI/ML:** 
  - Generative AI: **Google Gemini 2.5 Flash**
  - Vector Database: **ChromaDB**
  - Embeddings: HuggingFace Sentence Transformers (`all-MiniLM-L6-v2`)

## 🏃 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- A Google Gemini API Key.

### 1. Setup the Backend

```bash
# Navigate to the root directory
cd Mentora

# Create a virtual environment and activate it
python -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`

# Install dependencies (ensure you have fastapi, chromadb, google-genai, etc.)
pip install -r requirements.txt # Or install manually if requirements.txt is missing

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_actual_key_here" > .env

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

The frontend will be available at `http://localhost:5173` and the backend strictly at the default port (usually `http://localhost:8000`).

## 🧠 How the AI Works

1. **Detection:** The system aggregates metrics from `/data/topic_history.csv` to find the student's weakest DSA topic.
2. **Retrieval (RAG):** It queries ChromaDB against local `.txt` snippets in `/knowledge_base` to pull in relevant theoretical gaps.
3. **Reasoning:** It passes both the student's metrics and the retrieved context to Gemini 2.5 Flash, prompting it to act as an "elite DSA performance analyst." 
4. **Action:** The system returns a structured response containing the Root Cause, Thinking Gap, and a step-by-step improvement plan.

## 📜 License
This project is proprietary or licensed as defined by the repository owner.
