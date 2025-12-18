import { BarChart3, TrendingUp, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const location = useLocation();
  const isAppPage = location.pathname === "/app";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Stock Analytics
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAppPage ? (
              <Button 
                asChild
                variant="ghost" 
                size="sm"
                className="hidden sm:flex"
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => scrollToSection("technical")}
                  className="hidden md:flex"
                >
                  Technical
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => scrollToSection("features")}
                  className="hidden md:flex"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => scrollToSection("how-it-works")}
                  className="hidden md:flex"
                >
                  How It Works
                </Button>
                <Button 
                  asChild
                  variant="default" 
                  size="sm"
                >
                  <Link to="/app">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Launch App
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

