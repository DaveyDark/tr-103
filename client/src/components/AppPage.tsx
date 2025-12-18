import { useState, useRef, useEffect } from "react";
import { format, differenceInMonths, addDays, subDays } from "date-fns";
import { Calendar as CalendarIcon, TrendingUp, Loader2, BarChart3, Table as TableIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStockData, fetchForecast, type StockDataRow, type ForecastRow } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StockChart } from "./StockChart";
import { ForecastChart } from "./ForecastChart";
import { DataTable } from "./DataTable";
import { ForecastTable } from "./ForecastTable";

export function AppPage() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const now = new Date();
    return new Date(now.getFullYear() - 1, 0, 1); // Start of last year
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [interval, setInterval] = useState("1d");
  const [stockData, setStockData] = useState<StockDataRow[]>([]);
  const [forecastData, setForecastData] = useState<ForecastRow[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState(30);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastTimeWindow, setForecastTimeWindow] = useState(30);
  const dataDisplayRef = useRef<HTMLDivElement>(null);

  const handleFetchData = async () => {
    if (!ticker.trim()) {
      setError("Please enter a ticker symbol");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    // Validate date range
    const today = new Date();
    if (endDate > today) {
      setError("End date cannot be in the future");
      return;
    }

    const monthsDifference = differenceInMonths(endDate, startDate);
    if (monthsDifference < 6) {
      setError("Date range must be at least 6 months. Please select a start date that is at least 6 months before the end date.");
      return;
    }

    setLoading(true);
    setError(null);
    setForecastData([]);

    try {
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");
      const data = await fetchStockData(ticker, startDateStr, endDateStr, interval);
      setStockData(data);
    } catch (err) {
      // Check if it's a stock not found error
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stock data";
      if (errorMessage.includes("JSON.parse") || errorMessage.includes("unexpected end of data") || 
          errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setError(`Stock symbol "${ticker}" not found or no data available for the selected date range. Please verify the ticker symbol and try again.`);
      } else {
        setError(errorMessage);
      }
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  // Smooth scroll to data display when stock data is loaded
  useEffect(() => {
    if (stockData.length > 0 && dataDisplayRef.current) {
      setTimeout(() => {
        dataDisplayRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
        });
      }, 100);
    }
  }, [stockData.length]);

  const handleForecast = async () => {
    if (stockData.length === 0) {
      setError("Please fetch stock data first");
      return;
    }

    setForecastLoading(true);
    setError(null);

    try {
      const forecast = await fetchForecast(stockData, forecastPeriod);
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch forecast");
      setForecastData([]);
    } finally {
      setForecastLoading(false);
    }
  };

  // CSV export functions
  const exportStockDataToCSV = () => {
    if (stockData.length === 0) return;

    const headers = ["Date", "Open", "High", "Low", "Close", "Adj Close", "Volume"];
    const rows = stockData.map((row) => [
      format(new Date(row.Date), "yyyy-MM-dd"),
      row.Open.toFixed(2),
      row.High.toFixed(2),
      row.Low.toFixed(2),
      row.Close.toFixed(2),
      row.Adj_Close.toFixed(2),
      row.Volume.toString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${ticker}_stock_data_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportForecastToCSV = () => {
    if (forecastData.length === 0) return;

    const headers = ["Date", "Forecast", "Lower Bound", "Upper Bound"];
    const rows = forecastData.map((row) => [
      format(new Date(row.ds), "yyyy-MM-dd"),
      row.yhat.toFixed(2),
      row.yhat_lower.toFixed(2),
      row.yhat_upper.toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${ticker}_forecast_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show only first 4 rows for stock data table
  const tableRows = stockData.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Stock Analysis Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze historical stock data and generate AI-powered forecasts
            </p>
          </div>

          {/* Input Section */}
          <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Stock Ticker</CardTitle>
              <CardDescription className="text-base">Enter a ticker symbol to fetch historical data and generate forecasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="ticker">Ticker Symbol</Label>
                  <Input
                    id="ticker"
                    placeholder="e.g., AAPL, MSFT, GOOGL"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFetchData();
                      }
                    }}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleFetchData}
                  disabled={loading}
                  size="lg"
                  className="min-w-[120px] w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Fetch Data
                    </>
                  )}
                </Button>
              </div>

              {/* Advanced Options */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced">
                  <AccordionTrigger>Advanced Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Interval</Label>
                        <Select value={interval} onValueChange={setInterval}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1d">Daily</SelectItem>
                            <SelectItem value="1wk">Weekly</SelectItem>
                            <SelectItem value="1mo">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Data Display */}
          {stockData.length > 0 && (
            <div ref={dataDisplayRef}>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="table">
                  <TableIcon className="h-4 w-4 mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="forecast">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Forecast
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-6">
                <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Stock Price Chart</CardTitle>
                    <CardDescription>Historical close price over time for {ticker || 'selected stock'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StockChart data={stockData} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="table" className="space-y-6">
                <DataTable
                  data={tableRows}
                  title="Stock Data"
                  description={`Showing first 4 of ${stockData.length} rows`}
                  onExport={exportStockDataToCSV}
                />
              </TabsContent>

              <TabsContent value="forecast" className="space-y-6">
                <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">AI-Powered Forecast</CardTitle>
                    <CardDescription>
                      Generate price predictions using machine learning models based on historical data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="forecast-period">Forecast Period (days)</Label>
                        <Input
                          id="forecast-period"
                          type="number"
                          min="1"
                          max="365"
                          value={forecastPeriod}
                          onChange={(e) => setForecastPeriod(parseInt(e.target.value) || 30)}
                          className="w-32"
                        />
                        <p className="text-xs text-muted-foreground">
                          Note: Longer forecasts may be less accurate
                        </p>
                      </div>
                      <Button
                        onClick={handleForecast}
                        disabled={forecastLoading}
                        size="lg"
                        className="min-w-[140px] w-full sm:w-auto"
                      >
                        {forecastLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Forecast"
                        )}
                      </Button>
                    </div>

                    {forecastData.length > 0 && (
                      <>
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium">Time Window</h4>
                            <div className="flex rounded-lg border p-1">
                              {[30, 60, 120].map((days) => (
                                <button
                                  key={days}
                                  onClick={() => setForecastTimeWindow(days)}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    forecastTimeWindow === days
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                >
                                  {days}d
                                </button>
                              ))}
                            </div>
                          </div>
                          <ForecastChart
                            stockData={stockData.filter(row => {
                              const rowDate = new Date(row.Date);
                              const cutoffDate = subDays(endDate || new Date(), forecastTimeWindow);
                              return rowDate >= cutoffDate;
                            })}
                            forecastData={forecastData.filter(row => {
                              const rowDate = new Date(row.ds);
                              const cutoffDate = subDays(endDate || new Date(), forecastTimeWindow);
                              return rowDate >= cutoffDate;
                            })}
                            ticker={ticker}
                          />
                        </div>

                        <ForecastTable
                          data={forecastData}
                          ticker={ticker}
                          onExport={exportForecastToCSV}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
