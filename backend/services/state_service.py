import json
import os
from datetime import datetime


def update_state(data_dir, snapshot, skills):

    state_file = os.path.join(data_dir, "state_snapshot.json")

    state = {
        "timestamp": datetime.now().strftime("%Y-%m-%d"),
        "weakest_topic": snapshot.get("weakest_topic"),
        "skills": skills,
        "problems_solved": snapshot.get("total_solved", 0)
    }

    with open(state_file, "w") as f:
        json.dump(state, f, indent=2)

    return state