import { useRef } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { StockDataRow, ForecastRow } from "@/lib/api";

interface ForecastChartProps {
  stockData: StockDataRow[];
  forecastData: ForecastRow[];
  ticker: string;
}

const chartConfig = {
  close: {
    label: "Close Price",
    color: "#2563eb",
  },
  yhat: {
    label: "Forecast",
    color: "#dc2626",
  },
  yhat_lower: {
    label: "Lower Bound",
    color: "#f59e0b",
  },
  yhat_upper: {
    label: "Upper Bound",
    color: "#f59e0b",
  },
};

export function ForecastChart({ stockData, forecastData, ticker }: ForecastChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Prepare chart data - combine historical and forecast
  const stockChartData = stockData.map((row) => ({
    date: new Date(row.Date).getTime(),
    close: row.Close,
    fullDate: row.Date,
    yhat: null as number | null,
    yhat_lower: null as number | null,
    yhat_upper: null as number | null,
  }));

  const forecastChartData = forecastData.map((row) => ({
    date: new Date(row.ds).getTime(),
    close: null as number | null,
    fullDate: row.ds,
    yhat: row.yhat,
    yhat_lower: row.yhat_lower,
    yhat_upper: row.yhat_upper,
  }));

  // Combine and sort by date
  const combinedData = [...stockChartData, ...forecastChartData].sort(
    (a, b) => a.date - b.date
  );

  const exportChart = async () => {
    if (!chartRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(chartRef.current);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${ticker}_forecast_chart_${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Failed to export chart:", err);
      alert("Failed to export chart. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Forecast Chart</h3>
        <Button onClick={exportChart} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Chart
        </Button>
      </div>
      <div ref={chartRef}>
        <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
          <LineChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px] sm:text-xs"
              tickFormatter={(value) => {
                const date = new Date(value);
                return format(date, "MMM yy");
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px] sm:text-xs"
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={45}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length || !payload[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm text-xs sm:text-sm">
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {data.fullDate ? format(new Date(data.fullDate), "MMM dd, yyyy") : ""}
                        </span>
                      </div>
                      {data.close !== null && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground">Close</span>
                          <span className="font-medium">${data.close.toFixed(2)}</span>
                        </div>
                      )}
                      {data.yhat !== null && (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Forecast</span>
                            <span className="font-medium">${data.yhat.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-[10px] sm:text-xs">Range</span>
                            <span className="font-medium text-[10px] sm:text-xs">
                              ${data.yhat_lower?.toFixed(2)} - ${data.yhat_upper?.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
            />
            {/* Forecast line */}
            <Line
              type="monotone"
              dataKey="yhat"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={true}
            />
            {/* Confidence interval */}
            <Line
              type="monotone"
              dataKey="yhat_upper"
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="yhat_lower"
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={true}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}

