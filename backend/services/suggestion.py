"""
Domain name suggestion generator.
Creates creative variations of brand/domain names.
"""

# Common TLDs to suggest
TLDS = [".com", ".io", ".co", ".app", ".dev", ".net"]

# Common prefixes for domain suggestions
PREFIXES = ["get", "try", "use", "my", "the"]

# Common suffixes for domain suggestions
SUFFIXES = ["hq", "hub", "app", "io", "labs", "dev"]


def generate_suggestions(base_name: str, limit: int = 6) -> list[str]:
    """
    Generate creative domain name suggestions from a base name.
    
    Args:
        base_name: The brand or keyword to base suggestions on
        limit: Maximum number of suggestions to return
    
    Returns:
        List of suggested domain names
    """
    # Clean the input
    clean_name = base_name.replace(" ", "").lower()
    
    suggestions = []
    
    # 1. Base name with different TLDs
    for tld in [".com", ".io", ".co"]:
        suggestions.append(f"{clean_name}{tld}")
    
    # 2. Prefixed versions
    for prefix in PREFIXES[:2]:
        suggestions.append(f"{prefix}{clean_name}.com")
    
    # 3. Suffixed versions  
    for suffix in SUFFIXES[:2]:
        suggestions.append(f"{clean_name}{suffix}.com")
    
    # Remove duplicates and limit
    unique_suggestions = list(dict.fromkeys(suggestions))
    
    return unique_suggestions[:limit]
