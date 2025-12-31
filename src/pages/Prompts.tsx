import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Wand2, RefreshCw, Zap, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptDisplay } from "@/components/PromptDisplay";
import { GeneratedImage } from "@/components/GeneratedImage";
import { NeonGrid } from "@/components/NeonGrid";
import { generateCreativePrompt } from "@/data/promptTemplates";
import { toast } from "sonner";

const Prompts = () => {
  const [prompt, setPrompt] = useState(() => generateCreativePrompt());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNewPrompt = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrompt(generateCreativePrompt());
      setIsRefreshing(false);
    }, 300);
  }, []);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.image);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <NeonGrid />
      
      {/* Navigation Header */}
      <header className="relative z-20 border-b border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-neon-cyan" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                PROMPTCRAFT
              </span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-body text-muted-foreground">Prompt Generator</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="neonCyan" size="sm">
                <Wand2 className="h-4 w-4" />
                Full Editor
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Scan line effect */}
      <div className="scan-line" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-6">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            <span className="text-sm font-body text-neon-cyan">AI-Powered Prompts</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-glow-cyan">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta bg-clip-text text-transparent">
              PROMPT
            </span>
            <br />
            <span className="text-foreground">GENERATOR</span>
          </h1>
          
          <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto">
            Generate creative prompts for AI image generators and bring them to life instantly
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prompt section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-neon-cyan" />
              <h2 className="font-display text-lg text-neon-cyan uppercase tracking-wider">
                Your Prompt
              </h2>
            </div>
            <PromptDisplay prompt={prompt} />
          </section>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="neonCyan"
              size="lg"
              onClick={handleNewPrompt}
              disabled={isRefreshing || isGenerating}
              className="min-w-[200px]"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              New Prompt
            </Button>
            
            <Button
              variant="neonGradient"
              size="lg"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="min-w-[200px]"
            >
              <Wand2 className="h-5 w-5" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </div>

          {/* Generated image section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="h-5 w-5 text-neon-magenta" />
              <h2 className="font-display text-lg text-neon-magenta uppercase tracking-wider">
                Generated Art
              </h2>
            </div>
            <GeneratedImage 
              imageUrl={imageUrl} 
              isLoading={isGenerating}
              prompt={prompt}
              t={(key) => key === "generating" ? "Generating..." : key === "generate" ? "Generate" : key}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <p className="text-muted-foreground/60 font-body text-sm">
            Create stunning AI art with a single click
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Prompts;
