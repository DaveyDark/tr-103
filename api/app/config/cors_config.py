import os
from typing import List, Union

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_cors_origins() -> List[str]:
    """Get CORS origins from environment variable with fallback defaults."""
    env_origins = os.getenv("CORS_ALLOW_ORIGINS", "")
    if env_origins:
        # Split by comma and strip whitespace
        origins = [
            origin.strip() for origin in env_origins.split(",") if origin.strip()
        ]
        return origins

    # Fallback defaults
    return ["http://localhost:3000"]


def get_cors_methods() -> Union[List[str], str]:
    """Get CORS methods from environment variable with fallback defaults."""
    env_methods = os.getenv("CORS_ALLOW_METHODS", "")
    if env_methods:
        if env_methods == "*":
            return "*"
        # Split by comma and strip whitespace
        methods = [
            method.strip().upper()
            for method in env_methods.split(",")
            if method.strip()
        ]
        return methods

    # Fallback default
    return ["*"]


def get_cors_headers() -> Union[List[str], str]:
    """Get CORS headers from environment variable with fallback defaults."""
    env_headers = os.getenv("CORS_ALLOW_HEADERS", "")
    if env_headers:
        if env_headers == "*":
            return "*"
        # Split by comma and strip whitespace
        headers = [
            header.strip() for header in env_headers.split(",") if header.strip()
        ]
        return headers

    # Fallback default
    return ["*"]


def get_cors_credentials() -> bool:
    """Get CORS credentials setting from environment variable with fallback default."""
    env_credentials = os.getenv("CORS_ALLOW_CREDENTIALS", "false").lower()
    return env_credentials in ("true", "1", "yes", "on")


def get_cors_max_age() -> int:
    """Get CORS max age from environment variable with fallback default."""
    try:
        return int(os.getenv("CORS_MAX_AGE", "3600"))
    except ValueError:
        return 3600


# CORS configuration
cors_settings = {
    "allow_origins": get_cors_origins(),
    "allow_methods": get_cors_methods(),
    "allow_headers": get_cors_headers(),
    "allow_credentials": get_cors_credentials(),
    "max_age": get_cors_max_age(),
}
