import os
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from dotenv import load_dotenv

load_dotenv()

# Neon / PostgreSQL / SQLite Support
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vityarthi.db")

# SQLAlchemy requires postgresql:// instead of postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite-specific arguments (not needed for PG)
engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args = {"connect_args": {"check_same_thread": False}}

engine = create_engine(DATABASE_URL, **engine_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
