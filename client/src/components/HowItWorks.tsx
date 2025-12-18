import { Search, LineChart, Brain, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Enter Stock Symbol",
      description: "Search for any stock ticker symbol from global markets and select your preferred time range",
    },
    {
      icon: LineChart,
      number: "02",
      title: "View Analytics",
      description: "Explore interactive charts and comprehensive data tables with historical price information",
    },
    {
      icon: Brain,
      number: "03",
      title: "Generate Forecast",
      description: "Use AI-powered machine learning models to predict future price movements with confidence intervals",
    },
    {
      icon: Download,
      number: "04",
      title: "Export Results",
      description: "Download your analysis and forecasts in CSV format for further processing and reporting",
    },
  ];

  return (
    <section id="how-it-works" className="border-b bg-muted/30 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with stock analysis in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-border/50 hover:border-border transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-5xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
