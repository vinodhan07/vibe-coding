"""
Domain checking API endpoints.
Check availability and get suggestions for domain names.
"""
from flask import Blueprint, request, jsonify, abort
from services import check_domain_availability, generate_suggestions

domain_bp = Blueprint("domain", __name__, url_prefix="/api/v1")


@domain_bp.route("/check", methods=["POST"])
def check_domain():
    """
    Check domain availability or generate suggestions.
    
    Request body:
        { "input": "brandname" } or { "input": "example.com" }
    
    Returns:
        - If domain entered: availability status + suggestions if taken
        - If brand entered: list of available domain suggestions
    """
    data = request.get_json()
    
    # Validate input
    if not data or "input" not in data:
        abort(400, description="Missing 'input' field")
    
    user_input = data["input"].strip().lower()
    
    if not user_input:
        abort(400, description="Input cannot be empty")
    
    # Check if it's a full domain or a brand name
    is_domain = "." in user_input
    
    if is_domain:
        return _handle_domain_check(user_input)
    else:
        return _handle_brand_search(user_input)


def _handle_domain_check(domain: str):
    """Handle checking a specific domain."""
    is_available = check_domain_availability(domain)
    
    response = {
        "input": domain,
        "is_domain": True,
        "main_result": {
            "domain": domain,
            "available": is_available
        }
    }
    
    # If taken, suggest alternatives
    if not is_available:
        base_name = domain.split(".")[0]
        suggestions = generate_suggestions(base_name)
        response["suggestions"] = [
            {"domain": s, "available": check_domain_availability(s)}
            for s in suggestions
        ]
    
    return jsonify(response)


def _handle_brand_search(brand: str):
    """Handle searching suggestions for a brand name."""
    suggestions = generate_suggestions(brand)
    
    return jsonify({
        "input": brand,
        "is_domain": False,
        "suggestions": [
            {"domain": s, "available": check_domain_availability(s)}
            for s in suggestions
        ]
    })
