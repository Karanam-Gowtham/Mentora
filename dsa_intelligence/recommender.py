import pandas as pd

# Load latest snapshot
difficulty_df = pd.read_csv("data/difficulty_history.csv")
topic_df = pd.read_csv("data/topic_history.csv")

latest_time = difficulty_df["timestamp"].max()
latest_topics = topic_df[topic_df["timestamp"] == latest_time]

topic_dict = dict(zip(latest_topics["topic"], latest_topics["problems_solved"]))

# Priority topics (ordered by importance for interviews)
priority_topics = [
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Backtracking",
    "Heap",
    "Linked List",
    "Recursion",
    "Queue",
    "Stack",
    "Binary Search"
]

print("\n=== RECOMMENDED FOCUS ORDER ===\n")

recommendations = []

for topic in priority_topics:
    solved = topic_dict.get(topic, 0)
    if solved < 5:
        gap = 5 - solved
        recommendations.append((topic, solved, gap))

recommendations.sort(key=lambda x: x[1])  # weakest first

for topic, solved, gap in recommendations:
    print(f"{topic} -> Solve at least {gap} more problems (Current: {solved})")

print("\n=== WEEKLY PLAN ===")

print("""
Daily:
- 2 Medium (from weakest topic)
- 1 Structural problem (Tree/Graph/DP)
- 1 Revision problem (from Array/String)

Weekly:
- 2 Hard problems (from Tree or DP)
""")