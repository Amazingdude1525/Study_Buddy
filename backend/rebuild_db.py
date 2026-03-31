import os
from database import engine, create_db_and_tables
from sqlmodel import SQLModel

def rebuild():
    print("🚀 Starting Database Cleanse...")
    
    # 1. Close connections is handled by closing scope if needed, 
    # but here we just delete the file.
    db_file = "vityarthi.db"
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
            print(f"✅ Successfully deleted old database: {db_file}")
        except Exception as e:
            print(f"❌ Could not delete {db_file}: {e}")
            print("Please stop the backend terminal and try again.")
            return

    # 2. Recreate
    print("⚡ Re-initializing all tables (User, Pomodoro, AccessLog, etc.)...")
    create_db_and_tables()
    print("✨ Database Rebuilt Successfully! You can now restart the backend.")

if __name__ == "__main__":
    rebuild()
