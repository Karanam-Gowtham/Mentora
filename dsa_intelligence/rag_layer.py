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
    # 1. Detect Weakest Topic
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
    # 2. Load Knowledge File
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
    # 3. Chunking
    # ---------------------------------------
    chunk_size = 400
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    # ---------------------------------------
    # 4. Chroma Setup
    # ---------------------------------------
    chroma_client = chromadb.Client()

    try:
        chroma_client.delete_collection("dsa_knowledge")
    except:
        pass

    try:
        embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2",
            local_files_only=True
        )
    except:
        embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

    collection = chroma_client.get_or_create_collection(
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

    # ---------------------------------------
    # 6. Gemini Reasoning
    # ---------------------------------------
    try:

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

Be precise and structured.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=analysis_prompt,
            config={
                "temperature": 0.2
            }
        )

        return response.text

    except Exception as e:

        return f"""
RAG Analysis Failed

Weakest Topic Detected: {weakest_topic}

Possible reason:
{str(e)}

Please check Gemini API quota or network.
"""