import { ChevronDown, Sparkles, Zap, Crown, Rocket, Star, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIModel {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  tier: "free" | "pro";
  apiModel: string;
  speed: "fast" | "medium" | "slow";
}

export const AI_MODELS: AIModel[] = [
  {
    id: "nano-banana",
    name: "Nano Banana",
    nameAr: "نانو بانانا",
    description: "Fast & balanced - Great for quick iterations",
    descriptionAr: "سريع ومتوازن - ممتاز للتجارب السريعة",
    tier: "free",
    apiModel: "google/gemini-2.5-flash-image-preview",
    speed: "fast",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    nameAr: "جيميني 3 برو",
    description: "Premium quality - Best image generation",
    descriptionAr: "جودة ممتازة - أفضل توليد للصور",
    tier: "pro",
    apiModel: "google/gemini-3-pro-image-preview",
    speed: "medium",
  },
];

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  isOpen: boolean;
  onToggle: () => void;
  compact?: boolean;
  isArabic?: boolean;
}

const getSpeedIcon = (speed: AIModel["speed"]) => {
  switch (speed) {
    case "fast":
      return <Rocket className="h-3 w-3" />;
    case "medium":
      return <Star className="h-3 w-3" />;
    case "slow":
      return <Crown className="h-3 w-3" />;
  }
};

const getSpeedLabel = (speed: AIModel["speed"], isArabic: boolean) => {
  if (isArabic) {
    switch (speed) {
      case "fast": return "سريع";
      case "medium": return "متوسط";
      case "slow": return "بطيء";
    }
  }
  return speed;
};

export function ModelSelector({ selectedModel, onModelChange, isOpen, onToggle, compact = false, isArabic = false }: ModelSelectorProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-3 rounded-xl border transition-all duration-300 w-full",
          compact ? "px-3 py-2" : "px-4 py-3",
          "bg-card/80 backdrop-blur-sm",
          isOpen 
            ? "border-neon-cyan shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]" 
            : "border-border/50 hover:border-neon-cyan/50"
        )}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className={cn(
          "rounded-lg flex items-center justify-center shrink-0",
          compact ? "w-8 h-8" : "w-10 h-10",
          selectedModel.tier === "free" 
            ? "bg-neon-cyan/20 text-neon-cyan" 
            : "bg-neon-magenta/20 text-neon-magenta"
        )}>
          {selectedModel.tier === "free" ? <Cpu className={cn(compact ? "h-4 w-4" : "h-5 w-5")} /> : <Crown className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />}
        </div>
        <div className="flex-1 text-left min-w-0" style={{ textAlign: isArabic ? "right" : "left" }}>
          <p className={cn("font-body font-semibold text-foreground truncate", compact && "text-sm")}>
            {isArabic ? selectedModel.nameAr : selectedModel.name}
          </p>
          {!compact && (
            <p className="text-xs text-muted-foreground truncate">
              {isArabic ? selectedModel.descriptionAr : selectedModel.description}
            </p>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl opacity-50 blur" />
          <div className="relative bg-card rounded-xl border border-border/50 overflow-hidden">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model);
                  onToggle();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 w-full transition-all duration-200",
                  "hover:bg-muted/50",
                  selectedModel.id === model.id && "bg-muted/30"
                )}
                dir={isArabic ? "rtl" : "ltr"}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  model.tier === "free" 
                    ? "bg-neon-cyan/20 text-neon-cyan" 
                    : "bg-neon-magenta/20 text-neon-magenta"
                )}>
                  {model.tier === "free" ? <Cpu className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
                </div>
                <div className="flex-1 text-left min-w-0" style={{ textAlign: isArabic ? "right" : "left" }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-body font-semibold text-foreground">
                      {isArabic ? model.nameAr : model.name}
                    </p>
                    {model.tier === "pro" && (
                      <span className="px-2 py-0.5 rounded-full bg-neon-magenta/20 text-neon-magenta text-xs font-body shrink-0">
                        PRO
                      </span>
                    )}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-body flex items-center gap-1 shrink-0",
                      model.speed === "fast" ? "bg-green-500/20 text-green-400" :
                      model.speed === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-orange-500/20 text-orange-400"
                    )}>
                      {getSpeedIcon(model.speed)}
                      {getSpeedLabel(model.speed, isArabic)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? model.descriptionAr : model.description}
                  </p>
                </div>
                {selectedModel.id === model.id && (
                  <Sparkles className="h-4 w-4 text-neon-cyan shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
