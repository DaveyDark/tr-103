from datetime import datetime

from pydantic import BaseModel


class ForecastRow(BaseModel):
    ds: datetime
    trend: float
    yhat_lower: float
    yhat_upper: float
    trend_lower: float
    trend_upper: float
    additive_terms: float
    additive_terms_lower: float
    additive_terms_upper: float
    weekly: float
    weekly_lower: float
    weekly_upper: float
    multiplicative_terms: float
    multiplicative_terms_lower: float
    multiplicative_terms_upper: float
    yhat: float
