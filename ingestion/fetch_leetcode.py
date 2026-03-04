import requests
import pandas as pd
from datetime import datetime
import os

username = "_g_o_w_t_h_a_m"
url = "https://leetcode.com/graphql"

query = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }
      intermediate {
        tagName
        problemsSolved
      }
      fundamental {
        tagName
        problemsSolved
      }
    }
  }
}
"""

variables = {"username": username}
response = requests.post(url, json={"query": query, "variables": variables})
data = response.json()

if "errors" in data:
    print("Error:", data["errors"])
    exit()

user = data["data"]["matchedUser"]
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# -------------------------
# Difficulty Data
# -------------------------
difficulty_rows = []
for item in user["submitStats"]["acSubmissionNum"]:
    difficulty_rows.append({
        "timestamp": timestamp,
        "difficulty": item["difficulty"],
        "count": item["count"],
        "submissions": item["submissions"]
    })

difficulty_df = pd.DataFrame(difficulty_rows)

os.makedirs("data", exist_ok=True)

difficulty_file = "data/difficulty_history.csv"
if os.path.exists(difficulty_file):
    difficulty_df.to_csv(difficulty_file, mode="a", header=False, index=False)
else:
    difficulty_df.to_csv(difficulty_file, index=False)

# -------------------------
# Topic Data
# -------------------------
topic_rows = []

for level in ["fundamental", "intermediate", "advanced"]:
    for tag in user["tagProblemCounts"][level]:
        topic_rows.append({
            "timestamp": timestamp,
            "topic": tag["tagName"],
            "problems_solved": tag["problemsSolved"]
        })

topic_df = pd.DataFrame(topic_rows)

topic_file = "data/topic_history.csv"
if os.path.exists(topic_file):
    topic_df.to_csv(topic_file, mode="a", header=False, index=False)
else:
    topic_df.to_csv(topic_file, index=False)

print("Data snapshot saved successfully.")