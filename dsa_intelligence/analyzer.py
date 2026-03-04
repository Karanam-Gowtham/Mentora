import pandas as pd

# Load latest snapshot
difficulty_df = pd.read_csv("data/difficulty_history.csv")
topic_df = pd.read_csv("data/topic_history.csv")

# Get latest timestamp
latest_time = difficulty_df["timestamp"].max()

latest_difficulty = difficulty_df[difficulty_df["timestamp"] == latest_time]
latest_topics = topic_df[topic_df["timestamp"] == latest_time]

print("\n=== LATEST SNAPSHOT ===")
print("Timestamp:", latest_time)

# -------------------------
# Difficulty Analysis
# -------------------------
total = latest_difficulty[latest_difficulty["difficulty"] == "All"]["count"].values[0]
easy = latest_difficulty[latest_difficulty["difficulty"] == "Easy"]["count"].values[0]
medium = latest_difficulty[latest_difficulty["difficulty"] == "Medium"]["count"].values[0]
hard = latest_difficulty[latest_difficulty["difficulty"] == "Hard"]["count"].values[0]

easy_pct = (easy / total) * 100
medium_pct = (medium / total) * 100
hard_pct = (hard / total) * 100

print("\n=== Difficulty Distribution ===")
print(f"Total Solved: {total}")
print(f"Easy: {easy} ({easy_pct:.2f}%)")
print(f"Medium: {medium} ({medium_pct:.2f}%)")
print(f"Hard: {hard} ({hard_pct:.2f}%)")

# Flags
print("\n=== Difficulty Flags ===")
if easy_pct > 60:
    print("[!] Over-reliance on Easy problems")
if hard_pct < 5:
    print("[!] Very low Hard exposure")
if medium_pct < 30:
    print("[!] Medium practice insufficient")

# -------------------------
# Topic Analysis
# -------------------------
print("\n=== Topic Weakness Detection ===")

# Core structural topics we care about
core_topics = [
    "Linked List",
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Backtracking",
    "Heap",
    "Binary Search",
    "Stack",
    "Queue",
    "Recursion"
]

topic_dict = dict(zip(latest_topics["topic"], latest_topics["problems_solved"]))

for topic in core_topics:
    solved = topic_dict.get(topic, 0)
    if solved < 5:
        print(f"[!] Weak in {topic} (Solved: {solved})")

print("\n=== Top 5 Most Practiced Topics ===")
top5 = latest_topics.sort_values(by="problems_solved", ascending=False).head(5)
print(top5[["topic", "problems_solved"]])