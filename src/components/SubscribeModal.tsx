import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/api";

interface SubscribeModalProps {
  domain: string;
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal = ({ domain, isOpen, onClose }: SubscribeModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.subscribe, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          domain: domain,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully subscribed! We'll notify you when the domain becomes available.");
        setEmail("");
        onClose();
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
      console.error("Subscribe error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Get Notified
          </DialogTitle>
          <DialogDescription>
            Enter your email to be notified when <strong>{domain}</strong> becomes available.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubscribe} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="bg-card border-border focus:border-primary transition-colors"
          />
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
