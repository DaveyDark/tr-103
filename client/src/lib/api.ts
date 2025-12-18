// API service for stock data and forecasts

// Load config from /config.json endpoint
let configPromise: Promise<string> | null = null;

const getApiUrl = async (): Promise<string> => {
  if (typeof window === "undefined") {
    return "http://localhost:8000";
  }

  if (!configPromise) {
    configPromise = fetch("/config.json")
      .then((res) => res.json())
      .then((config: { apiUrl?: string }) => {
        return config.apiUrl || "http://localhost:8000";
      })
      .catch((error) => {
        console.warn("Failed to load config.json, using default API URL:", error);
        return "http://localhost:8000";
      });
  }

  return configPromise;
};

export interface StockDataRow {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Adj_Close: number;
  Volume: number;
}

export interface ForecastRow {
  ds: string;
  trend: number;
  yhat_lower: number;
  yhat_upper: number;
  trend_lower: number;
  trend_upper: number;
  additive_terms: number;
  additive_terms_lower: number;
  additive_terms_upper: number;
  weekly: number;
  weekly_lower: number;
  weekly_upper: number;
  multiplicative_terms: number;
  multiplicative_terms_lower: number;
  multiplicative_terms_upper: number;
  yhat: number;
}

export interface ForecastRequest {
  stock_data: StockDataRow[];
  days?: number;
}

export async function fetchStockData(
  ticker: string,
  startDate: string,
  endDate: string,
  interval: string = "1d"
): Promise<StockDataRow[]> {
  const apiUrl = await getApiUrl();
  const params = new URLSearchParams({
    ticker,
    start_date: startDate,
    end_date: endDate,
    interval,
  });

  const response = await fetch(`${apiUrl}/api/stocks?${params}`);

  if (!response.ok) {
    if (response.status === 204) {
      throw new Error("No data found for the given parameters");
    }
    throw new Error(`Failed to fetch stock data: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchForecast(
  stockData: StockDataRow[],
  days: number = 30
): Promise<ForecastRow[]> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/forecast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stock_data: stockData,
      days,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast: ${response.statusText}`);
  }

  return response.json();
}

