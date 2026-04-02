# Mentora — AI DSA Learning System

## Stack
- Frontend: React 19 + Vite + Vanilla CSS → /frontend
- Backend: Python FastAPI → /backend
- Vector DB: ChromaDB → /dsa_intelligence/rag_layer.py
- Relational DB: PostgreSQL via SQLAlchemy → /backend/database.py
- AI: Google Gemini 2.5 Flash via google-generativeai SDK

## Rules
- New API endpoints go in /backend/chat_endpoint.py or /backend/main.py
- New React components go in /frontend/src/components/
- Always use async def for FastAPI routes
- Always use try/except with proper HTTP status codes
- Functional React components only, use hooks
- No new libraries without listing them in requirements.txt
- Never hardcode API keys — use os.environ.get()
- Don't modify /ingestion or /knowledge_base files
- XP is awarded only through the existing grant_xp() function
```

Commit and push this file. That's your entire one-time setup.

---

## Step 3 — The Exact Process Every Time You Want Something Built

**Go to your repo → Issues → New Issue**

Write your request like this:
```
Title: [what you want in one line]

What I want:
[describe the feature or fix clearly]

Which files to touch:
[tell it where the code should go]

How it should work:
[describe the behavior]
```

Then on the right side panel → **Assignees → type Copilot → select it → Submit**

The agent immediately reacts with 👀 and starts coding in the background.

---

## Step 4 — Watch It Code

Go to **Pull Requests** — a Draft PR appears within 1-2 minutes.

Open it. Scroll down to **"Copilot session logs"** — you can watch it:
- Reading your files
- Planning what to change
- Writing the actual code
- Pushing commits

---

## Step 5 — Review and Accept

Look at the **Files changed** tab in the PR. If it looks right, click:

**"Ready for review" → "Merge pull request"**

The code is now in your repo. Done.

---

## If the Code Isn't Right

Don't close the PR. Just **comment** on it:
```
The endpoint works but it should return 404 when the 
user has no history, not an empty array.
```

The agent reads your comment, fixes it, pushes new commits to the same PR. You repeat until it's right, then merge.

---

## Real Example for Mentora Right Now

Here's an actual issue you can create today:
```
Title: Add endpoint to fetch user's full quiz history

What I want:
A new GET endpoint that returns all quiz attempts 
for a user, sorted by most recent first.

Which files to touch:
- /backend/chat_endpoint.py — add the route
- /backend/database.py — query QuizResult table

How it should work:
- Route: GET /api/quiz/history
- Returns: list of { topic, score, total, timestamp }
- If no history exists, return empty list with 200 status
```

Assign to Copilot → it writes both the FastAPI route and the SQLAlchemy query → PR appears → you review → merge. That's it.

---

## The Complete Loop in One Line
```
Issue (your words) → Copilot codes it → PR → you review → merge → done