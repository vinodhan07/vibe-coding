"""Routes module for API endpoints."""
from .health import health_bp
from .domain import domain_bp
from .subscription import subscription_bp
from .auth import auth_bp
from .google_auth import google_auth_bp

__all__ = ["health_bp", "domain_bp", "subscription_bp", "auth_bp", "google_auth_bp"]
