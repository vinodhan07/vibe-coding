"""
Domain availability checking service using WhoisXML API.
"""
import requests
from config import Config


def check_domain_availability(domain: str) -> bool:
    """
    Check if a domain is available for registration.
    
    Args:
        domain: The domain name to check (e.g., "example.com")
    
    Returns:
        True if domain is available, False otherwise
    """
    if not Config.WHOIS_API_KEY:
        print("Warning: WHOIS_API_KEY not configured")
        return False
    
    try:
        url = (
            f"https://domain-availability.whoisxmlapi.com/api/v1"
            f"?apiKey={Config.WHOIS_API_KEY}"
            f"&domainName={domain}"
            f"&outputFormat=JSON"
        )
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        availability = data.get("DomainInfo", {}).get("domainAvailability")
        
        return availability == "AVAILABLE"
        
    except requests.RequestException as e:
        print(f"API request failed: {e}")
        return False
    except Exception as e:
        print(f"Error checking domain: {e}")
        return False
