import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from database import create_db_and_tables, get_session
import httpx
from auth import exchange_google_code, get_or_create_user, create_access_token
from routers import users, sentiment, music, pomodoro, goals, contributions, advisor, resources, sandbox, admin
from sqlmodel import Session, select
from models import User, AccessLog
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(
    title="AI Vityarthi API",
    description="Backend for the AI-powered personal study assistant",
    version="1.0.0",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(users.router)
app.include_router(sentiment.router)
app.include_router(music.router)
app.include_router(pomodoro.router)
app.include_router(goals.router)
app.include_router(contributions.router)
app.include_router(advisor.router)
app.include_router(resources.router)
app.include_router(sandbox.router)
app.include_router(admin.router)


@app.on_event("startup")
def startup():
    create_db_and_tables()


# ── Auth endpoint ──────────────────────────────────────────────────────────────

class GoogleLoginPayload(BaseModel):
    code: str  # Google auth-code from frontend

@app.post("/auth/google")
async def google_login(
    payload: GoogleLoginPayload,
    request: Request,
    db: Session = Depends(get_session),
):
    """Exchange Google auth code for JWT."""
    google_info = await exchange_google_code(payload.code, "postmessage")
    if not google_info:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    user = get_or_create_user(db, google_info)
    
    # [NEW] Log IP and Geographical Location
    client_ip = request.client.host if request.client else None
    city, country = None, None
    if client_ip and client_ip not in ["127.0.0.1", "::1", "localhost"]:
        try:
            with httpx.Client(timeout=3.0) as client:
                ip_resp = client.get(f"http://ip-api.com/json/{client_ip}")
                if ip_resp.status_code == 200:
                    ip_data = ip_resp.json()
                    city = ip_data.get("city")
                    country = ip_data.get("country")
        except Exception:
            pass

    from models import AccessLog
    log_entry = AccessLog(
        user_id=user.id,
        ip_address=client_ip,
        location_city=city,
        location_country=country
    )
    db.add(log_entry)
    db.commit()

    access_token = create_access_token({"user_id": user.id, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "picture": user.picture,
            "onboarded": user.onboarded,
            "is_admin": user.is_admin,
        },
    }

class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str

@app.post("/auth/register")
def email_register(payload: RegisterPayload, request: Request, db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.email == payload.email)).first()
    if user: raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(payload.password)
    user = User(email=payload.email, name=payload.name, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    client_ip = request.client.host if request.client else None
    log_entry = AccessLog(user_id=user.id, ip_address=client_ip)
    db.add(log_entry)
    db.commit()
    
    access_token = create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "id": user.id, "name": user.name, "email": user.email, "onboarded": user.onboarded, "is_admin": user.is_admin
    }}

class LoginPayload(BaseModel):
    email: str
    password: str

@app.post("/auth/login")
def email_login(payload: LoginPayload, request: Request, db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.email == payload.email)).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    client_ip = request.client.host if request.client else None
    log_entry = AccessLog(user_id=user.id, ip_address=client_ip)
    db.add(log_entry)
    db.commit()
    
    access_token = create_access_token({"user_id": user.id, "email": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "id": user.id, "name": user.name, "email": user.email, "onboarded": user.onboarded, "is_admin": user.is_admin
    }}


@app.get("/health")
def health():
    return {"status": "ok", "service": "AI Vityarthi API"}


@app.get("/")
def root():
    return {"message": "AI Vityarthi API — visit /docs for Swagger UI"}
