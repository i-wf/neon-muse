import { ChevronDown, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  tier: "free" | "pro";
  apiModel: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "nano-banana",
    name: "Nano Banana",
    description: "Fast & free - Great for quick iterations",
    tier: "free",
    apiModel: "google/gemini-2.5-flash-image-preview",
  },
  {
    id: "gemini-pro-image",
    name: "Gemini Pro Image",
    description: "Higher quality - Best for final renders",
    tier: "pro",
    apiModel: "google/gemini-3-pro-image-preview",
  },
];

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ModelSelector({ selectedModel, onModelChange, isOpen, onToggle }: ModelSelectorProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 w-full",
          "bg-card/80 backdrop-blur-sm",
          isOpen 
            ? "border-neon-cyan shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]" 
            : "border-border/50 hover:border-neon-cyan/50"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          selectedModel.tier === "free" 
            ? "bg-neon-cyan/20 text-neon-cyan" 
            : "bg-neon-magenta/20 text-neon-magenta"
        )}>
          {selectedModel.tier === "free" ? <Zap className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
        </div>
        <div className="flex-1 text-left">
          <p className="font-body font-semibold text-foreground">{selectedModel.name}</p>
          <p className="text-xs text-muted-foreground">{selectedModel.description}</p>
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-muted-foreground transition-transform",
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
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  model.tier === "free" 
                    ? "bg-neon-cyan/20 text-neon-cyan" 
                    : "bg-neon-magenta/20 text-neon-magenta"
                )}>
                  {model.tier === "free" ? <Zap className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-body font-semibold text-foreground">{model.name}</p>
                    {model.tier === "pro" && (
                      <span className="px-2 py-0.5 rounded-full bg-neon-magenta/20 text-neon-magenta text-xs font-body">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
                {selectedModel.id === model.id && (
                  <Sparkles className="h-4 w-4 text-neon-cyan" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
