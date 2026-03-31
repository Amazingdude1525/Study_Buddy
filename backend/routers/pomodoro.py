from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlmodel import Session, select
from datetime import date, datetime, timedelta
from database import get_session
from models import PomodoroSession, PomodoroCreate, PomodoroComplete, ContribDay
from auth import get_current_user, User, update_user_stats

router = APIRouter(prefix="/pomodoro", tags=["pomodoro"])


def _update_contrib(session: Session, user_id: int, duration_min: int):
    """Add study minutes to today's contribution day."""
    today = date.today()
    contrib = session.exec(
        select(ContribDay).where(
            ContribDay.user_id == user_id, ContribDay.study_date == today
        )
    ).first()
    if not contrib:
        contrib = ContribDay(user_id=user_id, study_date=today)
        session.add(contrib)
    contrib.minutes_studied += duration_min
    contrib.sessions_count += 1
    session.commit()


@router.post("/start", response_model=PomodoroSession)
def start_session(
    data: PomodoroCreate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pomo = PomodoroSession(**data.model_dump(), user_id=user.id)
    session.add(pomo)
    session.commit()
    session.refresh(pomo)
    return pomo


@router.post("/complete")
def complete_session(
    data: PomodoroComplete,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pomo = session.get(PomodoroSession, data.session_id)
    if not pomo or pomo.user_id != user.id:
        raise HTTPException(status_code=404)
    pomo.completed = data.completed
    session.add(pomo)
    session.commit()
    if data.completed:
        _update_contrib(session, user.id, pomo.duration_min)
        update_user_stats(session, user, minutes=pomo.duration_min)
    return {"ok": True, "session_id": pomo.id}


@router.get("/sessions", response_model=List[PomodoroSession])
def list_sessions(
    limit: int = 20,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(
        select(PomodoroSession)
        .where(PomodoroSession.user_id == user.id)
        .order_by(PomodoroSession.started_at.desc())
        .limit(limit)
    ).all()


@router.get("/stats")
def session_stats(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    sessions = session.exec(
        select(PomodoroSession).where(PomodoroSession.user_id == user.id)
    ).all()
    total = len(sessions)
    completed = sum(1 for s in sessions if s.completed)
    total_min = sum(s.duration_min for s in sessions if s.completed)
    return {
        "total_sessions": total,
        "completed_sessions": completed,
        "total_minutes": total_min,
        "total_hours": round(total_min / 60, 1),
    }
