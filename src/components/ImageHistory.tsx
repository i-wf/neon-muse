import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

interface ImageHistoryProps {
  images: HistoryImage[];
  onSelect: (image: HistoryImage) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function ImageHistory({ images, onSelect, onDelete, selectedId }: ImageHistoryProps) {
  if (images.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No images generated yet. Start creating!
      </div>
    );
  }

  const handleDownload = async (image: HistoryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `imaginary-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-xs font-display text-primary uppercase tracking-wider">
          History ({images.length})
        </h4>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 p-3">
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => onSelect(image)}
              className={cn(
                "group relative shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
                selectedId === image.id 
                  ? "ring-2 ring-primary glow-purple scale-105" 
                  : "ring-1 ring-white/10 hover:ring-primary/50 hover:scale-105"
              )}
            >
              <img 
                src={image.url} 
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(image);
                  }}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-secondary hover:text-secondary hover:bg-secondary/20"
                  onClick={(e) => handleDownload(image, e)}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
