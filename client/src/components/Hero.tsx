import { TrendingUp, BarChart3, Brain, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-400/[0.05]" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
              <Brain className="h-3.5 w-3.5 mr-1.5" />
              TR-103 Project Showcase
            </Badge>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Stock Data Analysis
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Analyze historical stock data and generate AI-powered forecasts with interactive visualizations and comprehensive analytics
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/app">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Yahoo Finance API</h3>
              <p className="text-sm text-muted-foreground text-center">
                Fetch historical stock data using yfinance library
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Prophet Model</h3>
              <p className="text-sm text-muted-foreground text-center">
                Time series forecasting with Facebook Prophet
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Interactive Visualizations</h3>
              <p className="text-sm text-muted-foreground text-center">
                React-based charts with Recharts library
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

