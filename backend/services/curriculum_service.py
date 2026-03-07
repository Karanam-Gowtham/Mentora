import json
import os
import random


def generate_curriculum(weak_topic, skills):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

    dataset_path = os.path.join(PROJECT_ROOT, "backend", "data", "leetcode_problems.json")

    with open(dataset_path, "r", encoding="utf-8") as f:
        problems = json.load(f)

    topic_problems = [p for p in problems if weak_topic in p["topics"]]

    easy = [p for p in topic_problems if p["difficulty"] == "Easy"]
    medium = [p for p in topic_problems if p["difficulty"] == "Medium"]
    hard = [p for p in topic_problems if p["difficulty"] == "Hard"]

    skill = skills.get(weak_topic, 50)

    # difficulty progression for the week
    if skill < 30:
        plan = ["Easy", "Easy", "Easy", "Medium", "Medium", "Medium", "Hard"]

    elif skill < 60:
        plan = ["Easy", "Medium", "Medium", "Medium", "Hard", "Hard", "Hard"]

    else:
        plan = ["Medium", "Medium", "Hard", "Hard", "Hard", "Hard", "Hard"]

    week_plan = []

    for i, diff in enumerate(plan):

        if diff == "Easy" and easy:
            p = random.choice(easy)

        elif diff == "Medium" and medium:
            p = random.choice(medium)

        elif diff == "Hard" and hard:
            p = random.choice(hard)

        else:
            continue

        week_plan.append({
            "day": i + 1,
            "title": p["title"],
            "difficulty": p["difficulty"],
            "link": f"https://leetcode.com/problems/{p['slug']}"
        })

    return week_plan