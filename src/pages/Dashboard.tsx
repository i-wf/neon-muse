import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NeonGrid } from "@/components/NeonGrid";
import { GeneratedImage } from "@/components/GeneratedImage";
import { EditPanel, type EditOption } from "@/components/EditPanel";
import { ReferenceImageUploader } from "@/components/ReferenceImageUploader";
import { ModelSelector, AI_MODELS, type AIModel } from "@/components/ModelSelector";
import { AspectRatioSelector, ASPECT_RATIOS, type AspectRatio } from "@/components/AspectRatioSelector";
import { ImaginaryLogo } from "@/components/ImaginaryLogo";
import { ImageHistory, type HistoryImage } from "@/components/ImageHistory";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Wand2, Sparkles, Copy, Check, 
  Home, ChevronRight, Settings2, X,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Eye, History, Menu, Palette, Languages, Zap, Ratio
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { t, isArabic, toggleLanguage } = useTranslation();
  
  const [basePrompt, setBasePrompt] = useState("");
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [subjectInfluence, setSubjectInfluence] = useState(0.7);
  const [styleInfluence, setStyleInfluence] = useState(0.5);
  const [activeEdits, setActiveEdits] = useState<EditOption[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isImprovingImage, setIsImprovingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[1]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(!isMobile);
  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);
  const [imageHistory, setImageHistory] = useState<HistoryImage[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImagePrompt, setCurrentImagePrompt] = useState<string>("");

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
      toast.success(t("promptCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("failedToCopy"));
    }
  };

  const handleGenerate = async () => {
    if (!finalPrompt) {
      toast.error(t("enterPrompt"));
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
            styleInfluence: styleInfluence,
            aspectRatio: selectedAspectRatio.ratio,
            width: selectedAspectRatio.width,
            height: selectedAspectRatio.height
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("generationFailed"));
      }

      const data = await response.json();
      const newImage = data.image;
      
      // Set as current image
      setGeneratedImage(newImage);
      setCurrentImagePrompt(finalPrompt);
      
      // Add to history
      const historyItem: HistoryImage = {
        id: crypto.randomUUID(),
        url: newImage,
        prompt: finalPrompt,
        createdAt: new Date(),
      };
      setImageHistory(prev => [historyItem, ...prev]);
      setSelectedHistoryId(historyItem.id);
      
      toast.success(t("imageGenerated"));
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : t("generationFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (image: HistoryImage) => {
    setGeneratedImage(image.url);
    setSelectedHistoryId(image.id);
    setCurrentImagePrompt(image.prompt);
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
    toast.info(t("imageRemoved"));
  };

  const handleClearAll = () => {
    setBasePrompt("");
    setActiveEdits([]);
    setSubjectImage(null);
    setStyleImage(null);
    toast.info(t("clearedSelections"));
  };

  const handleImprovePrompt = async () => {
    if (!basePrompt.trim()) {
      toast.error(t("enterPrompt"));
      return;
    }
    
    setIsImproving(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/improve-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ prompt: basePrompt, type: "improve" }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to improve prompt");
      }

      const data = await response.json();
      setBasePrompt(data.improvedPrompt);
      toast.success(t("promptImproved"));
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to improve prompt");
    } finally {
      setIsImproving(false);
    }
  };

  const handleImproveImage = async () => {
    if (!generatedImage || !currentImagePrompt) {
      return;
    }
    
    setIsImprovingImage(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      // First improve the prompt
      const promptResponse = await fetch(
        `${supabaseUrl}/functions/v1/improve-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ prompt: currentImagePrompt, type: "enhance" }),
        }
      );

      if (!promptResponse.ok) {
        throw new Error("Failed to improve prompt");
      }

      const promptData = await promptResponse.json();
      const improvedPrompt = promptData.improvedPrompt;
      
      toast.info(t("imageImproveStarted"));
      
      // Now generate with improved prompt
      const imageResponse = await fetch(
        `${supabaseUrl}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ 
            prompt: improvedPrompt,
            model: selectedModel.apiModel,
          }),
        }
      );

      if (!imageResponse.ok) {
        const error = await imageResponse.json();
        throw new Error(error.error || t("generationFailed"));
      }

      const imageData = await imageResponse.json();
      const newImage = imageData.image;
      
      setGeneratedImage(newImage);
      setCurrentImagePrompt(improvedPrompt);
      
      const historyItem: HistoryImage = {
        id: crypto.randomUUID(),
        url: newImage,
        prompt: improvedPrompt,
        createdAt: new Date(),
      };
      setImageHistory(prev => [historyItem, ...prev]);
      setSelectedHistoryId(historyItem.id);
      
      toast.success(t("imageGenerated"));
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : t("generationFailed"));
    } finally {
      setIsImprovingImage(false);
    }
  };

  const toggleLeftPanel = () => {
    if (isMobile && rightPanelOpen) {
      setRightPanelOpen(false);
    }
    setLeftPanelOpen(prev => !prev);
  };

  const toggleRightPanel = () => {
    if (isMobile && leftPanelOpen) {
      setLeftPanelOpen(false);
    }
    setRightPanelOpen(prev => !prev);
  };

  const closePanels = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" dir={isArabic ? "rtl" : "ltr"}>
      <NeonGrid />

      {/* Header */}
      <header className="relative z-50 shrink-0 glass border-b border-white/5">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/">
              <ImaginaryLogo size="sm" />
            </Link>
            <ChevronRight className={cn("h-4 w-4 text-muted-foreground hidden sm:block", isArabic && "rotate-180")} />
            <span className="font-body text-muted-foreground hidden sm:block">{t("studio")}</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-primary"
              title={t("language")}
            >
              <Languages className="h-4 w-4" />
              <span className="ml-1 text-xs hidden sm:inline">{isArabic ? "EN" : "عربي"}</span>
            </Button>

            {/* Desktop collapse buttons */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLeftPanel}
              className="text-muted-foreground hover:text-primary hidden md:flex"
              title={leftPanelOpen ? t("hideSettings") : t("showSettings")}
            >
              {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              <span className="ml-1 text-xs hidden lg:inline">{t("settings")}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleRightPanel}
              className="text-muted-foreground hover:text-secondary hidden md:flex"
              title={rightPanelOpen ? t("hideEffects") : t("showEffects")}
            >
              {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              <span className="ml-1 text-xs hidden lg:inline">{t("effects")}</span>
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
          <div className="absolute top-full left-0 right-0 glass-card border-b border-white/5 p-3 z-50">
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
                {leftPanelOpen ? t("hideSettings") : t("showSettings")}
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
                {rightPanelOpen ? t("hideEffects") : t("showEffects")}
              </Button>
              <Link to="/" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-2" />
                  {t("home")}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop for mobile panels - MUST be rendered before panels */}
        {(leftPanelOpen || rightPanelOpen) && isMobile && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            onClick={closePanels}
          />
        )}

        {/* Left Panel - Image Upload & Model Selection */}
        <aside className={cn(
          "glass-card flex flex-col shrink-0 transition-all duration-300 ease-in-out",
          isMobile 
            ? leftPanelOpen 
              ? "fixed inset-y-0 left-0 w-[85vw] max-w-sm z-40 pt-14 rounded-r-2xl" 
              : "fixed -left-full w-0 z-40"
            : leftPanelOpen 
              ? "relative w-72 m-3 rounded-2xl" 
              : "w-0 overflow-hidden m-0"
        )}>
          {/* Panel header with close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 md:hidden">
            <span className="font-display text-sm text-primary">{t("settings")}</span>
            <Button variant="ghost" size="sm" onClick={() => setLeftPanelOpen(false)} className="hover:bg-white/5">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-5 overflow-y-auto flex-1">
            {/* Model Selector */}
            <div className="glass-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm text-primary uppercase tracking-wider">
                  {t("aiModel")}
                </h3>
              </div>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                isOpen={isModelSelectorOpen}
                onToggle={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                compact={isMobile}
                isArabic={isArabic}
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div className="glass-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Ratio className="h-4 w-4 text-secondary" />
                <h3 className="font-display text-sm text-secondary uppercase tracking-wider">
                  {isArabic ? "نسبة الأبعاد" : "Aspect Ratio"}
                </h3>
              </div>
              <AspectRatioSelector
                selectedRatio={selectedAspectRatio}
                onRatioChange={setSelectedAspectRatio}
                isArabic={isArabic}
              />
            </div>

            {/* Subject Reference */}
            <div className="glass-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-secondary" />
                <h3 className="font-display text-sm text-secondary uppercase tracking-wider">
                  {t("subjectReference")}
                </h3>
              </div>
              <ReferenceImageUploader 
                referenceImage={subjectImage}
                onImageUpload={setSubjectImage}
                onImageRemove={() => setSubjectImage(null)}
                influenceStrength={subjectInfluence}
                onInfluenceChange={setSubjectInfluence}
                type="subject"
                title={t("subjectFace")}
                description={t("uploadSubject")}
              />
            </div>

            {/* Style Reference */}
            <div className="glass-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm text-primary uppercase tracking-wider">
                  {t("styleInspiration")}
                </h3>
              </div>
              <ReferenceImageUploader 
                referenceImage={styleImage}
                onImageUpload={setStyleImage}
                onImageRemove={() => setStyleImage(null)}
                influenceStrength={styleInfluence}
                onInfluenceChange={setStyleInfluence}
                type="style"
                title={t("styleReference")}
                description={t("uploadStyle")}
                onStyleExtracted={(stylePrompt) => {
                  setBasePrompt(prev => prev ? `${prev}, ${stylePrompt}` : stylePrompt);
                }}
              />
            </div>

            {/* Active Edits Summary */}
            {activeEdits.length > 0 && (
              <div className="p-4 rounded-xl glass-subtle border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wide">{t("activeEffects")}</span>
                  <button 
                    onClick={handleClearAll}
                    className="text-xs text-destructive hover:underline"
                  >
                    {t("clearAll")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeEdits.slice(0, 6).map((edit) => (
                    <span 
                      key={edit.id}
                      className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium"
                    >
                      {isArabic ? edit.nameAr : edit.name}
                    </span>
                  ))}
                  {activeEdits.length > 6 && (
                    <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs">
                      +{activeEdits.length - 6} {t("more")}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center - Main Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
          {/* Image History Strip */}
          {imageHistory.length > 0 && (
            <div className="glass mx-3 mt-3 rounded-xl shrink-0">
              <div className="flex items-center gap-2 px-4 pt-3">
                <History className="h-4 w-4 text-primary" />
                <span className="text-xs font-display text-primary uppercase tracking-wider">{t("generatedImages")}</span>
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
                isLoading={isGenerating || isImprovingImage}
                prompt={finalPrompt}
                onImproveImage={handleImproveImage}
                isImproving={isImprovingImage}
                t={t}
              />
            </div>
          </div>

          {/* Bottom Prompt Bar */}
          <div className="glass mx-3 mb-3 rounded-xl p-4 shrink-0">
            {/* Final Prompt Preview */}
            {finalPrompt && (
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wide">{t("finalPrompt")}</span>
                  <button 
                    onClick={handleCopyPrompt}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
                <p className="text-xs md:text-sm text-foreground/80 font-body line-clamp-2">
                  {finalPrompt}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Improve Prompt button row */}
              {basePrompt.trim() && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImprovePrompt}
                    disabled={isImproving || isGenerating}
                    className="border-primary/30 text-primary hover:bg-primary/10 gap-1"
                  >
                    <Zap className="h-4 w-4" />
                    {isImproving ? t("improving") : t("improvePrompt")}
                  </Button>
                </div>
              )}
              
              {/* Input and Generate button row */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    value={basePrompt}
                    onChange={(e) => setBasePrompt(e.target.value)}
                    placeholder={t("describeVision")}
                    className="min-h-[50px] md:min-h-[60px] max-h-[100px] md:max-h-[120px] bg-white/5 border-white/10 rounded-xl font-body resize-none pr-8 text-sm md:text-base placeholder:text-muted-foreground/50"
                    dir={isArabic ? "rtl" : "ltr"}
                  />
                  {basePrompt && (
                    <button
                      onClick={() => setBasePrompt("")}
                      className={cn(
                        "absolute top-2 text-muted-foreground hover:text-foreground",
                        isArabic ? "left-2" : "right-2"
                      )}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="default"
                  size={isMobile ? "default" : "lg"}
                  onClick={handleGenerate}
                  disabled={isGenerating || !finalPrompt}
                  className="h-auto px-6 md:px-8 shrink-0 gradient-accent text-white border-0 glow-accent"
                >
                  <Wand2 className="h-4 md:h-5 w-4 md:w-5" />
                  <span className="hidden sm:inline ml-2">
                    {isGenerating ? t("generating") : t("generate")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Edit Options */}
        <aside className={cn(
          "glass-card shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
          isMobile 
            ? rightPanelOpen 
              ? "fixed inset-y-0 right-0 w-[85vw] max-w-sm z-40 pt-14 rounded-l-2xl" 
              : "fixed -right-full w-0 z-40"
            : rightPanelOpen 
              ? "relative w-80 m-3 rounded-2xl" 
              : "w-0 m-0"
        )}>
          {/* Panel header with close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 md:hidden">
            <span className="font-display text-sm text-secondary">{t("effects")}</span>
            <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(false)} className="hover:bg-white/5">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-full p-4 overflow-y-auto">
            <EditPanel 
              activeEdits={activeEdits}
              onEditToggle={handleEditToggle}
              isArabic={isArabic}
            />
          </div>
        </aside>
      </div>

      {/* Mobile floating action buttons */}
      {isMobile && (
        <div className={cn(
          "fixed bottom-24 z-50 flex flex-col gap-3",
          isArabic ? "left-4" : "right-4"
        )}>
          <button
            onClick={toggleLeftPanel}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 glass-card glow-accent",
              leftPanelOpen 
                ? "gradient-accent text-white" 
                : "text-primary"
            )}
          >
            <Settings2 className="h-5 w-5" />
          </button>
          <button
            onClick={toggleRightPanel}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 glass-card glow-blue",
              rightPanelOpen 
                ? "gradient-accent text-white" 
                : "text-secondary"
            )}
          >
            <Palette className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
