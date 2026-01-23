"""
Configuration settings for the Domain Suggester API.
Loads environment variables and provides easy access throughout the app.
"""
import os
from dotenv import load_dotenv

# Load .env file from root
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_dir, '.env'))


class Config:
    """Application configuration from environment variables."""
    
    # WhoisXML API
    WHOIS_API_KEY = os.getenv("WHOIS_API_KEY", "")
    
    # Flask settings
    DEBUG = os.getenv("FLASK_ENV", "development") == "development"
    HOST = "0.0.0.0"
    PORT = 5000
    
    # Email (SMTP)
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    
    # URLs
    BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")
    
    # Security
    SUB_PROCESS_TOKEN = os.getenv("SUB_PROCESS_TOKEN", "")
    
    # CORS allowed origins
    CORS_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
    ]
