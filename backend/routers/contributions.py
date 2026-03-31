from fastapi import APIRouter, Depends
from typing import List, Dict
from sqlmodel import Session, select
from datetime import date, timedelta
from database import get_session
from models import ContribDay
from auth import get_current_user, User

router = APIRouter(prefix="/contributions", tags=["contributions"])


@router.get("/")
def get_contributions(
    weeks: int = 52,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Return contribution data for the past N weeks (GitHub heatmap style)."""
    end = date.today()
    start = end - timedelta(weeks=weeks)

    rows = session.exec(
        select(ContribDay).where(
            ContribDay.user_id == user.id,
            ContribDay.study_date >= start,
        )
    ).all()

    contrib_map: Dict[str, dict] = {}
    for row in rows:
        contrib_map[str(row.study_date)] = {
            "minutes": row.minutes_studied,
            "sessions": row.sessions_count,
        }

    # Build a full calendar grid
    result = []
    current = start
    while current <= end:
        key = str(current)
        result.append({
            "date": key,
            "minutes": contrib_map.get(key, {}).get("minutes", 0),
            "sessions": contrib_map.get(key, {}).get("sessions", 0),
        })
        current += timedelta(days=1)

    return {
        "data": result,
        "total_days_studied": len([r for r in result if r["minutes"] > 0]),
        "total_minutes": sum(r["minutes"] for r in result),
        "current_streak": user.streak,
        "xp": user.xp,
        "level": user.level,
    }


def _calc_streak(data: list) -> int:
    streak = 0
    for day in reversed(data):
        if day["minutes"] > 0:
            streak += 1
        else:
            break
    return streak


@router.get("/stats")
def contribution_stats(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = session.exec(
        select(ContribDay).where(ContribDay.user_id == user.id)
    ).all()
    total_min = sum(r.minutes_studied for r in rows)
    return {
        "total_days": len(rows),
        "total_minutes": total_min,
        "total_hours": round(total_min / 60, 1),
        "avg_minutes_per_day": round(total_min / max(len(rows), 1), 1),
    }
