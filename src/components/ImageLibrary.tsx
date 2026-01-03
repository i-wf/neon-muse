import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, Folder, Image as ImageIcon, X, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface LibraryImage {
  id: string;
  url: string;
  prompt: string;
  model: string | null;
  collection_id: string | null;
  created_at: string;
}

interface ImageLibraryProps {
  onSelectImage?: (imageUrl: string) => void;
  selectionMode?: boolean;
}

export function ImageLibrary({ onSelectImage, selectionMode = false }: ImageLibraryProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
    fetchImages();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching collections:", error);
      return;
    }
    setCollections(data || []);
  };

  const fetchImages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("generated_images")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching images:", error);
      setIsLoading(false);
      return;
    }
    setImages(data || []);
    setIsLoading(false);
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setIsCreatingCollection(true);
    const { data, error } = await supabase
      .from("collections")
      .insert({ name: newCollectionName.trim() })
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to create collection");
      setIsCreatingCollection(false);
      return;
    }
    
    setCollections([data, ...collections]);
    setNewCollectionName("");
    setIsCreatingCollection(false);
    toast.success("Collection created!");
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete collection");
      return;
    }
    setCollections(collections.filter(c => c.id !== id));
    if (selectedCollection === id) setSelectedCollection(null);
    toast.success("Collection deleted");
  };

  const addImageToCollection = async (imageId: string, collectionId: string | null) => {
    const { error } = await supabase
      .from("generated_images")
      .update({ collection_id: collectionId })
      .eq("id", imageId);
    
    if (error) {
      toast.error("Failed to update image");
      return;
    }
    
    setImages(images.map(img => 
      img.id === imageId ? { ...img, collection_id: collectionId } : img
    ));
    toast.success(collectionId ? "Added to collection" : "Removed from collection");
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase.from("generated_images").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete image");
      return;
    }
    setImages(images.filter(img => img.id !== id));
    toast.success("Image deleted");
  };

  const filteredImages = selectedCollection
    ? images.filter(img => img.collection_id === selectedCollection)
    : images;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-sm font-display text-primary uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Library ({images.length})
        </h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <FolderPlus className="h-3.5 w-3.5 mr-1" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCollection()}
              />
              <Button onClick={createCollection} disabled={isCreatingCollection}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collection Filter */}
      <div className="p-3 border-b border-white/10">
        <ScrollArea className="w-full">
          <div className="flex gap-2">
            <Button
              variant={selectedCollection === null ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-7 text-xs"
              onClick={() => setSelectedCollection(null)}
            >
              All
            </Button>
            {collections.map((collection) => (
              <div key={collection.id} className="relative group shrink-0">
                <Button
                  variant={selectedCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs pr-6"
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <Folder className="h-3 w-3 mr-1" />
                  {collection.name}
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(collection.id);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Image Grid */}
      <ScrollArea className="flex-1 p-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            {selectedCollection ? "No images in this collection" : "No images yet. Generate some!"}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "group relative aspect-square rounded-lg overflow-hidden cursor-pointer ring-1 ring-white/10 hover:ring-primary/50 transition-all",
                  selectionMode && "hover:scale-105"
                )}
                onClick={() => selectionMode && onSelectImage?.(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                  {selectionMode ? (
                    <Button size="sm" className="h-7 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  ) : (
                    <>
                      <Select
                        value={image.collection_id || "none"}
                        onValueChange={(value) => 
                          addImageToCollection(image.id, value === "none" ? null : value)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs w-full">
                          <SelectValue placeholder="Add to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Collection</SelectItem>
                          {collections.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(image.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Hook to save images to library
export function useSaveToLibrary() {
  const saveImage = async (url: string, prompt: string, model?: string) => {
    const { error } = await supabase
      .from("generated_images")
      .insert({ url, prompt, model });
    
    if (error) {
      console.error("Failed to save image:", error);
      return false;
    }
    return true;
  };

  return { saveImage };
}
