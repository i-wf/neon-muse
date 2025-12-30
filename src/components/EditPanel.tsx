import { 
  Palette, Sparkles, Sun, Camera, Zap, Layers, 
  Wand2, Eye, Mountain, Star, Flame, Snowflake,
  Cloud, Moon, Sunset, Waves, TreePine, Building2,
  Aperture, Focus, Contrast, Lightbulb, Rainbow
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export interface EditOption {
  id: string;
  name: string;
  promptAddition: string;
  icon: React.ReactNode;
  category: string;
}

export const EDIT_OPTIONS: EditOption[] = [
  // Art Styles
  { id: "cyberpunk", name: "Cyberpunk", promptAddition: "cyberpunk style, neon lights, futuristic city", icon: <Zap className="h-4 w-4" />, category: "Art Style" },
  { id: "anime", name: "Anime", promptAddition: "anime style, vibrant colors, detailed illustration, Studio Ghibli inspired", icon: <Sparkles className="h-4 w-4" />, category: "Art Style" },
  { id: "oil-painting", name: "Oil Painting", promptAddition: "oil painting style, textured brushstrokes, classical art, museum quality", icon: <Palette className="h-4 w-4" />, category: "Art Style" },
  { id: "watercolor", name: "Watercolor", promptAddition: "watercolor painting, soft colors, artistic, flowing pigments", icon: <Palette className="h-4 w-4" />, category: "Art Style" },
  { id: "3d-render", name: "3D Render", promptAddition: "3D render, octane render, highly detailed CGI, Blender", icon: <Layers className="h-4 w-4" />, category: "Art Style" },
  { id: "photorealistic", name: "Photorealistic", promptAddition: "photorealistic, ultra realistic, 8K photography, DSLR quality", icon: <Camera className="h-4 w-4" />, category: "Art Style" },
  { id: "fantasy", name: "Fantasy Art", promptAddition: "fantasy art style, magical, epic, detailed illustration", icon: <Wand2 className="h-4 w-4" />, category: "Art Style" },
  { id: "surrealism", name: "Surrealism", promptAddition: "surrealist art, dreamlike, Salvador Dali inspired, impossible geometry", icon: <Eye className="h-4 w-4" />, category: "Art Style" },
  { id: "pixel-art", name: "Pixel Art", promptAddition: "pixel art style, 16-bit, retro game aesthetic", icon: <Layers className="h-4 w-4" />, category: "Art Style" },
  { id: "comic-book", name: "Comic Book", promptAddition: "comic book style, bold lines, halftone dots, dynamic", icon: <Star className="h-4 w-4" />, category: "Art Style" },
  { id: "steampunk", name: "Steampunk", promptAddition: "steampunk style, Victorian era, brass gears, mechanical", icon: <Building2 className="h-4 w-4" />, category: "Art Style" },
  { id: "vaporwave", name: "Vaporwave", promptAddition: "vaporwave aesthetic, retro 80s, pink and blue, synthwave", icon: <Rainbow className="h-4 w-4" />, category: "Art Style" },
  
  // Lighting
  { id: "golden-hour", name: "Golden Hour", promptAddition: "golden hour lighting, warm sunlight, soft shadows, magic hour", icon: <Sunset className="h-4 w-4" />, category: "Lighting" },
  { id: "dramatic", name: "Dramatic", promptAddition: "dramatic lighting, high contrast, chiaroscuro, Rembrandt lighting", icon: <Sun className="h-4 w-4" />, category: "Lighting" },
  { id: "neon-glow", name: "Neon Glow", promptAddition: "neon lighting, glowing effects, vibrant colors, light trails", icon: <Zap className="h-4 w-4" />, category: "Lighting" },
  { id: "studio", name: "Studio Light", promptAddition: "professional studio lighting, soft box, key light, fill light", icon: <Lightbulb className="h-4 w-4" />, category: "Lighting" },
  { id: "moonlight", name: "Moonlight", promptAddition: "moonlit scene, soft blue light, nighttime, ethereal glow", icon: <Moon className="h-4 w-4" />, category: "Lighting" },
  { id: "volumetric", name: "Volumetric", promptAddition: "volumetric lighting, god rays, light beams, atmospheric", icon: <Sun className="h-4 w-4" />, category: "Lighting" },
  { id: "cinematic", name: "Cinematic", promptAddition: "cinematic lighting, movie scene, color graded, anamorphic", icon: <Camera className="h-4 w-4" />, category: "Lighting" },
  { id: "bioluminescent", name: "Bioluminescent", promptAddition: "bioluminescent lighting, glowing organisms, Avatar style", icon: <Sparkles className="h-4 w-4" />, category: "Lighting" },
  
  // Effects
  { id: "bokeh", name: "Bokeh", promptAddition: "bokeh effect, blurred background, shallow depth of field, f/1.4", icon: <Aperture className="h-4 w-4" />, category: "Effects" },
  { id: "particles", name: "Particles", promptAddition: "particle effects, magical particles, sparkles, floating embers", icon: <Sparkles className="h-4 w-4" />, category: "Effects" },
  { id: "fog", name: "Atmospheric Fog", promptAddition: "atmospheric fog, misty, ethereal atmosphere, volumetric haze", icon: <Cloud className="h-4 w-4" />, category: "Effects" },
  { id: "reflections", name: "Reflections", promptAddition: "reflective surfaces, mirror-like reflections, wet surfaces", icon: <Waves className="h-4 w-4" />, category: "Effects" },
  { id: "motion-blur", name: "Motion Blur", promptAddition: "motion blur, dynamic movement, speed lines, action shot", icon: <Zap className="h-4 w-4" />, category: "Effects" },
  { id: "rain", name: "Rain", promptAddition: "rain effects, wet surfaces, rain drops, stormy weather", icon: <Cloud className="h-4 w-4" />, category: "Effects" },
  { id: "fire", name: "Fire & Flames", promptAddition: "fire effects, flames, burning embers, heat distortion", icon: <Flame className="h-4 w-4" />, category: "Effects" },
  { id: "snow", name: "Snow", promptAddition: "snow effects, falling snowflakes, frost, winter scene", icon: <Snowflake className="h-4 w-4" />, category: "Effects" },
  { id: "lens-flare", name: "Lens Flare", promptAddition: "lens flare, anamorphic flare, light streaks", icon: <Sun className="h-4 w-4" />, category: "Effects" },
  { id: "chromatic", name: "Chromatic", promptAddition: "chromatic aberration, RGB split, glitch effect", icon: <Rainbow className="h-4 w-4" />, category: "Effects" },
  
  // Environment
  { id: "underwater", name: "Underwater", promptAddition: "underwater scene, ocean depths, caustic light, bubbles", icon: <Waves className="h-4 w-4" />, category: "Environment" },
  { id: "space", name: "Space", promptAddition: "outer space, nebula, stars, cosmic, galactic", icon: <Star className="h-4 w-4" />, category: "Environment" },
  { id: "forest", name: "Enchanted Forest", promptAddition: "enchanted forest, mystical woods, fairy tale setting", icon: <TreePine className="h-4 w-4" />, category: "Environment" },
  { id: "urban", name: "Urban City", promptAddition: "urban cityscape, metropolitan, skyscrapers, city lights", icon: <Building2 className="h-4 w-4" />, category: "Environment" },
  { id: "desert", name: "Desert", promptAddition: "desert landscape, sand dunes, arid, golden sands", icon: <Mountain className="h-4 w-4" />, category: "Environment" },
  { id: "arctic", name: "Arctic", promptAddition: "arctic environment, ice, frozen landscape, aurora borealis", icon: <Snowflake className="h-4 w-4" />, category: "Environment" },
  
  // Camera & Composition
  { id: "macro", name: "Macro Shot", promptAddition: "macro photography, extreme close-up, fine details", icon: <Focus className="h-4 w-4" />, category: "Camera" },
  { id: "wide-angle", name: "Wide Angle", promptAddition: "wide angle lens, expansive view, 16mm lens", icon: <Camera className="h-4 w-4" />, category: "Camera" },
  { id: "portrait", name: "Portrait", promptAddition: "portrait photography, 85mm lens, shallow depth", icon: <Camera className="h-4 w-4" />, category: "Camera" },
  { id: "aerial", name: "Aerial View", promptAddition: "aerial view, birds eye view, drone shot", icon: <Mountain className="h-4 w-4" />, category: "Camera" },
  { id: "symmetry", name: "Symmetry", promptAddition: "perfect symmetry, centered composition, balanced", icon: <Layers className="h-4 w-4" />, category: "Camera" },
  { id: "tilt-shift", name: "Tilt Shift", promptAddition: "tilt shift effect, miniature effect, selective focus", icon: <Aperture className="h-4 w-4" />, category: "Camera" },
  
  // Quality & Detail
  { id: "8k", name: "8K Ultra HD", promptAddition: "8K resolution, ultra high definition, extremely detailed", icon: <Sparkles className="h-4 w-4" />, category: "Quality" },
  { id: "masterpiece", name: "Masterpiece", promptAddition: "masterpiece, best quality, award-winning, exceptional", icon: <Star className="h-4 w-4" />, category: "Quality" },
  { id: "trending", name: "Trending Art", promptAddition: "trending on ArtStation, popular artwork, featured", icon: <Zap className="h-4 w-4" />, category: "Quality" },
  { id: "intricate", name: "Intricate Detail", promptAddition: "intricate details, fine textures, ornate, elaborate", icon: <Eye className="h-4 w-4" />, category: "Quality" },
  { id: "sharp", name: "Sharp Focus", promptAddition: "sharp focus, crisp details, high clarity, tack sharp", icon: <Focus className="h-4 w-4" />, category: "Quality" },
  { id: "hdr", name: "HDR", promptAddition: "HDR, high dynamic range, vivid colors, enhanced contrast", icon: <Contrast className="h-4 w-4" />, category: "Quality" },
];

interface EditPanelProps {
  activeEdits: EditOption[];
  onEditToggle: (edit: EditOption) => void;
}

export function EditPanel({ activeEdits, onEditToggle }: EditPanelProps) {
  const categories = [
    { key: "Art Style", color: "cyan" },
    { key: "Lighting", color: "magenta" },
    { key: "Effects", color: "purple" },
    { key: "Environment", color: "cyan" },
    { key: "Camera", color: "magenta" },
    { key: "Quality", color: "purple" },
  ] as const;

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "cyan": return "text-neon-cyan";
      case "magenta": return "text-neon-magenta";
      case "purple": return "text-neon-purple";
      default: return "text-neon-cyan";
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-neon-cyan" />
            <h2 className="font-display text-lg text-neon-cyan uppercase tracking-wider">
              Effects & Styles
            </h2>
          </div>
          {activeEdits.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm font-body">
              {activeEdits.length} selected
            </span>
          )}
        </div>

        {categories.map(({ key, color }) => {
          const categoryEdits = EDIT_OPTIONS.filter(e => e.category === key);
          return (
            <div key={key} className="space-y-3">
              <h3 className={cn("font-body text-sm font-semibold", getCategoryColor(color))}>
                {key}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryEdits.map((edit) => {
                  const isActive = activeEdits.some(e => e.id === edit.id);
                  return (
                    <button
                      key={edit.id}
                      onClick={() => onEditToggle(edit)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-body text-xs transition-all duration-200",
                        isActive
                          ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_hsl(var(--neon-cyan)/0.3)]"
                          : "border-border/50 bg-card/50 text-muted-foreground hover:border-neon-cyan/50 hover:text-foreground"
                      )}
                    >
                      {edit.icon}
                      {edit.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
