import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderPlus, Folder, Image as ImageIcon, X, Check, Trash2, 
  Search, Edit2, CheckSquare, Square, FolderInput, Upload, Loader2
} from "lucide-react";
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
  is_favorite?: boolean;
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
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadToCollection, setUploadToCollection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      .insert({ 
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim() || null
      })
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to create collection");
      setIsCreatingCollection(false);
      return;
    }
    
    setCollections([data, ...collections]);
    setNewCollectionName("");
    setNewCollectionDesc("");
    setIsCreatingCollection(false);
    toast.success("Collection created!");
  };

  const updateCollection = async () => {
    if (!editingCollection || !editName.trim()) return;
    
    const { error } = await supabase
      .from("collections")
      .update({ 
        name: editName.trim(),
        description: editDesc.trim() || null
      })
      .eq("id", editingCollection.id);
    
    if (error) {
      toast.error("Failed to update collection");
      return;
    }
    
    setCollections(collections.map(c => 
      c.id === editingCollection.id 
        ? { ...c, name: editName.trim(), description: editDesc.trim() || null }
        : c
    ));
    setEditingCollection(null);
    toast.success("Collection updated!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        continue;
      }

      try {
        // Convert to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const response = await fetch(`${supabaseUrl}/functions/v1/upload-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ 
            image: base64,
            folder: "library"
          }),
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        const imageUrl = data.url;

        // Save to database
        const { error } = await supabase
          .from("generated_images")
          .insert({ 
            url: imageUrl, 
            prompt: file.name.replace(/\.[^/.]+$/, ""), // Use filename as prompt
            collection_id: uploadToCollection 
          });

        if (error) throw error;

        successCount++;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} image${successCount > 1 ? "s" : ""}`);
      fetchImages();
    }

    setIsUploading(false);
    setUploadToCollection(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = (collectionId: string | null = null) => {
    setUploadToCollection(collectionId);
    fileInputRef.current?.click();
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

  const moveSelectedToCollection = async (collectionId: string | null) => {
    if (selectedImages.size === 0) return;
    
    const { error } = await supabase
      .from("generated_images")
      .update({ collection_id: collectionId })
      .in("id", Array.from(selectedImages));
    
    if (error) {
      toast.error("Failed to move images");
      return;
    }
    
    setImages(images.map(img => 
      selectedImages.has(img.id) ? { ...img, collection_id: collectionId } : img
    ));
    setSelectedImages(new Set());
    setMultiSelectMode(false);
    toast.success(`Moved ${selectedImages.size} images`);
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    const { error } = await supabase
      .from("generated_images")
      .delete()
      .in("id", Array.from(selectedImages));
    
    if (error) {
      toast.error("Failed to delete images");
      return;
    }
    
    setImages(images.filter(img => !selectedImages.has(img.id)));
    setSelectedImages(new Set());
    setMultiSelectMode(false);
    toast.success(`Deleted ${selectedImages.size} images`);
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

  const toggleImageSelection = (id: string) => {
    const newSet = new Set(selectedImages);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedImages(newSet);
  };

  const selectAll = () => {
    const allIds = new Set(filteredImages.map(img => img.id));
    setSelectedImages(allIds);
  };

  const deselectAll = () => {
    setSelectedImages(new Set());
  };

  // Get image count per collection
  const getCollectionImageCount = (collectionId: string) => {
    return images.filter(img => img.collection_id === collectionId).length;
  };

  // Filter images
  const filteredImages = images.filter(img => {
    const matchesCollection = selectedCollection 
      ? img.collection_id === selectedCollection 
      : true;
    const matchesSearch = searchQuery 
      ? img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesFavorites = showFavorites ? img.is_favorite : true;
    return matchesCollection && matchesSearch && matchesFavorites;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-sm font-display text-primary uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Library ({images.length})
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Upload button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => triggerUpload(selectedCollection)}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5 mr-1" />
            )}
            Upload
          </Button>
          
          {/* Multi-select toggle */}
          <Button
            variant={multiSelectMode ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);
              setSelectedImages(new Set());
            }}
          >
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            Select
          </Button>
          
          {/* New Collection Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <FolderPlus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10">
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)..."
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={createCollection} disabled={isCreatingCollection} className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Collection Filter */}
      <div className="p-3 border-b border-white/10">
        <ScrollArea className="w-full">
          <div className="flex gap-2">
            <Button
              variant={selectedCollection === null && !showFavorites ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-7 text-xs"
              onClick={() => {
                setSelectedCollection(null);
                setShowFavorites(false);
              }}
            >
              All ({images.length})
            </Button>
            
            {collections.map((collection) => (
              <div key={collection.id} className="relative group shrink-0">
                <Button
                  variant={selectedCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs pr-8"
                  onClick={() => {
                    setSelectedCollection(collection.id);
                    setShowFavorites(false);
                  }}
                  title={collection.description || undefined}
                >
                  <Folder className="h-3 w-3 mr-1" />
                  {collection.name}
                  <span className="ml-1 opacity-60">({getCollectionImageCount(collection.id)})</span>
                </Button>
                
                {/* Collection actions */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerUpload(collection.id);
                    }}
                    className="text-secondary hover:text-secondary"
                    title="Upload to collection"
                  >
                    <Upload className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCollection(collection);
                      setEditName(collection.name);
                      setEditDesc(collection.description || "");
                    }}
                    className="text-primary hover:text-primary"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCollection(collection.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Multi-select actions */}
      {multiSelectMode && selectedImages.size > 0 && (
        <div className="p-3 border-b border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">{selectedImages.size} selected</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={deselectAll}>
            Deselect
          </Button>
          
          <Select onValueChange={(value) => moveSelectedToCollection(value === "none" ? null : value)}>
            <SelectTrigger className="h-7 text-xs w-32">
              <FolderInput className="h-3 w-3 mr-1" />
              Move to...
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
            className="h-7 text-xs"
            onClick={deleteSelectedImages}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {/* Image Grid */}
      <ScrollArea className="flex-1 p-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            {searchQuery ? "No images match your search" : selectedCollection ? "No images in this collection" : "No images yet. Generate some!"}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all",
                  multiSelectMode && selectedImages.has(image.id) 
                    ? "ring-2 ring-primary scale-95" 
                    : "ring-1 ring-white/10 hover:ring-primary/50",
                  selectionMode && "hover:scale-105"
                )}
                onClick={() => {
                  if (multiSelectMode) {
                    toggleImageSelection(image.id);
                  } else if (selectionMode) {
                    onSelectImage?.(image.url);
                  }
                }}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                
                {/* Selection checkbox */}
                {multiSelectMode && (
                  <div className="absolute top-1 left-1">
                    {selectedImages.has(image.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary drop-shadow-lg" />
                    ) : (
                      <Square className="h-5 w-5 text-white/70 drop-shadow-lg" />
                    )}
                  </div>
                )}
                
                {/* Overlay */}
                {!multiSelectMode && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Edit Collection Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Collection name..."
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)..."
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button onClick={updateCollection} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (editingCollection) deleteCollection(editingCollection.id);
                  setEditingCollection(null);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
