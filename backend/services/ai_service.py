import os
import logging
from google import genai

logger = logging.getLogger(__name__)


analysis_cache = None

def generate_ai_analysis(snapshot, risk_flags):
    global analysis_cache

    if analysis_cache:
        return analysis_cache

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        logger.warning("GEMINI_API_KEY not found. Using fallback analysis.")
        return fallback_analysis(snapshot, risk_flags)

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

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        logger.error(f"Gemini API failed: {e}")

        return fallback_analysis(snapshot, risk_flags)


def fallback_analysis(snapshot, risk_flags):

    return f"""
AI analysis currently unavailable (API quota or network issue).

Snapshot Summary
----------------
Total Problems Solved: {snapshot["total"]}
Easy: {snapshot["easy_percent"]}%
Medium: {snapshot["medium_percent"]}%
Hard: {snapshot["hard_percent"]}%

Weakest Topic: {snapshot["weakest_topic"]}

Detected Risk Flags
-------------------
{", ".join(risk_flags)}

Recommendation
--------------
Increase exposure to medium and hard problems.
Focus practice on the weakest topic: {snapshot["weakest_topic"]}.
Maintain a balanced distribution of difficulty levels to build stronger problem-solving ability.
"""
