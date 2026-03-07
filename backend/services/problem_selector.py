import json
import os
import random
from backend.services.adaptive_service import decide_next_difficulty


def select_training_problems(weak_topic, skills, data_dir):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

    dataset_path = os.path.join(PROJECT_ROOT, "backend", "data", "leetcode_problems.json")

    with open(dataset_path, "r", encoding="utf-8") as f:
        problems = json.load(f)

    # Filter problems by topic
    topic_problems = [
        p for p in problems
        if weak_topic in p["topics"]
    ]

    # Separate by difficulty
    easy = [p for p in topic_problems if p["difficulty"] == "Easy"]
    medium = [p for p in topic_problems if p["difficulty"] == "Medium"]
    hard = [p for p in topic_problems if p["difficulty"] == "Hard"]

    # Skill-based base difficulty
    skill = skills.get(weak_topic, 50)

    if skill < 30:
        base_plan = ["Easy", "Easy", "Medium"]

    elif skill < 60:
        base_plan = ["Easy", "Medium", "Medium"]

    else:
        base_plan = ["Medium", "Medium", "Hard"]

    # Adaptive difficulty adjustment from attempt history
    adaptive_diff = decide_next_difficulty(data_dir, weak_topic)

    if adaptive_diff == "Easy":
        difficulty_plan = ["Easy", "Easy", "Medium"]

    elif adaptive_diff == "Medium":
        difficulty_plan = base_plan

    else:
        difficulty_plan = ["Medium", "Hard", "Hard"]

    selected = []

    for diff in difficulty_plan:

        if diff == "Easy" and easy:
            selected.append(random.choice(easy))

        elif diff == "Medium" and medium:
            selected.append(random.choice(medium))

        elif diff == "Hard" and hard:
            selected.append(random.choice(hard))

    # Add LeetCode links
    for p in selected:
        p["link"] = f"https://leetcode.com/problems/{p['slug']}"

    return selected