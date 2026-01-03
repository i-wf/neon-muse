import { useCallback, useState } from "react";
import { X, Sparkles, Eye, Wand2, Loader2, User, PersonStanding, Mountain, Frame, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export type ElementSelection = "face" | "body" | "scene" | "background" | "style";

interface ReferenceImageUploaderProps {
  referenceImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  selectedElements: ElementSelection[];
  onElementsChange: (elements: ElementSelection[]) => void;
  type: "subject" | "style";
  title: string;
  description: string;
  onStyleExtracted?: (stylePrompt: string) => void;
}

const ELEMENT_OPTIONS: { id: ElementSelection; label: string; icon: React.ReactNode }[] = [
  { id: "face", label: "Face", icon: <User className="h-3 w-3" /> },
  { id: "body", label: "Body", icon: <PersonStanding className="h-3 w-3" /> },
  { id: "scene", label: "Scene", icon: <Mountain className="h-3 w-3" /> },
  { id: "background", label: "Background", icon: <Frame className="h-3 w-3" /> },
  { id: "style", label: "Style", icon: <Palette className="h-3 w-3" /> },
];

export function ReferenceImageUploader({ 
  referenceImage, 
  onImageUpload, 
  onImageRemove,
  selectedElements,
  onElementsChange,
  type,
  title,
  description,
  onStyleExtracted
}: ReferenceImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractStyle = async () => {
    if (!referenceImage || !onStyleExtracted) return;
    
    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-style', {
        body: { imageUrl: referenceImage }
      });

      if (error) throw error;
      
      if (data?.stylePrompt) {
        onStyleExtracted(data.stylePrompt);
        toast.success("Description extracted! Prompt updated.");
      } else {
        throw new Error("No description returned");
      }
    } catch (error) {
      console.error("Description extraction error:", error);
      toast.error("Failed to extract description");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageUpload(result);
      toast.success(`${title} uploaded!`);
    };
    reader.onerror = () => {
      toast.error("Failed to read image");
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageUpload(result);
      toast.success(`${title} uploaded!`);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, title]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const accentColor = type === "subject" ? "neon-magenta" : "neon-cyan";

  if (referenceImage) {
    return (
      <div className="space-y-3">
        <div className="relative group rounded-xl overflow-hidden border border-border/50">
          <img 
            src={referenceImage} 
            alt={title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {type === "style" && onStyleExtracted && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExtractStyle}
                disabled={isExtracting}
                className="glass-subtle"
              >
                {isExtracting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-1" />
                )}
                Describe
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
          <div className={cn(
            "absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium",
            type === "subject" ? "bg-neon-magenta/80 text-white" : "bg-neon-cyan/80 text-black"
          )}>
            {title}
          </div>
        </div>
        
        {/* Element Selection Buttons */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Take from this image:</span>
          <div className="flex flex-wrap gap-1.5">
            {ELEMENT_OPTIONS.map((element) => {
              const isSelected = selectedElements.includes(element.id);
              return (
                <button
                  key={element.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onElementsChange(selectedElements.filter(e => e !== element.id));
                    } else {
                      onElementsChange([...selectedElements, element.id]);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                    isSelected
                      ? type === "subject" 
                        ? "bg-neon-magenta text-white" 
                        : "bg-neon-cyan text-black"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {element.icon}
                  {element.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed bg-card/30 cursor-pointer transition-all duration-300 group",
        isDragging 
          ? `border-${accentColor}/70 bg-${accentColor}/10` 
          : `border-border/50 hover:border-${accentColor}/50`
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center gap-2 p-4">
        <div className={cn(
          "w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-colors",
          `group-hover:bg-${accentColor}/20`
        )}>
          {type === "subject" ? (
            <Sparkles className={cn("h-5 w-5 text-muted-foreground transition-colors", `group-hover:text-${accentColor}`)} />
          ) : (
            <Eye className={cn("h-5 w-5 text-muted-foreground transition-colors", `group-hover:text-${accentColor}`)} />
          )}
        </div>
        <div className="text-center">
          <p className="font-body text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        className="hidden" 
      />
    </label>
  );
}
