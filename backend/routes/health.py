"""
Health check endpoint.
Used to verify the API is running and configured correctly.
"""
from flask import Blueprint, jsonify
from config import Config

health_bp = Blueprint("health", __name__)


@health_bp.route("/", methods=["GET"])
def root():
    """API information endpoint."""
    return jsonify({
        "message": "Domain Suggester API 🚀",
        "version": "1.0.0",
        "endpoints": [
            {"GET": "/api/v1/health"},
            {"POST": "/api/v1/check"},
            {"POST": "/api/v1/subscribe"},
        ]
    })


@health_bp.route("/api/v1/health", methods=["GET"])
def health():
    """Health check with configuration status."""
    return jsonify({
        "status": "ok",
        "whois_configured": bool(Config.WHOIS_API_KEY),
        "smtp_configured": bool(Config.SMTP_USERNAME and Config.SMTP_PASSWORD)
    })
