import os
import smtplib
import requests
from flask import Flask, request, jsonify, abort
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://preview--brandfinder-ui.lovable.app", "https://baaae0e8ee46.ngrok-free.app/"]}})

# Config from .env
WHOIS_API_KEY = os.getenv("WHOIS_API_KEY")
SMTP_SERVER = os.getenv("SMTP_SERVER", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")
SUB_PROCESS_TOKEN = os.getenv("SUB_PROCESS_TOKEN")

# In-memory subscriptions (for demo)
subscriptions = []


@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "message": "Domain Suggester API running 🚀",
        "endpoints": [
            {"GET": "/api/v1/health"},
            {"POST": "/api/v1/check"},
            {"POST": "/api/v1/subscribe"},
            {"POST": "/api/v1/process_subscriptions"}
        ]
    })


@app.route("/api/v1/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "whois_configured": bool(WHOIS_API_KEY),
        "smtp_configured": bool(SMTP_USERNAME and SMTP_PASSWORD)
    })


def check_domain_availability(domain: str) -> bool:
    """Check domain availability using WhoisXML API."""
    try:
        url = f"https://domain-availability.whoisxmlapi.com/api/v1?apiKey={WHOIS_API_KEY}&domainName={domain}&outputFormat=JSON"
        response = requests.get(url)
        data = response.json()
        return data.get("DomainInfo", {}).get("domainAvailability") == "AVAILABLE"
    except Exception as e:
        print(f"Error checking domain: {e}")
        return False


def generate_suggestions(base: str):
    """Generate creative domain name ideas."""
    base = base.replace(" ", "").lower()
    suggestions = [
        f"get{base}.com",
        f"{base}app.com",
        f"{base}.io",
        f"{base}.co",
        f"try{base}.com",
        f"{base}hub.com",
    ]
    return suggestions


@app.route("/api/v1/check", methods=["POST"])
def check_domain():
    """Check domain or generate suggestions."""
    data = request.get_json()
    if not data or "input" not in data:
        abort(400, "Missing 'input' field")

    user_input = data["input"].strip().lower()

    # Determine if it's a domain or brand
    if "." in user_input:
        # Full domain entered
        available = check_domain_availability(user_input)
        if available:
            return jsonify({"domain": user_input, "available": True})
        else:
            alt_suggestions = generate_suggestions(user_input.split(".")[0])
            available_suggestions = [
                d for d in alt_suggestions if check_domain_availability(d)
            ]
            return jsonify({
                "domain": user_input,
                "available": False,
                "suggestions": available_suggestions
            })
    else:
        # Brand name entered
        alt_suggestions = generate_suggestions(user_input)
        available_suggestions = [
            d for d in alt_suggestions if check_domain_availability(d)
        ]
        return jsonify({
            "brand": user_input,
            "suggestions": available_suggestions
        })


@app.route("/api/v1/subscribe", methods=["POST"])
def subscribe():
    """Subscribe user for notification when domain becomes available."""
    data = request.get_json()
    email = data.get("email")
    domain = data.get("domain")

    if not email or not domain:
        abort(400, "Missing 'email' or 'domain'")

    subscriptions.append({"email": email, "domain": domain})
    return jsonify({"message": f"{email} subscribed for {domain} notifications."})


@app.route("/api/v1/process_subscriptions", methods=["POST"])
def process_subscriptions():
    """Process subscriptions and send notification if a domain becomes available."""
    data = request.get_json()
    token = data.get("token")

    if token != SUB_PROCESS_TOKEN:
        abort(401, "Unauthorized")

    sent = []
    for sub in subscriptions[:]:
        if check_domain_availability(sub["domain"]):
            send_email_notification(sub["email"], sub["domain"])
            sent.append(sub)
            subscriptions.remove(sub)

    return jsonify({"processed": len(sent), "notified": sent})


def send_email_notification(to_email, domain):
    """Send email notification to the subscriber."""
    try:
        subject = f"Domain Available: {domain}"
        body = f"Good news! The domain {domain} is now available.\n\nYou can register it now.\n\n{BASE_URL}"

        msg = MIMEMultipart()
        msg["From"] = SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, to_email, msg.as_string())
            print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
