"""
Subscription endpoints for domain availability notifications.
Users can subscribe to get notified when a domain becomes available.
"""
from flask import Blueprint, request, jsonify, abort
from config import Config
from services import check_domain_availability, send_notification

subscription_bp = Blueprint("subscription", __name__, url_prefix="/api/v1")

# In-memory subscription storage (use a database in production)
subscriptions: list[dict] = []


@subscription_bp.route("/subscribe", methods=["POST"])
def subscribe():
    """
    Subscribe to domain availability notifications.
    
    Request body:
        { "email": "user@example.com", "domain": "example.com" }
    """
    data = request.get_json()
    
    email = data.get("email", "").strip()
    domain = data.get("domain", "").strip().lower()
    
    # Validate inputs
    if not email:
        abort(400, description="Email is required")
    if not domain:
        abort(400, description="Domain is required")
    if "@" not in email:
        abort(400, description="Invalid email format")
    
    # Check if already subscribed
    existing = next(
        (s for s in subscriptions if s["email"] == email and s["domain"] == domain),
        None
    )
    
    if existing:
        return jsonify({"message": f"Already subscribed to {domain}"})
    
    # Add subscription
    subscriptions.append({"email": email, "domain": domain})
    
    return jsonify({
        "message": f"Subscribed! We'll notify {email} when {domain} becomes available."
    })


@subscription_bp.route("/process_subscriptions", methods=["POST"])
def process_subscriptions():
    """
    Process all subscriptions and notify users of available domains.
    Protected endpoint - requires valid token.
    """
    data = request.get_json()
    token = data.get("token", "")
    
    # Verify authorization
    if token != Config.SUB_PROCESS_TOKEN:
        abort(401, description="Unauthorized")
    
    # Process each subscription
    notified = []
    
    for sub in subscriptions[:]:
        if check_domain_availability(sub["domain"]):
            if send_notification(sub["email"], sub["domain"]):
                notified.append(sub)
                subscriptions.remove(sub)
    
    return jsonify({
        "processed": len(notified),
        "notified": notified,
        "remaining": len(subscriptions)
    })
