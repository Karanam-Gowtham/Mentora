import os
import chromadb
from chromadb.utils import embedding_functions
import pandas as pd
from google import genai
from dotenv import load_dotenv


def generate_rag_analysis():

    # ---------------------------------------
    # Paths
    # ---------------------------------------

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(BASE_DIR)

    topic_path = os.path.join(PROJECT_ROOT, "backend", "data", "topic_history.csv")

    dotenv_path = os.path.join(PROJECT_ROOT, ".env")
    load_dotenv(dotenv_path)

    # ---------------------------------------
    # Detect Weakest Topic
    # ---------------------------------------

    topic_df = pd.read_csv(topic_path)

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

    # ---------------------------------------
    # Load Knowledge Base
    # ---------------------------------------

    file_map = {
        "Tree": "tree.txt",
        "Graph": "graph.txt",
        "Dynamic Programming": "dp.txt",
        "Backtracking": "backtracking.txt",
        "Heap": "heap.txt"
    }

    kb_path = os.path.join(PROJECT_ROOT, "knowledge_base", file_map[weakest_topic])

    with open(kb_path, "r", encoding="utf-8") as f:
        text = f.read()

    # ---------------------------------------
    # Chunking
    # ---------------------------------------

    chunk_size = 400
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    # ---------------------------------------
    # Chroma Setup
    # ---------------------------------------

    chroma_client = chromadb.Client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

    collection = chroma_client.get_or_create_collection(
        name="dsa_knowledge",
        embedding_function=embedding_func
    )

    # Only add chunks if collection is empty
    if collection.count() == 0:

        for idx, chunk in enumerate(chunks):

            collection.add(
                documents=[chunk],
                ids=[f"{weakest_topic}_{idx}"]
            )

    # ---------------------------------------
    # Retrieval
    # ---------------------------------------

    query = f"Common learning mistakes in {weakest_topic}"

    results = collection.query(query_texts=[query], n_results=1)

    retrieved_context = results["documents"][0][0]

    # ---------------------------------------
    # Gemini Reasoning
    # ---------------------------------------

    try:

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        analysis_prompt = f"""
You are an AI coding mentor.

Student weakness:
{weakest_topic}

Knowledge:
{retrieved_context}

Respond in SHORT format.

Rules:
- Maximum 4 lines
- Each line under 12 words
- No paragraphs
- No explanations

Format:

INSIGHT: <main weakness>

REASON: <thinking mistake>

ACTION: <concept to practice>

NEXT_PROBLEM: <type of problem>
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=analysis_prompt,
            config={
                "temperature": 0.1,
                "max_output_tokens": 120
            }
        )

        return response.text

    except Exception as e:

        return f"""
INSIGHT: Weakness detected in {weakest_topic}

REASON: AI analysis unavailable

ACTION: Practice fundamental problems

ERROR: {str(e)}
"""