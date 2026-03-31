from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime, date


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    google_sub: Optional[str] = Field(default=None, unique=True, index=True)
    email: str
    name: str
    picture: Optional[str] = None
    hashed_password: Optional[str] = None
    age: Optional[int] = None
    goals_text: Optional[str] = None
    subjects: Optional[str] = None  # JSON string list
    created_at: datetime = Field(default_factory=datetime.utcnow)
    onboarded: bool = False
    is_admin: bool = False
    face_id_snapshot: Optional[str] = None  # Base64 enrollment image
    xp: int = Field(default=0)
    level: int = Field(default=1)
    streak: int = Field(default=0)
    last_study_date: Optional[date] = None


class PomodoroSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    subject: str = ""
    duration_min: int = 25
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False
    mood_at_start: Optional[str] = None


class Goal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    description: Optional[str] = None
    target_date: Optional[date] = None
    progress: int = 0  # 0-100
    is_done: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContribDay(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    study_date: date
    minutes_studied: int = 0
    sessions_count: int = 0


class AccessLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    ip_address: Optional[str] = None
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user_agent: Optional[str] = None
    isp: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class WebcamSnapshot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    snapshot_data: str  # We store the raw base64 or path to an image
    emotion_detected: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Pydantic schemas (not table models)
class UserUpdate(SQLModel):
    name: Optional[str] = None
    age: Optional[int] = None
    goals_text: Optional[str] = None
    subjects: Optional[str] = None
    onboarded: Optional[bool] = None
    face_id_snapshot: Optional[str] = None


class GoalCreate(SQLModel):
    title: str
    description: Optional[str] = None
    target_date: Optional[date] = None


class GoalUpdate(SQLModel):
    progress: Optional[int] = None
    is_done: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[date] = None


class PomodoroCreate(SQLModel):
    subject: str = ""
    duration_min: int = 25
    mood_at_start: Optional[str] = None


class PomodoroComplete(SQLModel):
    session_id: int
    completed: bool = True
