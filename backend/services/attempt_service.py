import pandas as pd
import os
from datetime import datetime


def record_attempt(data_dir, problem, topic, difficulty, result, time_taken):

    file_path = os.path.join(data_dir, "attempt_history.csv")

    new_row = {
        "timestamp": datetime.now().strftime("%Y-%m-%d"),
        "problem": problem,
        "topic": topic,
        "difficulty": difficulty,
        "result": result,
        "time_taken": time_taken
    }

    df = pd.DataFrame([new_row])

    if os.path.exists(file_path):
        df.to_csv(file_path, mode="a", header=False, index=False)
    else:
        df.to_csv(file_path, index=False)