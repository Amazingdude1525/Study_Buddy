from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from database import get_session
from models import User, UserUpdate
from auth import get_current_user
import json

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return user


@router.patch("/profile")
def update_profile(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
