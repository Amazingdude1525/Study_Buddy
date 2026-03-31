import sqlite3
import sys

def make_admin(email):
    conn = sqlite3.connect('vityarthi.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE user SET is_admin = 1 WHERE email = ?", (email,))
    if cursor.rowcount > 0:
        conn.commit()
        print(f"✅ User {email} is now an ADMIN.")
    else:
        print(f"❌ User {email} not found in database.")
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py your-email@gmail.com")
    else:
        make_admin(sys.argv[1])
