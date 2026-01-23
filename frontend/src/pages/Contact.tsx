import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success("Message sent! We'll get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-12">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you.
                        </p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
                                <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                                        <Input
                                            type="text"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={isLoading}
                                            className="h-12 bg-background"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            className="h-12 bg-background"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                                        <Textarea
                                            placeholder="How can we help you?"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            disabled={isLoading}
                                            rows={5}
                                            className="bg-background resize-none"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-gradient-primary shadow-elegant hover:shadow-glow transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h2>
                                    <p className="text-muted-foreground">
                                        We're here to help and answer any question you might have.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <ContactItem
                                        icon={<Mail className="h-5 w-5" />}
                                        title="Email"
                                        value="noreplay@vibe.com"
                                    />
                                    <ContactItem
                                        icon={<Phone className="h-5 w-5" />}
                                        title="Phone"
                                        value="+91 95xxxxxx01"
                                    />
                                    <ContactItem
                                        icon={<MapPin className="h-5 w-5" />}
                                        title="Location"
                                        value="Tamil Nadu, India"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const ContactItem = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-foreground font-medium">{value}</p>
        </div>
    </div>
);

export default Contact;
