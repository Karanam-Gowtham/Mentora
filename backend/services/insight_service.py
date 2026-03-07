def generate_daily_insight(snapshot, skills, risk_flags):

    weakest_topic = snapshot.get("weakest_topic")

    if not weakest_topic:
        return {
            "topic": "Unknown",
            "skill_level": "Unknown",
            "today_focus": "Run sync to generate insights"
        }

    skill_score = skills.get(weakest_topic, 0)

    if skill_score < 30:
        level = "Beginner"
        focus = f"Practice Easy problems in {weakest_topic}"

    elif skill_score < 60:
        level = "Intermediate"
        focus = f"Focus on Medium problems in {weakest_topic}"

    else:
        level = "Advanced"
        focus = f"Try solving Hard problems in {weakest_topic}"

    insight = {
        "topic": weakest_topic,
        "skill_level": level,
        "today_focus": focus
    }

    if "Hard problems very low" in risk_flags:
        insight["risk"] = "Avoiding hard problems may slow your growth."

    return insight