import { CheckCircle2, XCircle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface DomainCardProps {
  domain: string;
  isAvailable: boolean;
  onNotifyMe?: () => void;
}

const DomainCard = ({ domain, isAvailable, onNotifyMe }: DomainCardProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(domain);
    toast.success("Domain copied to clipboard!");
  };

  const handleBuyNow = () => {
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${domain}`, "_blank");
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isAvailable ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <h3 className="text-lg font-semibold text-foreground">{domain}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isAvailable ? "Available for registration" : "Already registered"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="hover:bg-secondary transition-colors"
              aria-label="Copy domain"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            {isAvailable ? (
              <Button
                onClick={handleBuyNow}
                className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            ) : (
              <Button
                onClick={onNotifyMe}
                variant="outline"
                className="hover:bg-secondary transition-colors"
              >
                Notify Me
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainCard;
