"""
User model using SQLite for persistence.
"""
import sqlite3
import hashlib
import secrets
import os
from datetime import datetime


def get_db_path():
    """Get the database file path."""
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(root_dir, "users.db")


def init_db():
    """Initialize the database with users table."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(email: str, password: str, name: str) -> dict | None:
    """Create a new user."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
            (email.lower(), hash_password(password), name)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"id": user_id, "email": email, "name": name}
    except sqlite3.IntegrityError:
        conn.close()
        return None


def verify_user(email: str, password: str) -> dict | None:
    """Verify user credentials and return user data."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, email, name FROM users WHERE email = ? AND password_hash = ?",
        (email.lower(), hash_password(password))
    )
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "email": row[1], "name": row[2]}
    return None


def create_session(user_id: int) -> str:
    """Create a new session token for a user."""
    token = secrets.token_hex(32)
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
        (user_id, token)
    )
    conn.commit()
    conn.close()
    return token


def get_user_by_token(token: str) -> dict | None:
    """Get user data from session token."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.email, u.name 
        FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "email": row[1], "name": row[2]}
    return None


def delete_session(token: str):
    """Delete a session (logout)."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()


# Initialize database on import
init_db()
