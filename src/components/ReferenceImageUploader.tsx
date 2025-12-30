import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, Sparkles, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReferenceImageUploaderProps {
  referenceImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  influenceStrength: number;
  onInfluenceChange: (value: number) => void;
  type: "subject" | "style";
  title: string;
  description: string;
}

export function ReferenceImageUploader({ 
  referenceImage, 
  onImageUpload, 
  onImageRemove,
  influenceStrength,
  onInfluenceChange,
  type,
  title,
  description
}: ReferenceImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

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
        
        {/* Influence Strength Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Influence</span>
            <span className={cn(
              "text-xs font-medium",
              type === "subject" ? "text-neon-magenta" : "text-neon-cyan"
            )}>
              {Math.round(influenceStrength * 100)}%
            </span>
          </div>
          <Slider
            value={[influenceStrength * 100]}
            onValueChange={(value) => onInfluenceChange(value[0] / 100)}
            min={10}
            max={100}
            step={5}
            className={cn(
              type === "subject" ? "[&_[role=slider]]:bg-neon-magenta" : "[&_[role=slider]]:bg-neon-cyan"
            )}
          />
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
