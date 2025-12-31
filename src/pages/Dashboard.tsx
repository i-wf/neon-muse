import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NeonGrid } from "@/components/NeonGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { EditPanel, type EditOption } from "@/components/EditPanel";
import { ReferenceImageUploader } from "@/components/ReferenceImageUploader";
import { ModelSelector, AI_MODELS, type AIModel } from "@/components/ModelSelector";
import { ImaginaryLogo } from "@/components/ImaginaryLogo";
import { ImageHistory, type HistoryImage } from "@/components/ImageHistory";
import { 
  Wand2, Sparkles, Copy, Check, 
  Home, ChevronRight, Settings2, X,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Eye, History, Menu, Palette
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [basePrompt, setBasePrompt] = useState("");
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [subjectInfluence, setSubjectInfluence] = useState(0.7);
  const [styleInfluence, setStyleInfluence] = useState(0.5);
  const [activeEdits, setActiveEdits] = useState<EditOption[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(!isMobile);
  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);
  const [imageHistory, setImageHistory] = useState<HistoryImage[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    // Close panels on mobile during generation
    if (isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }

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
            model: selectedModel.apiModel,
            referenceImage: subjectImage,
            styleImage: styleImage,
            subjectInfluence: subjectInfluence,
            styleInfluence: styleInfluence
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await response.json();
      const newImage = data.image;
      
      // Set as current image
      setGeneratedImage(newImage);
      
      // Add to history
      const historyItem: HistoryImage = {
        id: crypto.randomUUID(),
        url: newImage,
        prompt: finalPrompt,
        createdAt: new Date(),
      };
      setImageHistory(prev => [historyItem, ...prev]);
      setSelectedHistoryId(historyItem.id);
      
      toast.success("Image generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (image: HistoryImage) => {
    setGeneratedImage(image.url);
    setSelectedHistoryId(image.id);
  };

  const handleHistoryDelete = (id: string) => {
    setImageHistory(prev => prev.filter(img => img.id !== id));
    if (selectedHistoryId === id) {
      const remaining = imageHistory.filter(img => img.id !== id);
      if (remaining.length > 0) {
        setGeneratedImage(remaining[0].url);
        setSelectedHistoryId(remaining[0].id);
      } else {
        setGeneratedImage(null);
        setSelectedHistoryId(undefined);
      }
    }
    toast.info("Image removed from history");
  };

  const handleClearAll = () => {
    setBasePrompt("");
    setActiveEdits([]);
    setSubjectImage(null);
    setStyleImage(null);
    toast.info("Cleared all selections");
  };

  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
    if (isMobile && !leftPanelOpen) {
      setRightPanelOpen(false);
    }
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
    if (isMobile && !rightPanelOpen) {
      setLeftPanelOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <NeonGrid />

      {/* Header */}
      <header className="relative z-20 border-b border-border/30 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/">
              <ImaginaryLogo size="sm" />
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <span className="font-body text-muted-foreground hidden sm:block">Studio</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            {/* Desktop collapse buttons */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLeftPanel}
              className="text-muted-foreground hover:text-neon-cyan hidden md:flex"
              title={leftPanelOpen ? "Collapse left panel" : "Expand left panel"}
            >
              {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              <span className="ml-1 text-xs hidden lg:inline">Settings</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleRightPanel}
              className="text-muted-foreground hover:text-neon-magenta hidden md:flex"
              title={rightPanelOpen ? "Collapse right panel" : "Expand right panel"}
            >
              {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              <span className="ml-1 text-xs hidden lg:inline">Effects</span>
            </Button>

            <Link to="/" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && isMobile && (
          <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border/30 p-3 z-50">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toggleLeftPanel();
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {leftPanelOpen ? "Hide Settings" : "Show Settings"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toggleRightPanel();
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Palette className="h-4 w-4 mr-2" />
                {rightPanelOpen ? "Hide Effects" : "Show Effects"}
              </Button>
              <Link to="/" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Image Upload & Model Selection */}
        <aside className={cn(
          "border-r border-border/30 bg-card/30 backdrop-blur-sm flex flex-col shrink-0 transition-all duration-300 ease-in-out",
          leftPanelOpen 
            ? "w-full md:w-72 absolute md:relative inset-0 md:inset-auto z-40" 
            : "w-0 overflow-hidden"
        )}>
          {/* Panel header with close button for mobile */}
          <div className="flex items-center justify-between p-3 border-b border-border/30 md:hidden">
            <span className="font-display text-sm text-neon-cyan">Settings</span>
            <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 md:p-4 space-y-4 overflow-y-auto flex-1">
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
                compact={isMobile}
              />
            </div>

            {/* Subject Reference */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-neon-magenta" />
                <h3 className="font-display text-sm text-neon-magenta uppercase tracking-wider">
                  Subject Reference
                </h3>
              </div>
              <ReferenceImageUploader 
                referenceImage={subjectImage}
                onImageUpload={setSubjectImage}
                onImageRemove={() => setSubjectImage(null)}
                influenceStrength={subjectInfluence}
                onInfluenceChange={setSubjectInfluence}
                type="subject"
                title="Subject / Face"
                description="Upload a person or object to include"
              />
            </div>

            {/* Style Reference */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-neon-cyan" />
                <h3 className="font-display text-sm text-neon-cyan uppercase tracking-wider">
                  Style Inspiration
                </h3>
              </div>
              <ReferenceImageUploader 
                referenceImage={styleImage}
                onImageUpload={setStyleImage}
                onImageRemove={() => setStyleImage(null)}
                influenceStrength={styleInfluence}
                onInfluenceChange={setStyleInfluence}
                type="style"
                title="Style Reference"
                description="Upload an image for style inspiration"
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
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Image History Strip */}
          {imageHistory.length > 0 && (
            <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2 px-3 md:px-4 pt-2">
                <History className="h-4 w-4 text-neon-cyan" />
                <span className="text-xs font-display text-neon-cyan uppercase tracking-wider">Generated Images</span>
              </div>
              <ImageHistory 
                images={imageHistory}
                onSelect={handleHistorySelect}
                onDelete={handleHistoryDelete}
                selectedId={selectedHistoryId}
              />
            </div>
          )}

          {/* Image Display Area */}
          <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-hidden">
            <div className="w-full max-w-2xl aspect-square">
              <GeneratedImage 
                imageUrl={generatedImage}
                isLoading={isGenerating}
                prompt={finalPrompt}
              />
            </div>
          </div>

          {/* Bottom Prompt Bar */}
          <div className="border-t border-border/30 bg-card/50 backdrop-blur-sm p-3 md:p-4 shrink-0">
            {/* Final Prompt Preview */}
            {finalPrompt && (
              <div className="mb-3 p-2 md:p-3 rounded-lg bg-muted/30 border border-border/30">
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
                <p className="text-xs md:text-sm text-foreground/80 font-body line-clamp-2">
                  {finalPrompt}
                </p>
              </div>
            )}

            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="min-h-[50px] md:min-h-[60px] max-h-[100px] md:max-h-[120px] bg-muted/50 border-border/50 rounded-xl font-body resize-none pr-8 text-sm md:text-base"
                />
                {basePrompt && (
                  <button
                    onClick={() => setBasePrompt("")}
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="neonGradient"
                size={isMobile ? "default" : "lg"}
                onClick={handleGenerate}
                disabled={isGenerating || !finalPrompt}
                className="h-auto px-4 md:px-8 shrink-0"
              >
                <Wand2 className="h-4 md:h-5 w-4 md:w-5" />
                <span className="hidden sm:inline ml-2">
                  {isGenerating ? "Generating..." : "Generate"}
                </span>
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel - Edit Options */}
        <aside className={cn(
          "border-l border-border/30 bg-card/30 backdrop-blur-sm shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
          rightPanelOpen 
            ? "w-full md:w-80 absolute md:relative inset-0 md:inset-auto z-40" 
            : "w-0"
        )}>
          {/* Panel header with close button for mobile */}
          <div className="flex items-center justify-between p-3 border-b border-border/30 md:hidden">
            <span className="font-display text-sm text-neon-magenta">Effects</span>
            <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-full p-3 md:p-4 overflow-y-auto">
            <EditPanel 
              activeEdits={activeEdits}
              onEditToggle={handleEditToggle}
            />
          </div>
        </aside>
      </div>

      {/* Mobile floating action buttons */}
      <div className="fixed bottom-24 right-3 z-30 md:hidden flex flex-col gap-2">
        <button
          onClick={toggleLeftPanel}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            leftPanelOpen 
              ? "bg-neon-cyan text-background" 
              : "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan"
          )}
        >
          <Settings2 className="h-5 w-5" />
        </button>
        <button
          onClick={toggleRightPanel}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            rightPanelOpen 
              ? "bg-neon-magenta text-background" 
              : "bg-neon-magenta/20 border border-neon-magenta/50 text-neon-magenta"
          )}
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>

      {/* Backdrop for mobile panels */}
      {(leftPanelOpen || rightPanelOpen) && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => {
            setLeftPanelOpen(false);
            setRightPanelOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
