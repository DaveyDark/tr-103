import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ForecastRow } from "@/lib/api";

interface ForecastTableProps {
  data: ForecastRow[];
  ticker: string;
  onExport?: () => void;
}

export function ForecastTable({ data, ticker, onExport }: ForecastTableProps) {
  // Truncate to 5 rows
  const displayData = data.slice(0, 5);

  return (
    <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Forecast Data</CardTitle>
            <CardDescription className="text-base">
              Showing first 5 of {data.length} forecasted data points for {ticker}
            </CardDescription>
          </div>
          {onExport && (
            <Button onClick={onExport} variant="outline" size="sm" className="shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto -mx-2 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Date</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Forecast</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Lower Bound</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Upper Bound</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, index) => (
                <TableRow key={`${row.ds}-${index}`}>
                  <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">
                    {format(new Date(row.ds), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-semibold text-xs sm:text-sm">${row.yhat.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.yhat_lower.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.yhat_upper.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-2 sm:hidden">
          Scroll horizontally to view all columns
        </p>
      </CardContent>
    </Card>
  );
}

