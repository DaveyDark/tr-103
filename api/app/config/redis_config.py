import os
from typing import Optional

import redis
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class RedisConfig:
    """Redis configuration settings"""

    def __init__(self):
        self.host = os.getenv("REDIS_HOST", "localhost")
        self.port = int(os.getenv("REDIS_PORT", "6379"))
        self.db = int(os.getenv("REDIS_DB", "0"))
        self.decode_responses = True
        self.socket_connect_timeout = 5
        self.socket_timeout = 5

    def get_connection(self) -> redis.Redis:
        """Get Redis connection"""
        return redis.Redis(
            host=self.host,
            port=self.port,
            db=self.db,
            decode_responses=self.decode_responses,
            socket_connect_timeout=self.socket_connect_timeout,
            socket_timeout=self.socket_timeout,
        )


# Global Redis configuration instance
redis_config = RedisConfig()


def get_redis_client() -> Optional[redis.Redis]:
    """Get Redis client with error handling"""
    try:
        client = redis_config.get_connection()
        # Test connection
        client.ping()
        return client
    except (redis.ConnectionError, redis.TimeoutError, Exception):
        # Return None if Redis is unavailable
        return None
