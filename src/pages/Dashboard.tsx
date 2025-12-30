import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NeonGrid } from "@/components/NeonGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { EditPanel, type EditOption } from "@/components/EditPanel";
import { ImageUploader } from "@/components/ImageUploader";
import { ModelSelector, AI_MODELS, type AIModel } from "@/components/ModelSelector";
import { 
  Zap, Wand2, Sparkles, Copy, Check, 
  Home, ChevronRight, Settings2, X,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [basePrompt, setBasePrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeEdits, setActiveEdits] = useState<EditOption[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

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
      toast.error("Please enter a prompt or select some effects");
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
          body: JSON.stringify({ 
            prompt: finalPrompt,
            model: selectedModel.apiModel
          }),
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
    toast.info("Cleared all selections");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <NeonGrid />

      {/* Header */}
      <header className="relative z-20 border-b border-border/30 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-neon-cyan" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                PROMPTCRAFT
              </span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-body text-muted-foreground">Studio</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="text-muted-foreground"
            >
              {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Image Upload & Model Selection */}
        <aside className={cn(
          "border-r border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 flex flex-col shrink-0",
          leftPanelOpen ? "w-72" : "w-0 overflow-hidden"
        )}>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Model Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="h-4 w-4 text-neon-cyan" />
                <h3 className="font-display text-sm text-neon-cyan uppercase tracking-wider">
                  AI Model
                </h3>
              </div>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                isOpen={isModelSelectorOpen}
                onToggle={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
              />
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-neon-magenta" />
                <h3 className="font-display text-sm text-neon-magenta uppercase tracking-wider">
                  Reference
                </h3>
              </div>
              <ImageUploader 
                uploadedImage={uploadedImage}
                onImageUpload={setUploadedImage}
                onImageRemove={() => setUploadedImage(null)}
              />
            </div>

            {/* Active Edits Summary */}
            {activeEdits.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-body">Active Effects</span>
                  <button 
                    onClick={handleClearAll}
                    className="text-xs text-destructive hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeEdits.slice(0, 6).map((edit) => (
                    <span 
                      key={edit.id}
                      className="px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan text-xs"
                    >
                      {edit.name}
                    </span>
                  ))}
                  {activeEdits.length > 6 && (
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                      +{activeEdits.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center - Main Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Image Display Area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div className="w-full max-w-2xl aspect-square">
              <GeneratedImage 
                imageUrl={generatedImage}
                isLoading={isGenerating}
                prompt={finalPrompt}
              />
            </div>
          </div>

          {/* Bottom Prompt Bar */}
          <div className="border-t border-border/30 bg-card/50 backdrop-blur-sm p-4 shrink-0">
            {/* Final Prompt Preview */}
            {finalPrompt && (
              <div className="mb-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-body">Final Prompt</span>
                  <button 
                    onClick={handleCopyPrompt}
                    className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm text-foreground/80 font-body line-clamp-2">
                  {finalPrompt}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                  placeholder="Describe your vision... (e.g., 'A majestic dragon flying over a crystal city at sunset')"
                  className="min-h-[60px] max-h-[120px] bg-muted/50 border-border/50 rounded-xl font-body resize-none pr-10"
                />
                {basePrompt && (
                  <button
                    onClick={() => setBasePrompt("")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="neonGradient"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !finalPrompt}
                className="h-auto px-8"
              >
                <Wand2 className="h-5 w-5" />
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel - Edit Options */}
        <aside className={cn(
          "border-l border-border/30 bg-card/30 backdrop-blur-sm transition-all duration-300 shrink-0 overflow-hidden",
          rightPanelOpen ? "w-80" : "w-0"
        )}>
          <div className="h-full p-4">
            <EditPanel 
              activeEdits={activeEdits}
              onEditToggle={handleEditToggle}
            />
          </div>
        </aside>
      </div>

      {/* Mobile Toggle for Right Panel */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="fixed bottom-24 right-4 z-30 lg:hidden w-12 h-12 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center text-neon-cyan"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Dashboard;
