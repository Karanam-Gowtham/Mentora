import os
import chromadb
from chromadb.utils import embedding_functions
import pandas as pd
from google import genai
from dotenv import load_dotenv

# ---------------------------------------
# 1. Detect Weakest Topic
# ---------------------------------------
topic_df = pd.read_csv("data/topic_history.csv")
latest_time = topic_df["timestamp"].max()
latest_topics = topic_df[topic_df["timestamp"] == latest_time]

topic_dict = dict(zip(latest_topics["topic"], latest_topics["problems_solved"]))

priority_topics = [
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Backtracking",
    "Heap"
]

weakest_topic = min(priority_topics, key=lambda t: topic_dict.get(t, 0))
print(f"\nWeakest Topic Detected: {weakest_topic}")

# ---------------------------------------
# 2. Load Knowledge File
# ---------------------------------------
file_map = {
    "Tree": "tree.txt",
    "Graph": "graph.txt",
    "Dynamic Programming": "dp.txt",
    "Backtracking": "backtracking.txt",
    "Heap": "heap.txt"
}

# Get directory where this script exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Go one level up (to LeetCode folder)
PROJECT_ROOT = os.path.dirname(BASE_DIR)

# Build correct knowledge base path
kb_path = os.path.join(PROJECT_ROOT, "knowledge_base", file_map[weakest_topic])

# Load environment variables from project root
dotenv_path = os.path.join(PROJECT_ROOT, ".env")
load_dotenv(dotenv_path)

with open(kb_path, "r", encoding="utf-8") as f:
    text = f.read()
# ---------------------------------------
# 3. Chunking
# ---------------------------------------
chunks = []
chunk_size = 400

for i in range(0, len(text), chunk_size):
    chunks.append(text[i:i + chunk_size])

# ---------------------------------------
# 4. Chroma Setup
# ---------------------------------------
chroma_client = chromadb.Client()

try:
    chroma_client.delete_collection("dsa_knowledge")
except:
    pass

# Set up embedding function with local support
embedding_func = None
try:
    # Try using cached model first to avoid network errors
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2",
        local_files_only=True
    )
except Exception as e:
    # Fallback to normal loading if local files are not found
    print("Local model not found, attempting to download...")
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

collection = chroma_client.create_collection(
    name="dsa_knowledge",
    embedding_function=embedding_func
)

for idx, chunk in enumerate(chunks):
    collection.add(
        documents=[chunk],
        ids=[f"{weakest_topic}_{idx}"]
    )

# ---------------------------------------
# 5. Retrieval
# ---------------------------------------
query = f"""
Explain weakness in {weakest_topic}.
Focus on thinking gap and structured improvement.
"""

results = collection.query(query_texts=[query], n_results=1)
retrieved_context = results["documents"][0][0]

print("Retrieval complete.")

# ---------------------------------------
# 6. Gemini Reasoning Layer (Modern SDK)
# ---------------------------------------

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

analysis_prompt = f"""
You are a strict DSA performance analyst.

Student Performance Data:
- Weakest Topic: {weakest_topic}
- Easy problems dominant
- Hard problems very low

Relevant Knowledge Snippet:
{retrieved_context}

Your task:
1. Identify ROOT CAUSE of weakness (performance-based).
2. Identify THINKING GAP (cognitive mistake).
3. Suggest 5 progressive problems (in increasing difficulty).
4. Provide a 7-day structured training plan.

Do NOT rewrite theory.
Be precise and structured.
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=analysis_prompt,
    config={
        "temperature": 0.2
    }
)

import sys
print("\n=== RAG ANALYSIS ===\n")
try:
    print(response.text)
except UnicodeEncodeError:
    print(response.text.encode('utf-8', errors='replace').decode('cp1252', errors='replace'))