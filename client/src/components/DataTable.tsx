import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StockDataRow } from "@/lib/api";

interface DataTableProps {
  data: StockDataRow[];
  title: string;
  description?: string;
  onExport?: () => void;
  showExport?: boolean;
}

export function DataTable({ data, title, description, onExport, showExport = true }: DataTableProps) {
  return (
    <Card className="shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && <CardDescription className="text-base">{description}</CardDescription>}
          </div>
          {showExport && onExport && (
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
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Open</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">High</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Low</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Close</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Adj Close</TableHead>
                <TableHead className="whitespace-nowrap text-xs sm:text-sm">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={`${row.Date}-${index}`}>
                  <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">
                    {format(new Date(row.Date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.Open.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.High.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.Low.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-xs sm:text-sm">${row.Close.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${row.Adj_Close.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{row.Volume.toLocaleString()}</TableCell>
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

