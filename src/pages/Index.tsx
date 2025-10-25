import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import DomainCard from "@/components/DomainCard";
import SubscribeModal from "@/components/SubscribeModal";
import RecentSearches from "@/components/RecentSearches";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/api";

interface DomainResult {
  domain: string;
  available: boolean;
}

interface CheckResponse {
  input: string;
  is_domain: boolean;
  main_result?: {
    domain: string;
    available: boolean;
  };
  suggestions?: DomainResult[];
  error?: string;
}

const RECENT_SEARCHES_KEY = "domain-suggester-recent-searches";
const MAX_RECENT_SEARCHES = 5;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainResult, setMainResult] = useState<DomainResult | null>(null);
  const [suggestions, setSuggestions] = useState<DomainResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [subscribeModal, setSubscribeModal] = useState<{
    isOpen: boolean;
    domain: string;
  }>({ isOpen: false, domain: "" });

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  const saveToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setMainResult(null);
    setSuggestions([]);

    try {
      const response = await fetch(API_ENDPOINTS.check, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: query }),
      });

      const data: CheckResponse = await response.json();

      if (response.ok) {
        saveToRecentSearches(query);

        if (data.main_result) {
          setMainResult(data.main_result);
          
          if (data.main_result.available) {
            toast.success(`🎉 ${data.main_result.domain} is available!`);
          } else {
            toast.error(`❌ ${data.main_result.domain} is already taken`);
          }
        }

        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      } else {
        toast.error(data.error || "Failed to check domain availability");
      }
    } catch (error) {
      toast.error("Network error. Please check if the backend is running.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotifyMe = (domain: string) => {
    setSubscribeModal({ isOpen: true, domain });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Smart Domain Finder</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground animate-fade-in">
              Find your perfect domain
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                instantly 🚀
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              Check domain availability and get intelligent suggestions for your next big idea
            </p>

            <div className="animate-fade-in">
              <SearchBox onSearch={handleSearch} isLoading={isLoading} />
              <RecentSearches
                searches={recentSearches}
                onSelectSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(mainResult || suggestions.length > 0) && (
          <section className="container mx-auto px-4 mt-12">
            {mainResult && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Result</h2>
                <DomainCard
                  domain={mainResult.domain}
                  isAvailable={mainResult.available}
                  onNotifyMe={() => handleNotifyMe(mainResult.domain)}
                />
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  {mainResult?.available ? "More Options" : "Available Alternatives"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <DomainCard
                      key={`${suggestion.domain}-${index}`}
                      domain={suggestion.domain}
                      isAvailable={suggestion.available}
                      onNotifyMe={() => handleNotifyMe(suggestion.domain)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />

      <SubscribeModal
        domain={subscribeModal.domain}
        isOpen={subscribeModal.isOpen}
        onClose={() => setSubscribeModal({ isOpen: false, domain: "" })}
      />
    </div>
  );
};

export default Index;
