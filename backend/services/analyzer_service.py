def analyze_performance(snapshot):

    risk_flags = []

    if snapshot["hard_percent"] < 10:
        risk_flags.append("Low Hard Exposure")

    if snapshot["easy_percent"] > 60:
        risk_flags.append("Comfort Zone Bias")

    if snapshot["medium_percent"] < 25:
        risk_flags.append("Insufficient Medium Training")

    return risk_flags