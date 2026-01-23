"""
Google OAuth authentication endpoint.
Uses Google's token verification to authenticate users.
"""
from flask import Blueprint, request, jsonify, abort
import requests
from models import create_user, verify_user, create_session, get_user_by_token
from models.user import get_db_path
import sqlite3

google_auth_bp = Blueprint("google_auth", __name__, url_prefix="/api/v1/auth")


def get_or_create_google_user(email: str, name: str) -> dict:
    """Get existing user or create new one for Google sign-in."""
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id, email, name FROM users WHERE email = ?", (email.lower(),))
    row = cursor.fetchone()
    
    if row:
        conn.close()
        return {"id": row[0], "email": row[1], "name": row[2]}
    
    # Create new user with random password (they'll use Google to login)
    import secrets
    random_password = secrets.token_hex(32)
    
    cursor.execute(
        "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
        (email.lower(), random_password, name)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    return {"id": user_id, "email": email, "name": name}


@google_auth_bp.route("/google", methods=["POST"])
def google_login():
    """
    Authenticate with Google OAuth token.
    
    Request body:
        { "credential": "google_id_token" }
    """
    data = request.get_json()
    credential = data.get("credential", "")
    
    if not credential:
        abort(400, description="Google credential is required")
    
    try:
        # Verify the token with Google
        google_response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}",
            timeout=10
        )
        
        if google_response.status_code != 200:
            abort(401, description="Invalid Google token")
        
        google_data = google_response.json()
        
        email = google_data.get("email")
        name = google_data.get("name", email.split("@")[0])
        
        if not email:
            abort(401, description="Could not get email from Google")
        
        # Get or create user
        user = get_or_create_google_user(email, name)
        
        # Create session
        token = create_session(user["id"])
        
        return jsonify({
            "message": "Google login successful",
            "user": {"email": user["email"], "name": user["name"]},
            "token": token
        })
        
    except requests.RequestException as e:
        abort(500, description="Failed to verify Google token")
