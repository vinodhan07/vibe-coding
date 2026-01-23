"""
Authentication API endpoints.
Register, Login, Logout, and Get Current User.
"""
from flask import Blueprint, request, jsonify, abort
from models import create_user, verify_user, create_session, get_user_by_token, delete_session

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    
    Request body:
        { "email": "user@example.com", "password": "...", "name": "John Doe" }
    """
    data = request.get_json()
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    name = data.get("name", "").strip()
    
    # Validation
    if not email or "@" not in email:
        abort(400, description="Valid email is required")
    if len(password) < 6:
        abort(400, description="Password must be at least 6 characters")
    if not name:
        abort(400, description="Name is required")
    
    # Create user
    user = create_user(email, password, name)
    
    if not user:
        abort(409, description="Email already registered")
    
    # Auto-login after registration
    token = create_session(user["id"])
    
    return jsonify({
        "message": "Registration successful",
        "user": {"email": user["email"], "name": user["name"]},
        "token": token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login with email and password.
    
    Request body:
        { "email": "user@example.com", "password": "..." }
    """
    data = request.get_json()
    
    email = data.get("email", "").strip()
    password = data.get("password", "")
    
    if not email or not password:
        abort(400, description="Email and password are required")
    
    user = verify_user(email, password)
    
    if not user:
        abort(401, description="Invalid email or password")
    
    token = create_session(user["id"])
    
    return jsonify({
        "message": "Login successful",
        "user": {"email": user["email"], "name": user["name"]},
        "token": token
    })


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout by invalidating the session token."""
    auth_header = request.headers.get("Authorization", "")
    
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        delete_session(token)
    
    return jsonify({"message": "Logged out successfully"})


@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    """Get the current logged-in user's info."""
    auth_header = request.headers.get("Authorization", "")
    
    if not auth_header.startswith("Bearer "):
        abort(401, description="Authentication required")
    
    token = auth_header[7:]
    user = get_user_by_token(token)
    
    if not user:
        abort(401, description="Invalid or expired session")
    
    return jsonify({
        "user": {"email": user["email"], "name": user["name"]}
    })
