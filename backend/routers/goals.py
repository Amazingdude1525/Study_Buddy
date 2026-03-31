from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from datetime import date, datetime
from database import get_session
from models import Goal, GoalCreate, GoalUpdate, ContribDay, PomodoroSession
from auth import get_current_user, User, update_user_stats

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("/", response_model=List[Goal])
def list_goals(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return session.exec(select(Goal).where(Goal.user_id == user.id)).all()


@router.post("/", response_model=Goal)
def create_goal(
    data: GoalCreate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    goal = Goal(**data.model_dump(), user_id=user.id)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


@router.patch("/{goal_id}", response_model=Goal)
def update_goal(
    goal_id: int,
    data: GoalUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != user.id:
        raise HTTPException(status_code=404, detail="Goal not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(goal, field, value)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != user.id:
        raise HTTPException(status_code=404, detail="Goal not found")
    session.delete(goal)
    session.commit()
    return {"ok": True}
