"""
Domain Suggester API - Main Application Entry Point

A Flask-based REST API for checking domain availability 
and generating domain name suggestions.
"""
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes import health_bp, domain_bp, subscription_bp, auth_bp, google_auth_bp


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Enable CORS for frontend
    CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})
    
    # Register blueprints (routes)
    app.register_blueprint(health_bp)
    app.register_blueprint(domain_bp)
    app.register_blueprint(subscription_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(google_auth_bp)
    
    # Custom error handlers to return JSON instead of HTML
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": error.description or "Bad request"}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": error.description or "Unauthorized"}), 401
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404
    
    @app.errorhandler(409)
    def conflict(error):
        return jsonify({"error": error.description or "Conflict"}), 409
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500
    
    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    print("🚀 Starting Domain Suggester API...")
    print(f"   Running at http://{Config.HOST}:{Config.PORT}")
    print(f"   Debug mode: {Config.DEBUG}")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
