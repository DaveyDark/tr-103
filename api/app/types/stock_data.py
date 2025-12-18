import math
from datetime import datetime

from pydantic import BaseModel, field_validator
from pydantic.config import ConfigDict


class StockDataRow(BaseModel):
    Date: datetime
    Open: float
    High: float
    Low: float
    Close: float
    Adj_Close: float
    Volume: int
    model_config = ConfigDict(validate_by_name=False)

    @field_validator("Open", "High", "Low", "Close", "Adj_Close", mode="before")
    @classmethod
    def validate_price_fields(cls, v):
        if v is None or (isinstance(v, float) and math.isnan(v)):
            raise ValueError("Price fields cannot be NaN")
        return float(v)

    @field_validator("Volume", mode="before")
    @classmethod
    def validate_volume(cls, v):
        if v is None or (isinstance(v, float) and math.isnan(v)):
            return 0  # Default volume to 0 if missing
        return int(v)
