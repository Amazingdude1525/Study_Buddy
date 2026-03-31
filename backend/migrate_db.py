import sqlite3

def migrate():
    conn = sqlite3.connect('vityarthi.db')
    cursor = conn.cursor()
    columns = [
        ("xp", "INTEGER DEFAULT 0"),
        ("level", "INTEGER DEFAULT 1"),
        ("streak", "INTEGER DEFAULT 0"),
        ("last_study_date", "DATE")
    ]
    for col_name, col_type in columns:
        try:
            print(f"Adding column {col_name}...")
            cursor.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}")
            conn.commit()
            print(f"Successfully added {col_name}.")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"Column {col_name} already exists.")
            else:
                print(f"Migration Error on {col_name}: {e}")
    conn.close()

if __name__ == "__main__":
    migrate()
