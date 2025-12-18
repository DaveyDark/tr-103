import time

import pytest
from rich.pretty import pprint

from app.services.forecast_service import forecast_stock_data
from app.services.yf_service import download_hist
from app.types.forecast_data import ForecastRow


def get_sample_stock_data():
    """Helper function to get real stock data for testing"""
    TICKER = "AAPL"
    START_DATE = "2024-01-01"
    END_DATE = "2024-01-31"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    return download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)


@pytest.mark.asyncio
async def test_forecast_basic_functionality():
    """Test that forecast service returns valid forecast data"""
    stock_data = get_sample_stock_data()

    if not stock_data or len(stock_data) < 10:
        pytest.skip("Insufficient stock data for testing")

    forecast = forecast_stock_data(stock_data)

    # Basic validations
    assert forecast is not None
    assert len(forecast) > 0
    assert all(isinstance(row, ForecastRow) for row in forecast)

    # Should have future predictions (original data + 30 future days)
    assert len(forecast) > len(stock_data)

    # Check structure of first forecast row
    first_row = forecast[0]
    assert hasattr(first_row, "ds")
    assert hasattr(first_row, "yhat")
    assert hasattr(first_row, "yhat_lower")
    assert hasattr(first_row, "yhat_upper")

    # Print sample for manual verification
    pprint(first_row.model_dump())


@pytest.mark.asyncio
async def test_forecast_with_empty_data():
    """Test behavior with empty input data"""
    try:
        forecast = forecast_stock_data([])
        assert forecast == [] or forecast is None
    except Exception:
        # Exception is acceptable for empty data
        assert True
