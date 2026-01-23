# Backend - Domain Suggester API

Flask-based REST API for checking domain availability and generating suggestions.

## Structure

```
backend/
├── app.py              # Main Flask application entry point
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── routes/
│   ├── __init__.py     # Routes initialization
│   ├── health.py       # Health check endpoint
│   ├── domain.py       # Domain checking endpoints
│   └── subscription.py # Email subscription endpoints
├── services/
│   ├── __init__.py     # Services initialization
│   ├── whois.py        # Domain availability checking
│   ├── suggestion.py   # Domain name generation
│   └── email.py        # Email notification service
└── .env.example        # Environment variables template
```

## Quick Start

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Server will start at http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/check` | Check domain or get suggestions |
| POST | `/api/v1/subscribe` | Subscribe to domain notifications |
