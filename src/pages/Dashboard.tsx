import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NeonGrid } from "@/components/NeonGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { EditPanel, type EditOption } from "@/components/EditPanel";
import { ImageUploader } from "@/components/ImageUploader";
import { 
  Zap, Wand2, Sparkles, Copy, Check, RefreshCw, 
  Upload, X, Home, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [basePrompt, setBasePrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeEdits, setActiveEdits] = useState<EditOption[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build the final prompt from base + active edits
  const buildFinalPrompt = useCallback(() => {
    let prompt = basePrompt.trim();
    
    if (activeEdits.length > 0) {
      const editPrompts = activeEdits.map(e => e.promptAddition).join(", ");
      if (prompt) {
        prompt = `${prompt}, ${editPrompts}`;
      } else {
        prompt = editPrompts;
      }
    }
    
    // Add quality enhancers if we have a prompt
    if (prompt) {
      prompt = `${prompt}, highly detailed, professional quality`;
    }
    
    return prompt;
  }, [basePrompt, activeEdits]);

  const finalPrompt = buildFinalPrompt();

  const handleEditToggle = (edit: EditOption) => {
    setActiveEdits(prev => {
      const exists = prev.find(e => e.id === edit.id);
      if (exists) {
        return prev.filter(e => e.id !== edit.id);
      } else {
        return [...prev, edit];
      }
    });
  };

  const handleCopyPrompt = async () => {
    if (!finalPrompt) return;
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      toast.success("Prompt copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleGenerate = async () => {
    if (!finalPrompt) {
      toast.error("Please enter a prompt or select some edits");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

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
          body: JSON.stringify({ prompt: finalPrompt }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      toast.success("Image generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    setBasePrompt("");
    setActiveEdits([]);
    setUploadedImage(null);
    setGeneratedImage(null);
    toast.info("Cleared all");
  };

  return (
    <div className="min-h-screen relative">
      <NeonGrid />

      {/* Header */}
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
            <span className="font-body text-muted-foreground">Dashboard</span>
          </div>
          
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Prompt Builder */}
          <div className="space-y-6">
            {/* Prompt Input Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-neon-cyan" />
                  <h2 className="font-display text-lg text-neon-cyan uppercase tracking-wider">
                    Your Prompt
                  </h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl opacity-50 blur group-focus-within:opacity-75 transition-opacity" />
                <div className="relative">
                  <Textarea
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    placeholder="Describe your vision... (e.g., 'A majestic dragon flying over a crystal city')"
                    className="min-h-[150px] bg-card border-border/50 rounded-xl text-lg font-body resize-none focus:border-neon-cyan"
                  />
                </div>
              </div>
            </section>

            {/* Image Upload Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Upload className="h-5 w-5 text-neon-magenta" />
                <h2 className="font-display text-lg text-neon-magenta uppercase tracking-wider">
                  Reference Image
                </h2>
              </div>
              <ImageUploader 
                uploadedImage={uploadedImage}
                onImageUpload={setUploadedImage}
                onImageRemove={() => setUploadedImage(null)}
              />
            </section>

            {/* Edit Panel */}
            <EditPanel 
              activeEdits={activeEdits}
              onEditToggle={handleEditToggle}
            />

            {/* Final Prompt Preview */}
            {finalPrompt && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-neon-purple" />
                    <h2 className="font-display text-lg text-neon-purple uppercase tracking-wider">
                      Final Prompt
                    </h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCopyPrompt}
                    className="text-neon-cyan"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-card/50 border border-neon-purple/30">
                  <p className="text-foreground font-body text-sm leading-relaxed">
                    {finalPrompt}
                  </p>
                </div>
              </section>
            )}

            {/* Generate Button */}
            <Button
              variant="neonGradient"
              size="xl"
              onClick={handleGenerate}
              disabled={isGenerating || !finalPrompt}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Generated Image */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="h-5 w-5 text-neon-magenta" />
              <h2 className="font-display text-lg text-neon-magenta uppercase tracking-wider">
                Generated Art
              </h2>
            </div>
            <div className="sticky top-8">
              <GeneratedImage 
                imageUrl={generatedImage}
                isLoading={isGenerating}
                prompt={finalPrompt}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
