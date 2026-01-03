import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, Folder, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
}

interface LibraryImage {
  id: string;
  url: string;
  prompt: string;
  collection_id: string | null;
}

interface LibraryPickerProps {
  onSelect: (imageUrl: string) => void;
  trigger?: React.ReactNode;
}

export function LibraryPicker({ onSelect, trigger }: LibraryPickerProps) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    const [collectionsRes, imagesRes] = await Promise.all([
      supabase.from("collections").select("id, name").order("created_at", { ascending: false }),
      supabase.from("generated_images").select("id, url, prompt, collection_id").order("created_at", { ascending: false })
    ]);
    
    if (collectionsRes.data) setCollections(collectionsRes.data);
    if (imagesRes.data) setImages(imagesRes.data);
  };

  const filteredImages = selectedCollection
    ? images.filter(img => img.collection_id === selectedCollection)
    : images;

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <FolderOpen className="h-3.5 w-3.5 mr-1" />
            From Library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Select from Library
          </DialogTitle>
        </DialogHeader>
        
        {/* Collection Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCollection === null ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSelectedCollection(null)}
          >
            All Images
          </Button>
          {collections.map((collection) => (
            <Button
              key={collection.id}
              variant={selectedCollection === collection.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCollection(collection.id)}
            >
              <Folder className="h-3 w-3 mr-1" />
              {collection.name}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <ScrollArea className="h-[400px]">
          {filteredImages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-12">
              {selectedCollection ? "No images in this collection" : "No images in library yet"}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-1">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleSelect(image.url)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden cursor-pointer",
                    "ring-1 ring-white/10 hover:ring-primary hover:scale-105 transition-all"
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
