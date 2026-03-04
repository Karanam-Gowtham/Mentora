import pandas as pd
import os

def compute_snapshot(data_dir):
    topic_df = pd.read_csv(os.path.join(data_dir, "topic_history.csv"))
    difficulty_df = pd.read_csv(os.path.join(data_dir, "difficulty_history.csv"))

    latest_time = difficulty_df["timestamp"].max()
    latest_diff = difficulty_df[difficulty_df["timestamp"] == latest_time]

    total = latest_diff[latest_diff["difficulty"] == "All"]["count"].values[0]
    easy = latest_diff[latest_diff["difficulty"] == "Easy"]["count"].values[0]
    medium = latest_diff[latest_diff["difficulty"] == "Medium"]["count"].values[0]
    hard = latest_diff[latest_diff["difficulty"] == "Hard"]["count"].values[0]

    latest_topic_time = topic_df["timestamp"].max()
    latest_topics = topic_df[topic_df["timestamp"] == latest_topic_time]
    weakest_topic = latest_topics.sort_values("problems_solved").iloc[0]["topic"]

    return {
        "total": int(total),
        "easy_percent": round(easy / total * 100, 2),
        "medium_percent": round(medium / total * 100, 2),
        "hard_percent": round(hard / total * 100, 2),
        "weakest_topic": weakest_topic
    }