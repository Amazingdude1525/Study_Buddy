from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from auth import get_current_user
from models import User, AccessLog, WebcamSnapshot

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Insufficient privileges")
    return user

@router.get("/users")
def get_all_users(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    users = session.exec(select(User).order_by(User.created_at.desc())).all()
    return users

@router.get("/logs")
def get_access_logs(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    logs = session.exec(select(AccessLog).order_by(AccessLog.timestamp.desc())).all()
    return logs

@router.get("/snapshots")
def get_webcam_snapshots(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin)
):
    # Only return the last 100 to avoid massive payload size
    snapshots = session.exec(select(WebcamSnapshot).order_by(WebcamSnapshot.timestamp.desc()).limit(100)).all()
    return snapshots
