import { Activity, LineChart, Download, Zap, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: Activity,
      title: "Historical Data Fetching",
      description: "Retrieve OHLCV data from Yahoo Finance with configurable date ranges and intervals (daily, weekly, monthly)",
    },
    {
      icon: LineChart,
      title: "Interactive Charts",
      description: "Recharts-powered visualizations with responsive design, tooltips, and zoom capabilities",
    },
    {
      icon: Zap,
      title: "On-Demand Forecasting",
      description: "Generate predictions dynamically using Facebook Prophet trained on fetched historical data",
    },
    {
      icon: Download,
      title: "CSV Export",
      description: "Export both historical data and forecast results to CSV format for external analysis",
    },
    {
      icon: Shield,
      title: "Confidence Intervals",
      description: "Prophet generates upper and lower bounds for uncertainty quantification in predictions",
    },
    {
      icon: Clock,
      title: "Flexible Time Periods",
      description: "Analyze data across custom date ranges and forecast future prices for configurable periods",
    },
  ];

  return (
    <section id="features" className="border-b bg-muted/30 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Core functionality for stock data analysis and time series forecasting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
