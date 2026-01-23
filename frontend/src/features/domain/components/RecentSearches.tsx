import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentSearchesProps {
  searches: string[];
  onSelectSearch: (search: string) => void;
}

const RecentSearches = ({ searches, onSelectSearch }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <Button
            key={`${search}-${index}`}
            variant="outline"
            size="sm"
            onClick={() => onSelectSearch(search)}
            className="bg-card hover:bg-secondary transition-colors"
          >
            {search}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
