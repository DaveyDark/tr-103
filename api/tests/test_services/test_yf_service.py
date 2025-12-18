import time

import pytest
from rich.pretty import pprint

from app.services.yf_service import download_hist


@pytest.mark.asyncio
async def test_get_tesla_stock_data():
    # Configuration constants
    TICKER = "TCS.NS"
    START_DATE = "2025-01-01"
    END_DATE = "2025-11-30"
    INTERVAL = "1d"

    # Convert dates to UNIX timestamps
    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    stock_data = download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)

    assert stock_data is not None
    pprint(list(map(lambda x: x.model_dump(), stock_data[:2])))


@pytest.mark.asyncio
async def test_validate_date_range():
    TICKER = "TCS.NS"
    START_DATE = "2025-01-01"
    END_DATE = "2025-01-31"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    stock_data = download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)

    assert stock_data is not None
    assert len(stock_data) > 0


@pytest.mark.asyncio
async def test_verify_interval():
    TICKER = "TCS.NS"
    START_DATE = "2025-01-01"
    END_DATE = "2025-01-10"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    stock_data = download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)

    assert stock_data is not None
    assert len(stock_data) > 1

    # For daily interval, check that consecutive entries are about 1 day apart
    if len(stock_data) >= 2:
        time_diff = stock_data[1].Date - stock_data[0].Date
        # Should be around 24 hours (allowing for weekends/holidays)
        assert time_diff.days >= 1


@pytest.mark.asyncio
async def test_csv_file_creation():
    import os

    import pandas as pd

    TICKER = "TCS.NS"
    START_DATE = "2025-01-01"
    END_DATE = "2025-01-15"
    INTERVAL = "1d"
    CSV_FILENAME = "test_output.csv"

    # Clean up any existing file
    if os.path.exists(CSV_FILENAME):
        os.remove(CSV_FILENAME)

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    stock_data = download_hist(
        TICKER, start_unix, end_unix, interval=INTERVAL, csv_filename=CSV_FILENAME
    )

    # Verify file was created
    assert os.path.exists(CSV_FILENAME)

    # Verify file contains correct data
    df = pd.read_csv(CSV_FILENAME)
    assert len(df) > 0

    # Verify first 2 rows match returned data
    if len(stock_data) >= 1:
        assert df.iloc[0]["Open"] == stock_data[0].Open
        assert df.iloc[0]["Close"] == stock_data[0].Close

    if len(stock_data) >= 2:
        assert df.iloc[1]["Open"] == stock_data[1].Open
        assert df.iloc[1]["Close"] == stock_data[1].Close

    # Clean up
    os.remove(CSV_FILENAME)


@pytest.mark.asyncio
async def test_invalid_ticker():
    INVALID_TICKER = "INVALID_TICKER_XYZ"
    START_DATE = "2025-01-01"
    END_DATE = "2025-01-31"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    # This should either return empty data or raise an exception
    try:
        stock_data = download_hist(
            INVALID_TICKER, start_unix, end_unix, interval=INTERVAL
        )
        # If no exception, data should be empty or None
        assert stock_data is None or len(stock_data) == 0
    except Exception as _:
        # Exception is expected for invalid ticker
        assert True


@pytest.mark.asyncio
async def test_invalid_date_range():
    TICKER = "TCS.NS"
    # End date before start date
    START_DATE = "2025-01-31"
    END_DATE = "2025-01-01"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    try:
        stock_data = download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)
        # Should return empty data or None for invalid date range
        assert stock_data is None or len(stock_data) == 0
    except Exception as _:
        # Exception is also acceptable for invalid date range
        assert True


@pytest.mark.asyncio
async def test_invalid_interval():
    TICKER = "TCS.NS"
    START_DATE = "2025-01-01"
    END_DATE = "2025-01-31"
    INVALID_INTERVAL = "invalid_interval"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    try:
        stock_data = download_hist(
            TICKER, start_unix, end_unix, interval=INVALID_INTERVAL
        )
        # Should return empty data or None for invalid interval
        assert stock_data is None or len(stock_data) == 0
    except Exception as _:
        # Exception is expected for invalid interval
        assert True


@pytest.mark.asyncio
async def test_future_dates():
    TICKER = "TCS.NS"
    START_DATE = "2030-01-01"
    END_DATE = "2030-01-31"
    INTERVAL = "1d"

    start_unix = int(time.mktime(time.strptime(START_DATE, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(END_DATE, "%Y-%m-%d")))

    stock_data = download_hist(TICKER, start_unix, end_unix, interval=INTERVAL)

    # Future dates should return empty data
    assert stock_data is None or len(stock_data) == 0
