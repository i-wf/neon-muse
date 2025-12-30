import { useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  uploadedImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
}

export function ImageUploader({ uploadedImage, onImageUpload, onImageRemove }: ImageUploaderProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageUpload(result);
      toast.success("Image uploaded!");
    };
    reader.onerror = () => {
      toast.error("Failed to read image");
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
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
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (uploadedImage) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-border/50">
        <img 
          src={uploadedImage} 
          alt="Uploaded reference" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={onImageRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label
      className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border/50 hover:border-neon-magenta/50 bg-card/30 cursor-pointer transition-all duration-300 group"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-neon-magenta/20 transition-colors">
          <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:text-neon-magenta transition-colors" />
        </div>
        <div className="text-center">
          <p className="font-body text-foreground">Drop an image or click to upload</p>
          <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
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
