import os
import json
import asyncio
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from sqlmodel import Session, select
from auth import get_current_user
from database import get_session
from models import User, Goal, ContribDay, PomodoroSession
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/advisor", tags=["advisor"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def _get_user_context(user: User, session: Session) -> str:
    goals = session.exec(select(Goal).where(Goal.user_id == user.id)).all()
    goal_titles = [g.title for g in goals if not g.is_done]
    contribs = session.exec(select(ContribDay).where(ContribDay.user_id == user.id)).all()
    total_min = sum(c.minutes_studied for c in contribs)
    return (
        f"Student name: {user.name}. "
        f"Age: {user.age or 'unknown'}. "
        f"Goals: {', '.join(goal_titles) if goal_titles else 'none set yet'}. "
        f"Subjects of interest: {user.subjects or 'general'}. "
        f"Total study time logged: {round(total_min/60, 1)} hours. "
        f"Today's date: {date.today().isoformat()}."
    )


class ChatRequest(BaseModel):
    message: str
    mood: Optional[str] = "focused"
    subject: Optional[str] = ""


class DailyPlanRequest(BaseModel):
    mood: Optional[str] = "focused"
    available_hours: Optional[float] = 4.0


MOCK_RESPONSES = {
    "daily plan": """📅 **Your Daily Plan — AI Generated**

**Morning (9:00 - 11:00)**
🎯 Deep Work: Tackle your hardest subject (DSA / core concepts)
⏱️ 2× Pomodoro sessions (25 min work + 5 min break)

**Late Morning (11:15 - 12:30)**
📚 Review yesterday's notes + active recall quiz

**Afternoon (2:00 - 4:00)**
💻 Practice session: solve 2 problems or build a mini-project
🎵 Use focus music, keep phone away

**Evening (6:00 - 7:00)**
🔄 Light review: watch 1 YouTube explanation video
📝 Update your goals progress

**Key tip:** Quality > Quantity. Stay consistent!""",
    "default": "I'm your AI study advisor! Ask me anything — how to study a topic, whether to take a break, or how to plan your day. I'm here to help you get the most out of every session. 🚀",
}


async def _stream_gemini(prompt: str, context: str):
    """Stream response from Gemini API."""
    if not GEMINI_API_KEY:
        # Mock streaming for dev without API key
        response = MOCK_RESPONSES.get(
            "daily plan" if "plan" in prompt.lower() else "default",
            MOCK_RESPONSES["default"],
        )
        for char in response:
            yield f"data: {json.dumps({'text': char})}\n\n"
            await asyncio.sleep(0.01)
        yield "data: [DONE]\n\n"
        return

    try:
        import google.generativeai as genai
        print(f"DEBUG: Initializing Gemini for prompt: {prompt[:50]}...")
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        system_prompt = (
            "You are NeuroFlow AI, a high-precision study architect. "
            "Optimize for neuro-plasticity and time-efficiency. "
            f"\nCONTEXT: {context}"
        )
        full_prompt = f"{system_prompt}\n\nStudent: {prompt}"

        response = model.generate_content(full_prompt, stream=True)
        has_yielded = False
        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
                has_yielded = True
        
        if not has_yielded:
            yield f"data: {json.dumps({'text': 'Neural Link Stable. How can I assist you today?'})}\n\n"
            
        yield "data: [DONE]\n\n"
    except Exception as e:
        print(f"❌ GEMINI ERROR: {str(e)}")
        fallback = "Neural Link unstable, but I'm still here. Pro tip: Try a 5-min 'Micro-Focus' block to get started! 🚀"
        yield f"data: {json.dumps({'text': fallback})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    context = _get_user_context(user, session)
    mood_note = f"Student's current mood: {req.mood}." if req.mood else ""
    subject_note = f"Subject being studied: {req.subject}." if req.subject else ""
    prompt = f"{mood_note} {subject_note} Question: {req.message}"

    return StreamingResponse(
        _stream_gemini(prompt, context),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/daily-plan")
async def get_daily_plan(
    mood: str = Query("focused"),
    available_hours: float = Query(4.0),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    context = _get_user_context(user, session)
    prompt = (
        f"Create a detailed, personalized daily study plan for today. "
        f"The student has {available_hours} hours available. "
        f"Their current mood is: {mood}. "
        f"Include specific time blocks, Pomodoro sessions, breaks, and subject rotation. "
        f"Format with markdown headers and emojis. Make it motivating and realistic."
    )

    return StreamingResponse(
        _stream_gemini(prompt, context),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/subject-advice")
async def get_subject_advice(
    subject: str = Query("programming"),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    context = _get_user_context(user, session)
    prompt = (
        f"Give focused advice for studying '{subject}'. Include: "
        f"1) Seriousness level (Chill/Moderate/Intense) with reasoning, "
        f"2) Best learning approach for this student, "
        f"3) Common mistakes to avoid, "
        f"4) A 30-day mini roadmap. Format with markdown."
    )

    return StreamingResponse(
        _stream_gemini(prompt, context),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
