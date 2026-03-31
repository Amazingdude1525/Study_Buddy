import os
import httpx
from datetime import datetime, timedelta, date
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from database import get_session
from models import User
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "vityarthi_dev_secret_key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/google", auto_error=False)


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(days=JWT_EXPIRY_DAYS)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def exchange_google_code(code: str, redirect_uri: str) -> Optional[dict]:
    """Exchange Google auth code for user info."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return None

    try:
        print(f"DEBUG: Beginning Google code exchange for code: {code[:10]}...")
        # Step 1: Exchange code for tokens
        with httpx.Client(timeout=15.0) as client:
            print(f"DEBUG: Sending POST to Google token endpoint with redirect_uri: {redirect_uri}")
            token_resp = client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
            print(f"DEBUG: Token response status: {token_resp.status_code}")
            if token_resp.status_code != 200:
                print(f"DEBUG: Token exchange failed. Error: {token_resp.text}")
                return None
            tokens = token_resp.json()
            access_token = tokens.get("access_token")
            if not access_token:
                print("DEBUG: No access_token found in response.")
                return None

            print("DEBUG: Fetching user profile from Google...")
            # Step 2: Fetch user profile
            user_resp = client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            print(f"DEBUG: User profile status: {user_resp.status_code}")
            if user_resp.status_code != 200:
                print(f"DEBUG: Failed to fetch user info. Error: {user_resp.text}")
                return None
            
            user_info = user_resp.json()
            # Ensure sub/id is normalized
            if "sub" not in user_info and "id" in user_info:
                user_info["sub"] = user_info["id"]
            print(f"DEBUG: Successfully fetched user info for email: {user_info.get('email')}")
            return user_info
    except Exception as e:
        print("Exception in Google exchange:", e)
        return None


def get_or_create_user(session: Session, google_info: dict) -> User:
    sub = google_info.get("sub")
    email = google_info.get("email")
    name = google_info.get("name", "User")
    picture = google_info.get("picture")

    user = session.exec(select(User).where(User.google_sub == sub)).first()
    if not user:
        user = User(
            google_sub=sub,
            email=email,
            name=name,
            picture=picture,
            xp=0,
            level=1,
            streak=0
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.get(User, user_id)
    if not user:
        raise credentials_exception
    return user


def update_user_stats(session: Session, user: User, minutes: int = 0, task_completed: bool = False):
    """Update user XP, Level, and Streak progression."""
    # XP thresholds and gains
    xp_per_minute = 10
    xp_per_task = 50
    xp_per_level = 500

    # Calculate gains
    gained_xp = (minutes * xp_per_minute) + (xp_per_task if task_completed else 0)
    user.xp += gained_xp

    # Level calculation
    new_level = (user.xp // xp_per_level) + 1
    if new_level > user.level:
        user.level = new_level

    # Streak logic
    today = date.today()
    if not user.last_study_date:
        user.streak = 1
        user.last_study_date = today
    else:
        days_since_last = (today - user.last_study_date).days
        if days_since_last == 1:
            user.streak += 1
            user.last_study_date = today
        elif days_since_last > 1:
            user.streak = 1
            user.last_study_date = today
        # if days_since_last == 0, streak stays the same

    session.add(user)
    session.commit()
    session.refresh(user)
