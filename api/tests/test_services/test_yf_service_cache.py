from unittest.mock import MagicMock, patch

from app.services.yf_service import _generate_cache_key


def test_generate_cache_key_consistency():
    """Test cache key is consistent for same params"""
    key1 = _generate_cache_key("AAPL", 1640995200, 1672531200, "1d")
    key2 = _generate_cache_key("AAPL", 1640995200, 1672531200, "1d")

    assert key1 == key2
    assert key1.startswith("yf_data:")


@patch("app.services.yf_service.get_redis_client")
@patch("app.services.yf_service._fetch_from_yfinance")
def test_download_hist_no_redis(mock_fetch, mock_redis_client):
    """Test fallback when Redis unavailable"""
    from app.services.yf_service import download_hist

    mock_redis_client.return_value = None
    mock_fetch.return_value = []

    result = download_hist("AAPL", 1640995200, 1672531200, "1d")

    assert result == []
    mock_fetch.assert_called_once()


@patch("app.services.yf_service.get_redis_client")
@patch("app.services.yf_service._fetch_from_yfinance")
def test_download_hist_cache_miss(mock_fetch, mock_redis_client):
    """Test behavior on cache miss"""
    from app.services.yf_service import download_hist

    mock_client = MagicMock()
    mock_redis_client.return_value = mock_client
    mock_client.get.return_value = None
    mock_fetch.return_value = []

    result = download_hist("AAPL", 1640995200, 1672531200, "1d")

    assert result == []
    mock_client.get.assert_called_once()
    mock_fetch.assert_called_once()
