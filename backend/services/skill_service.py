import pandas as pd
import os


def compute_skill_scores(data_dir):

    topic_file = os.path.join(data_dir, "topic_history.csv")

    df = pd.read_csv(topic_file)

    latest_time = df["timestamp"].max()

    latest = df[df["timestamp"] == latest_time]

    skills = {}

    max_problems = latest["problems_solved"].max()

    for _, row in latest.iterrows():

        topic = row["topic"]
        solved = row["problems_solved"]

        score = int((solved / max_problems) * 100)

        skills[topic] = score

    return skills