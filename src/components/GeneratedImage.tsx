import { Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
  onImproveImage?: () => void;
  isImproving?: boolean;
  t: (key: string) => string;
}

export function GeneratedImage({ 
  imageUrl, 
  isLoading, 
  prompt, 
  onImproveImage,
  isImproving,
  t 
}: GeneratedImageProps) {
  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-magenta to-neon-purple rounded-xl opacity-50 blur group-hover:opacity-75 transition-opacity duration-300" />
      <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 aspect-square flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-neon-cyan/30" />
              <Loader2 className="h-12 w-12 text-neon-cyan animate-spin" />
            </div>
            <p className="text-muted-foreground font-body text-center animate-pulse">
              {t("generating")}
            </p>
            <p className="text-xs text-muted-foreground/60 text-center max-w-[250px]">
              This may take 10-30 seconds
            </p>
          </div>
        ) : imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
            />
            {/* Top bar with Improve Image button */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/60 to-transparent">
              {onImproveImage && (
                <Button
                  variant="neonCyan"
                  size="sm"
                  onClick={onImproveImage}
                  disabled={isImproving || isLoading}
                  className="gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  {isImproving ? t("improving") : t("improveImage")}
                </Button>
              )}
            </div>
            {/* Bottom bar with download button */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
              <Button
                variant="neonMagenta"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <p className="text-muted-foreground font-body">
              {t("generate")} to create art
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
