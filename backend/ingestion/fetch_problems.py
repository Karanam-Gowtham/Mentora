import requests
import json
import os

URL = "https://leetcode.com/graphql"

query = """
query problemsetQuestionList($skip: Int!) {
  problemsetQuestionList: questionList(
    categorySlug: ""
    limit: 100
    skip: $skip
    filters: {}
  ) {
    data {
      title
      titleSlug
      difficulty
      topicTags {
        name
      }
    }
  }
}
"""


def fetch_problems():

    print("Connecting to LeetCode API...")

    all_problems = []
    skip = 0

    while True:

        response = requests.post(
            URL,
            json={
                "query": query,
                "variables": {"skip": skip}
            },
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=30
        )

        print("Fetching batch starting at:", skip)

        data = response.json()

        questions = data["data"]["problemsetQuestionList"]["data"]

        if not questions:
            break

        for q in questions:

            all_problems.append({
                "title": q["title"],
                "slug": q["titleSlug"],
                "difficulty": q["difficulty"],
                "topics": [t["name"] for t in q["topicTags"]]
            })

        skip += 100

        if len(questions) < 100:
            break

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

    save_path = os.path.join(PROJECT_ROOT, "backend", "data", "leetcode_problems.json")

    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(all_problems, f, indent=2)

    print("Saved", len(all_problems), "problems")
    print("File location:", save_path)


if __name__ == "__main__":
    fetch_problems()