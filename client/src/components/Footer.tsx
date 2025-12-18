import { BarChart3, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Stock Analytics</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional stock market analysis and forecasting platform powered by AI
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-foreground transition-colors">
                  Forecasting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#documentation" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#github"
                className="h-9 w-9 rounded-md border border-border/50 flex items-center justify-center hover:bg-accent hover:border-border transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#email"
                className="h-9 w-9 rounded-md border border-border/50 flex items-center justify-center hover:bg-accent hover:border-border transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Stock Analytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
