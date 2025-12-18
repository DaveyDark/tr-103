import { Database, TrendingUp, Code, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Stats() {
  const technical = [
    {
      icon: Database,
      title: "Yahoo Finance API",
      description: "Fetches real-time and historical stock market data using yfinance Python library. Provides OHLCV data (Open, High, Low, Close, Volume) with adjustable time intervals.",
    },
    {
      icon: TrendingUp,
      title: "Facebook Prophet",
      description: "Time series forecasting model developed by Meta. Uses additive regression with trend, seasonality, and holiday components to generate predictions with confidence intervals.",
    },
    {
      icon: Code,
      title: "React + TypeScript",
      description: "Modern frontend built with React 19 and TypeScript for type-safe development. Uses Recharts for interactive data visualizations and shadcn/ui for consistent design.",
    },
    {
      icon: Cpu,
      title: "Machine Learning Pipeline",
      description: "Automated workflow that processes historical data, trains Prophet models on-demand, and generates forecasts with upper and lower bounds for uncertainty quantification.",
    },
  ];

  return (
    <section id="technical" className="border-b bg-background scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Technical Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with industry-standard tools for data analysis and machine learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {technical.map((item, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
