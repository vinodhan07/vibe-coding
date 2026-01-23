"""
Email notification service for domain availability alerts.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config


def send_notification(to_email: str, domain: str) -> bool:
    """
    Send an email notification when a domain becomes available.
    
    Args:
        to_email: Recipient email address
        domain: The domain that became available
    
    Returns:
        True if email sent successfully, False otherwise
    """
    if not Config.SMTP_USERNAME or not Config.SMTP_PASSWORD:
        print("Warning: SMTP not configured, skipping email")
        return False
    
    try:
        # Create message
        subject = f"🎉 Domain Available: {domain}"
        body = f"""
Good news!

The domain "{domain}" is now available for registration.

🔗 Check it out: {Config.BASE_URL}

Don't wait too long - domains get registered quickly!

---
Domain Suggester
        """.strip()
        
        msg = MIMEMultipart()
        msg["From"] = Config.SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))
        
        # Send email
        with smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT) as server:
            server.starttls()
            server.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)
            server.sendmail(Config.SMTP_USERNAME, to_email, msg.as_string())
        
        print(f"✅ Email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False
