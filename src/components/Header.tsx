import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Domain Suggester
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
            <a href="#docs" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              API Docs
            </a>
          </div>

          <Button className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all">
            Try Now
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
