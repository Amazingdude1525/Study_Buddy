import os
from fastapi import FastAPI, HTTPException, Depends, Request
import traceback
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from database import create_db_and_tables, get_session
# Ensure tables are updated/created
try:
    create_db_and_tables()
except Exception as e:
    print(f"⚠️ DATABASE WARNING: {e}")
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from auth import get_or_create_user, create_access_token, GOOGLE_CLIENT_ID
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

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://study-buddy-vityarthi.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
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

@app.post("/auth/google")
async def google_login(
    payload: dict,
    request: Request,
    db: Session = Depends(get_session),
):
    """Verify Google ID token (credential) and return JWT."""
    credential = payload.get("credential")
    if not credential:
        raise HTTPException(status_code=400, detail="Missing Google credential")

    try:
        # Verify the ID token
        idinfo = id_token.verify_oauth2_token(
            credential, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        # google_info contains 'email', 'name', 'picture', 'sub', etc.
        google_info = idinfo
    except Exception as e:
        print("❌ GOOGLE AUTH CRITICAL ERROR:")
        traceback.print_exc()
        raise HTTPException(status_code=401, detail=f"Google Verification Error: {str(e)}")

    user = get_or_create_user(db, google_info)
    
    # [NEW] Log IP and Geographical Location (Hardened for Proxy/Railway)
    forwarded = request.headers.get("X-Forwarded-For")
    user_agent = request.headers.get("User-Agent")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else None
        
    city, country, lat, lon, isp = None, None, None, None, None
    if client_ip and client_ip not in ["127.0.0.1", "::1", "localhost", "0.0.0.0"]:
        try:
            with httpx.Client(timeout=5.0) as client:
                ip_resp = client.get(f"http://ip-api.com/json/{client_ip}")
                if ip_resp.status_code == 200:
                    ip_data = ip_resp.json()
                    if ip_data.get("status") == "success":
                        city = ip_data.get("city")
                        country = ip_data.get("country")
                        lat = ip_data.get("lat")
                        lon = ip_data.get("lon")
                        isp = ip_data.get("isp")
        except Exception as e:
            print(f"⚠️ IP API ERROR for {client_ip}: {e}")

    log_entry = AccessLog(
        user_id=user.id,
        ip_address=client_ip,
        location_city=city,
        location_country=country,
        latitude=lat,
        longitude=lon,
        user_agent=user_agent,
        isp=isp
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
            "xp": user.xp,
            "level": user.level,
            "streak": user.streak,
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
