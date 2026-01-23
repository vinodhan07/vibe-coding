import { Globe, Zap, Shield, Heart } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-12">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            About <span className="bg-gradient-primary bg-clip-text text-transparent">Domain Suggester</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We help entrepreneurs and businesses find the perfect domain name for their next big idea.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-card">
                            <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Finding the right domain name can be challenging. We built Domain Suggester to make this process
                                simple and enjoyable. Our intelligent system checks availability in real-time and generates
                                creative alternatives when your first choice is taken.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-muted/30">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose Us</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FeatureCard
                                icon={<Zap className="h-6 w-6" />}
                                title="Instant Results"
                                description="Check domain availability in milliseconds"
                            />
                            <FeatureCard
                                icon={<Globe className="h-6 w-6" />}
                                title="Smart Suggestions"
                                description="Get creative alternatives when domains are taken"
                            />
                            <FeatureCard
                                icon={<Shield className="h-6 w-6" />}
                                title="Secure & Private"
                                description="Your searches are private and encrypted"
                            />
                            <FeatureCard
                                icon={<Heart className="h-6 w-6" />}
                                title="Free to Use"
                                description="No hidden fees, no credit card required"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-elegant transition-shadow">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
);

export default About;
