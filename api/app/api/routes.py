import time
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

import app.services.forecast_service as forecast_service
import app.services.yf_service as yf_service
from app.types.forecast_data import ForecastRow
from app.types.stock_data import StockDataRow

router = APIRouter()


class ForecastRequest(BaseModel):
    stock_data: List[StockDataRow]
    days: Optional[int] = 30


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/stocks")
async def stocks(
    ticker: str = Query(..., description="Ticker symbol"),
    start_date: str = Query(..., description="Start date of data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date of data (YYYY-MM-DD)"),
    interval: Optional[str] = Query("1d", description="Interval"),
) -> List[StockDataRow]:
    start_unix = int(time.mktime(time.strptime(start_date, "%Y-%m-%d")))
    end_unix = int(time.mktime(time.strptime(end_date, "%Y-%m-%d")))

    result = yf_service.download_hist(ticker, start_unix, end_unix, interval)

    if len(result) == 0:
        raise HTTPException(status_code=204, detail="No data found")

    return result


@router.post("/forecast")
async def forecast(request: ForecastRequest) -> List[ForecastRow]:
    if len(request.stock_data) == 0:
        raise HTTPException(status_code=400, detail="Stock data cannot be empty")

    try:
        forecast_result = forecast_service.forecast_stock_data(
            stock_data=request.stock_data, days=request.days or 30
        )
        return forecast_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")
