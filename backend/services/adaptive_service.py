import pandas as pd
import os


def decide_next_difficulty(data_dir, topic):

    file_path = os.path.join(data_dir, "attempt_history.csv")

    if not os.path.exists(file_path):
        return "Easy"

    df = pd.read_csv(file_path)

    topic_df = df[df["topic"] == topic]

    if topic_df.empty:
        return "Easy"

    recent = topic_df.tail(3)

    correct_count = (recent["result"] == "correct").sum()
    avg_time = recent["time_taken"].mean()

    if correct_count <= 1:
        return "Easy"

    if avg_time > 25:
        return "Medium"

    return "Hard"