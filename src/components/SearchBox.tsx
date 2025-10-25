import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SearchBoxProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
}

const SearchBox = ({ onSearch, isLoading }: SearchBoxProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a domain or brand name");
      return;
    }

    await onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Enter domain or brand name (e.g., socialeagle.com or SocialEagle)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="pl-12 pr-4 h-14 text-lg bg-card shadow-card border-border focus:shadow-elegant focus:border-primary transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 px-8 bg-gradient-primary shadow-elegant hover:shadow-glow transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
