import { format } from "date-fns";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { StockDataRow } from "@/lib/api";

interface StockChartProps {
  data: StockDataRow[];
}

const chartConfig = {
  close: {
    label: "Close Price",
    color: "#2563eb",
  },
};

export function StockChart({ data }: StockChartProps) {
  const chartData = data.map((row) => ({
    date: new Date(row.Date),
    close: row.Close,
    fullDate: row.Date,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Close</span>
                    <span className="font-medium">${data.close?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

