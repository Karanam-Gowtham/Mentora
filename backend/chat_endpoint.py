# backend/chat_endpoint.py
# Add this to your Mentora backend to enable AI tutor chat

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load backend/.env reliably regardless of current working directory.
# override=True ensures stale process-level values do not mask the project key.
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)

router = APIRouter()

# ============================================================================
# Models
# ============================================================================

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Dict

class SessionLog(BaseModel):
    topic: str
    duration: int
    notes: str
    score: int

class QuizResult(BaseModel):
    topic: str
    score: int
    total: int

# ============================================================================
# Endpoints
# ============================================================================

@router.post("/chat")
async def chat_with_tutor(request: ChatRequest):
    """
    AI Tutor chat endpoint using Google Gemini.
    Integrates with your existing student performance data.
    
    Request format:
    {
        "messages": [
            {"role": "user", "text": "Can you explain binary search?"},
            {"role": "tutor", "text": "Sure! Binary search is..."},
            {"role": "user", "text": "Thanks! Can you show me code?"}
        ],
        "context": {
            "snapshot": {"total": 150, "easy_percent": 65, ...},
            "skills": {"Array": 75, "Stack": 45, ...},
            "current_topic": "Stack & Monotonic Stack"
        }
    }
    """
    try:
        # Extract student context
        snapshot = request.context.get("snapshot", {})
        skills = request.context.get("skills", {})
        current_topic = request.context.get("current_topic", "")
        
        # Build system prompt with student profile
        weaknesses = sorted(skills.items(), key=lambda x: x[1])[:3]
        weakness_topics = ', '.join([t[0] for t in weaknesses]) if weaknesses else "None identified"
        
        system_prompt = f"""You are Mentora, an expert DSA (Data Structures & Algorithms) tutor analyzing a student's LeetCode performance.

STUDENT PROFILE:
- Total Problems Solved: {snapshot.get('total', 'Unknown')}
- Difficulty Distribution: 
  • Easy: {snapshot.get('easy_percent', 0)}%
  • Medium: {snapshot.get('medium_percent', 0)}%
  • Hard: {snapshot.get('hard_percent', 0)}%
- Weakest Topics: {weakness_topics}
- Current Focus Area: {current_topic}
- Topic Skill Scores: {skills}

YOUR ROLE AS THEIR PERSONAL TUTOR:

1. **Answer Clearly & Concisely** (max 200 words per response)
   - Get straight to the point
   - Use simple language before technical jargon
   - Break down complex concepts into digestible chunks

2. **Code Review & Bug Detection**
   - When code is shared, identify ALL bugs
   - Explain WHY each bug exists and HOW to fix it
   - Provide corrected code with comments
   - Point out edge cases they missed

3. **Personalized Recommendations**
   - Reference their specific weak areas from the profile
   - Suggest LeetCode problems by number (e.g., "Try #739 Daily Temperatures")
   - Adjust difficulty based on their current skill level
   - Provide step-by-step learning paths

4. **Encouraging but Honest Feedback**
   - Celebrate progress and correct solutions
   - Be direct about knowledge gaps without being harsh
   - Explain the "why" behind concepts, not just the "how"
   - Build understanding, not just memorization

5. **Teaching Style**
   - Use analogies and real-world examples
   - Show multiple approaches (brute force → optimized)
   - Explain time/space complexity tradeoffs
   - Connect concepts to their weakest areas

RESPONSE FORMAT:
- Start with a direct answer to their question
- Use code blocks with syntax highlighting when showing code
- End with one specific next step or practice problem
- Keep tone supportive but maintain high standards

Remember: You're not just answering questions—you're building their problem-solving intuition and helping them identify patterns in DSA."""

        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="GEMINI_API_KEY not found in environment variables"
            )
        
        genai.configure(api_key=api_key)
        
        # Use Gemini 2.0 Flash for fast, high-quality responses
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt
        )
        
        # Build conversation history (all messages except the last one)
        history = []
        for msg in request.messages[:-1]:
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.text]
            })
        
        # Start chat with history
        chat = model.start_chat(history=history)
        
        # Send the latest message
        latest_message = request.messages[-1].text
        response = chat.send_message(latest_message)
        
        return {
            "reply": response.text,
            "status": "success",
            "model": "gemini-2.0-flash-exp"
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Chat error: {error_msg}")
        
        # Provide helpful error messages
        if "API_KEY" in error_msg.upper():
            raise HTTPException(
                status_code=500,
                detail=f"Gemini API key rejected by provider: {error_msg}"
            )
        elif "QUOTA" in error_msg.upper():
            raise HTTPException(
                status_code=429,
                detail="API quota exceeded. Please try again later."
            )
        else:
            raise HTTPException(status_code=500, detail=error_msg)


@router.post("/log-session")
async def log_session(session: SessionLog):
    """
    Log a study session and calculate XP earned.
    
    XP Calculation:
    - Base: 20 XP for any session
    - Duration bonus: +10 XP for sessions >= 60 minutes
    - Performance bonus: +15 XP for score >= 70%
    - Total possible: 45 XP per session
    
    TODO: In production, save to database:
    - User ID (from authentication)
    - Timestamp
    - Session details
    - XP earned
    """
    try:
        # Calculate XP based on session quality
        xp_earned = 20  # Base XP
        
        # Duration bonus
        if session.duration >= 60:
            xp_earned += 10
        elif session.duration >= 30:
            xp_earned += 5
        
        # Performance bonus
        if session.score >= 90:
            xp_earned += 20
        elif session.score >= 70:
            xp_earned += 15
        elif session.score >= 50:
            xp_earned += 10
        
        # TODO: Save to database
        # Example:
        # db_session = SessionModel(
        #     user_id=current_user.id,
        #     topic=session.topic,
        #     duration=session.duration,
        #     notes=session.notes,
        #     score=session.score,
        #     xp_earned=xp_earned,
        #     created_at=datetime.now()
        # )
        # db.add(db_session)
        # db.commit()
        
        return {
            "status": "success",
            "xp_earned": xp_earned,
            "message": f"Session logged! Earned {xp_earned} XP",
            "breakdown": {
                "base": 20,
                "duration_bonus": xp_earned - 20 - (session.score // 10 if session.score >= 50 else 0),
                "performance_bonus": session.score // 10 if session.score >= 50 else 0
            }
        }
        
    except Exception as e:
        print(f"❌ Session logging error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit-quiz")
async def submit_quiz(result: QuizResult):
    """
    Record quiz results and calculate XP.
    
    XP Calculation:
    - 15 XP per correct answer
    - Bonus: +25 XP for perfect score (100%)
    
    Also updates the student's skill level for the topic.
    
    TODO: In production:
    - Save quiz results to database
    - Update skill scores in student profile
    - Track quiz history for analytics
    """
    try:
        # Calculate XP
        xp_per_question = 15
        xp_earned = result.score * xp_per_question
        
        # Perfect score bonus
        percentage = (result.score / result.total) * 100
        if percentage == 100:
            xp_earned += 25  # Perfect score bonus
        
        # TODO: Update skill level in database
        # Example:
        # skill = db.query(SkillModel).filter(
        #     SkillModel.user_id == current_user.id,
        #     SkillModel.topic == result.topic
        # ).first()
        # 
        # if skill:
        #     # Update existing skill with weighted average
        #     skill.score = (skill.score * 0.7) + (percentage * 0.3)
        # else:
        #     # Create new skill entry
        #     skill = SkillModel(
        #         user_id=current_user.id,
        #         topic=result.topic,
        #         score=percentage
        #     )
        #     db.add(skill)
        # 
        # db.commit()
        
        # Determine performance level
        if percentage >= 90:
            performance = "Excellent"
        elif percentage >= 80:
            performance = "Great"
        elif percentage >= 70:
            performance = "Good"
        elif percentage >= 60:
            performance = "Fair"
        else:
            performance = "Needs Practice"
        
        return {
            "status": "success",
            "xp_earned": xp_earned,
            "percentage": round(percentage, 1),
            "performance": performance,
            "message": f"Quiz completed! {result.score}/{result.total} correct ({performance})",
            "recommendation": (
                "Excellent! Ready to move to next topic." if percentage >= 80
                else "Good progress! Review weak areas before advancing." if percentage >= 60
                else "Keep practicing! Retake quiz after reviewing concepts."
            )
        }
        
    except Exception as e:
        print(f"❌ Quiz submission error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Helper Functions (for future database integration)
# ============================================================================

def calculate_skill_trend(user_id: int, topic: str):
    """
    Calculate skill improvement trend over time.
    Returns: "improving", "stable", or "declining"
    
    TODO: Implement when database is ready
    """
    pass

def get_recommended_problems(user_id: int, topic: str, difficulty: str):
    """
    Get personalized problem recommendations based on:
    - Current skill level in topic
    - Recent performance
    - Weak subtopics
    
    TODO: Implement with RAG system integration
    """
    pass

def update_streak(user_id: int):
    """
    Update user's study streak.
    - Increment if studied today
    - Reset if missed a day
    
    TODO: Implement with user model
    """
    pass