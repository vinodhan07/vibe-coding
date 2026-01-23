"""Services module for business logic."""
from .whois import check_domain_availability
from .suggestion import generate_suggestions
from .email import send_notification

__all__ = ["check_domain_availability", "generate_suggestions", "send_notification"]
