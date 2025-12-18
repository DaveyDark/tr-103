import hashlib
import json
import time
from typing import List, Optional

import pandas as pd
import yfinance as yf

from app.config.redis_config import get_redis_client
from app.types.stock_data import StockDataRow


def _generate_cache_key(
    ticker: str, start_unix: int, end_unix: int, interval: str
) -> str:
    """Generate a cache key for the given parameters"""
    key_data = f"{ticker}:{start_unix}:{end_unix}:{interval}"
    return f"yf_data:{hashlib.md5(key_data.encode()).hexdigest()}"


def _fetch_from_yfinance(
    ticker: str,
    start_unix: int,
    end_unix: int,
    interval: str,
    csv_filename: Optional[str] = None,
) -> List[StockDataRow]:
    """Original yfinance fetching logic"""
    # Convert UNIX timestamps to readable dates
    start = time.strftime("%Y-%m-%d", time.gmtime(start_unix))
    end = time.strftime("%Y-%m-%d", time.gmtime(end_unix))
    print(
        f"Fetching data from yfinance for {ticker} from {start} to {end} (interval={interval})"
    )

    # Fetch data (auto_adjust=False ensures both Close and Adj Close exist)
    data = yf.download(
        ticker,
        start=start,
        end=end,
        interval=interval,
        group_by="ticker",
        auto_adjust=False,
    )

    if data.empty:
        print("Warning: no data returned")
        return []

    # Reset index so 'Date' is a column
    data = data.reset_index()

    # --- Flatten multi-level columns ---
    if isinstance(data.columns, pd.MultiIndex):
        # e.g. ('TSLA', 'Close') → 'Close'
        data.columns = [col[1] if col[1] else col[0] for col in data.columns]

    # Clean whitespace
    data.columns = [col.strip() for col in data.columns]

    # Ensure required columns
    if "Close" not in data.columns:
        # Some versions might label them differently if multiindex not flattened
        possible_close_cols = [c for c in data.columns if "Close" in c]
        if possible_close_cols:
            data.rename(columns={possible_close_cols[0]: "Close"}, inplace=True)
        else:
            raise KeyError(
                f"'Close' column not found in downloaded data. Columns: {list(data.columns)}"
            )

    # Create or fix Adj Close
    if "Adj Close" not in data.columns:
        data["Adj Close"] = data["Close"]
    else:
        data["Adj Close"] = data["Adj Close"].fillna(data["Close"])

    # Reorder columns
    expected_cols = ["Date", "Open", "High", "Low", "Close", "Adj Close", "Volume"]
    available_cols = [col for col in expected_cols if col in data.columns]
    data = data[available_cols]

    # Rename "Adj Close" to match Pydantic model
    data = data.rename(columns={"Adj Close": "Adj_Close"})

    # Convert to list of Pydantic models
    stock_data_rows = []
    for _, row in data.iterrows():
        try:
            stock_row = StockDataRow(**row.to_dict())
            stock_data_rows.append(stock_row)
        except Exception as e:
            print(f"Warning: Skipping row due to validation error: {e}")
            continue

    # Save to CSV only if filename is provided
    if csv_filename is not None:
        # Convert back to DataFrame for CSV export
        df_for_csv = pd.DataFrame([row.model_dump() for row in stock_data_rows])
        df_for_csv = df_for_csv.rename(columns={"Adj_Close": "Adj Close"})
        df_for_csv.to_csv(csv_filename, index=False)
        print(f"Saved to {csv_filename}")

    return stock_data_rows


def download_hist(
    ticker: str,
    start_unix: int,
    end_unix: int,
    interval: Optional[str] = "1d",
    csv_filename: Optional[str] = None,
) -> List[StockDataRow]:
    """
    Download historical stock data with Redis caching
    """
    if interval is None:
        interval = "1d"

    # Try to get Redis client
    redis_client = get_redis_client()

    if redis_client is not None:
        # Generate cache key
        cache_key = _generate_cache_key(ticker, start_unix, end_unix, interval)

        try:
            # Try to get from cache
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print(f"Cache hit for {ticker} from cache")
                data_dicts = json.loads(cached_data)
                stock_data_rows = [StockDataRow(**row) for row in data_dicts]

                # Save to CSV if filename is provided
                if csv_filename is not None:
                    import pandas as pd

                    df_for_csv = pd.DataFrame(
                        [row.model_dump() for row in stock_data_rows]
                    )
                    df_for_csv = df_for_csv.rename(columns={"Adj_Close": "Adj Close"})
                    df_for_csv.to_csv(csv_filename, index=False)
                    print(f"Saved cached data to {csv_filename}")

                return stock_data_rows
        except Exception as e:
            print(f"Cache read error: {e}")

    # Fetch from yfinance
    stock_data_rows = _fetch_from_yfinance(
        ticker, start_unix, end_unix, interval, csv_filename
    )

    # Cache the result if Redis is available and we have data
    if redis_client is not None and stock_data_rows:
        try:
            cache_key = _generate_cache_key(ticker, start_unix, end_unix, interval)
            data_dicts = [row.model_dump() for row in stock_data_rows]
            # Convert datetime objects to ISO strings for JSON serialization
            for row in data_dicts:
                if hasattr(row["Date"], "isoformat"):
                    row["Date"] = row["Date"].isoformat()

            # Cache for 1 hour (3600 seconds)
            redis_client.setex(cache_key, 3600, json.dumps(data_dicts, default=str))
            print(f"Cached data for {ticker}")
        except Exception as e:
            print(f"Cache write error: {e}")

    return stock_data_rows
