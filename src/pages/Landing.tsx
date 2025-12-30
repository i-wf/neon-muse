import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NeonGrid } from "@/components/NeonGrid";
import { ImaginaryLogo } from "@/components/ImaginaryLogo";
import { Sparkles, Wand2, Image, Layers, ArrowRight, History } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen relative">
      <NeonGrid />
      
      {/* Navigation */}
      <nav className="relative z-20 border-b border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <ImaginaryLogo size="md" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button variant="ghost" className="text-foreground hover:text-neon-cyan">
                Log In
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="neonGradient">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-8">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            <span className="text-sm font-body text-neon-cyan">AI-Powered Image Generation</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Create Stunning</span>
            <br />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta bg-clip-text text-transparent">
              AI Artwork
            </span>
          </h1>
          
          <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Transform your ideas into breathtaking visuals. Upload images, apply stunning edits, 
            and let AI generate masterpieces with intelligent prompt crafting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="neonGradient" size="xl" className="w-full sm:w-auto">
                <Wand2 className="h-5 w-5" />
                Start Creating
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/prompts">
              <Button variant="neonCyan" size="lg" className="w-full sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Try Prompt Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Image className="h-8 w-8" />}
            title="Image Upload"
            description="Upload your photos and transform them with AI-powered editing tools"
            color="cyan"
          />
          <FeatureCard
            icon={<Layers className="h-8 w-8" />}
            title="Smart Edits"
            description="Apply filters, styles, and effects that automatically enhance your prompts"
            color="magenta"
          />
          <FeatureCard
            icon={<Wand2 className="h-8 w-8" />}
            title="AI Generation"
            description="Generate stunning artwork from your customized prompts instantly"
            color="purple"
          />
          <FeatureCard
            icon={<History className="h-8 w-8" />}
            title="Image History"
            description="Keep track of all your generated images and revisit your creations"
            color="cyan"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground/60 font-body text-sm">
            © 2024 Imaginary. Create stunning AI art with a single click.
          </p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: "cyan" | "magenta" | "purple";
}) {
  const colorClasses = {
    cyan: "border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan",
    magenta: "border-neon-magenta/30 hover:border-neon-magenta/60 text-neon-magenta",
    purple: "border-neon-purple/30 hover:border-neon-purple/60 text-neon-purple",
  };

  return (
    <div className={`group relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 ${colorClasses[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground font-body text-sm">{description}</p>
    </div>
  );
}

export default Landing;
