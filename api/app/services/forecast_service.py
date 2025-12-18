from typing import List

import pandas as pd
from prophet import Prophet

from app.types.forecast_data import ForecastRow
from app.types.stock_data import StockDataRow


def forecast_stock_data(
    stock_data: List[StockDataRow], days: int = 30
) -> List[ForecastRow]:
    stock_data_df = pd.DataFrame([s.model_dump() for s in stock_data])

    # Creating new df with date and price column (Close is the Price and it is y , whereas, x is date)
    # Renaming dataframe columns as per the requirement of Facebook Prophet model
    columns: List[str] = ["Date", "Close"]
    prophet_df = stock_data_df[columns].rename(columns={"Date": "ds", "Close": "y"})

    # Initialize Prophet model
    model = Prophet()
    model.fit(prophet_df)

    # Make future predictions
    future_data_prediction = model.make_future_dataframe(periods=days)
    forecast = model.predict(future_data_prediction)

    # Convert the forecast DataFrame to a list of ForecastRow objects
    forecast_rows = [ForecastRow(**row) for row in forecast.to_dict("records")]

    return forecast_rows
