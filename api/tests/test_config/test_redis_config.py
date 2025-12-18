from unittest.mock import MagicMock, patch

import pytest

from app.config.redis_config import RedisConfig, get_redis_client


def test_redis_config_default_values():
    """Test RedisConfig uses default values when env vars not set"""
    config = RedisConfig()
    assert config.host == "localhost"
    assert config.port == 6379
    assert config.db == 0
    assert config.decode_responses is True


@patch.dict(
    "os.environ", {"REDIS_HOST": "testhost", "REDIS_PORT": "1234", "REDIS_DB": "5"}
)
def test_redis_config_from_env():
    """Test RedisConfig reads from environment variables"""
    config = RedisConfig()
    assert config.host == "testhost"
    assert config.port == 1234
    assert config.db == 5


@patch("app.config.redis_config.redis.Redis")
def test_get_redis_client_success(mock_redis):
    """Test successful Redis client creation"""
    mock_client = MagicMock()
    mock_redis.return_value = mock_client
    mock_client.ping.return_value = True

    client = get_redis_client()

    assert client is not None
    mock_client.ping.assert_called_once()


@patch("app.config.redis_config.redis.Redis")
def test_get_redis_client_connection_error(mock_redis):
    """Test Redis client returns None when connection fails"""
    mock_client = MagicMock()
    mock_redis.return_value = mock_client
    mock_client.ping.side_effect = Exception("Connection failed")

    client = get_redis_client()

    assert client is None
