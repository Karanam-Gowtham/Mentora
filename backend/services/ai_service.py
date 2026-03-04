import os
from google import genai


def generate_ai_analysis(snapshot, risk_flags):

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an elite DSA performance analyst.

Student Metrics:
- Total Solved: {snapshot["total"]}
- Easy %: {snapshot["easy_percent"]}
- Medium %: {snapshot["medium_percent"]}
- Hard %: {snapshot["hard_percent"]}
- Weakest Topic: {snapshot["weakest_topic"]}

Detected Risk Flags:
{risk_flags}

Your task:
1. Identify core performance issue.
2. Explain thinking gap.
3. Provide 5 progressive problems for weakest topic.
4. Provide a 7-day structured improvement plan.

Return structured output.
Be precise.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text