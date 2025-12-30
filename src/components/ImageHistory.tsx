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
      <div className="flex items-center justify-between px-2">
        <h4 className="text-xs font-display text-neon-cyan uppercase tracking-wider">
          History ({images.length})
        </h4>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-2">
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => onSelect(image)}
              className={cn(
                "group relative shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                selectedId === image.id 
                  ? "border-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)]" 
                  : "border-transparent hover:border-neon-cyan/50"
              )}
            >
              <img 
                src={image.url} 
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neon-cyan hover:text-neon-cyan"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(image);
                  }}
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-neon-cyan hover:text-neon-cyan"
                  onClick={(e) => handleDownload(image, e)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(image.id);
                  }}
                >
                  <X className="h-3 w-3" />
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
