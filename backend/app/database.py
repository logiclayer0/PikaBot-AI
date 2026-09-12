import sqlite3
import bcrypt

DB_NAME = "pikabot.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
   
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            streak_count INTEGER DEFAULT 1,
            xp_points INTEGER DEFAULT 50,
            last_active DATE DEFAULT CURRENT_DATE
        )
    ''')
   
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            task_text TEXT NOT NULL,
            is_completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()


def register_user(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
        conn.commit()
        return True, "User registered successfully!"
    except sqlite3.IntegrityError:
        return False, "Username already exists!"
    finally:
        conn.close()

def verify_user(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row and bcrypt.checkpw(password.encode('utf-8'), row[0].encode('utf-8')):
        return True
    return False

def save_chat(username, role, message):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chats (username, role, message) VALUES (?, ?, ?)", (username, role, message))
    conn.commit()
    conn.close()

def get_chat_history(username):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT role, message FROM chats WHERE username = ? ORDER BY id ASC", (username,))
    rows = cursor.fetchall()
    conn.close()
    return [{"role": r[0], "content": r[1]} for r in rows]


def get_or_update_stats(username):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
  
    cursor.execute("SELECT streak_count, xp_points, last_active FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return {"streak": 1, "xp": 50}
        
    streak, xp, last_active = row
    cursor.execute("UPDATE users SET last_active = CURRENT_DATE WHERE username = ?", (username,))
    conn.commit()
    conn.close()
    
    return {"streak": streak or 1, "xp": xp or 50}

def add_task(username, task_text):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (username, task_text) VALUES (?, ?)", (username, task_text))
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": task_id, "text": task_text, "completed": False}

def get_user_tasks(username):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, task_text, is_completed FROM tasks WHERE username = ? ORDER BY id DESC", (username,))
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "text": r[1], "completed": bool(r[2])} for r in rows]

def toggle_task(task_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return True
