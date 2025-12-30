import { Palette, Sparkles, Sun, Camera, Zap, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditOption {
  id: string;
  name: string;
  promptAddition: string;
  icon: React.ReactNode;
  category: "style" | "lighting" | "effect" | "quality";
}

const EDIT_OPTIONS: EditOption[] = [
  // Styles
  { id: "cyberpunk", name: "Cyberpunk", promptAddition: "cyberpunk style, neon lights, futuristic", icon: <Zap className="h-4 w-4" />, category: "style" },
  { id: "anime", name: "Anime", promptAddition: "anime style, vibrant colors, detailed illustration", icon: <Sparkles className="h-4 w-4" />, category: "style" },
  { id: "oil-painting", name: "Oil Painting", promptAddition: "oil painting style, textured brushstrokes, classical art", icon: <Palette className="h-4 w-4" />, category: "style" },
  { id: "watercolor", name: "Watercolor", promptAddition: "watercolor painting, soft colors, artistic", icon: <Palette className="h-4 w-4" />, category: "style" },
  { id: "3d-render", name: "3D Render", promptAddition: "3D render, octane render, highly detailed CGI", icon: <Layers className="h-4 w-4" />, category: "style" },
  { id: "photorealistic", name: "Photorealistic", promptAddition: "photorealistic, ultra realistic, 8K photography", icon: <Camera className="h-4 w-4" />, category: "style" },
  
  // Lighting
  { id: "golden-hour", name: "Golden Hour", promptAddition: "golden hour lighting, warm sunlight, soft shadows", icon: <Sun className="h-4 w-4" />, category: "lighting" },
  { id: "dramatic", name: "Dramatic", promptAddition: "dramatic lighting, high contrast, chiaroscuro", icon: <Sun className="h-4 w-4" />, category: "lighting" },
  { id: "neon-glow", name: "Neon Glow", promptAddition: "neon lighting, glowing effects, vibrant colors", icon: <Zap className="h-4 w-4" />, category: "lighting" },
  { id: "studio", name: "Studio Light", promptAddition: "professional studio lighting, soft box lighting", icon: <Camera className="h-4 w-4" />, category: "lighting" },
  
  // Effects
  { id: "bokeh", name: "Bokeh", promptAddition: "bokeh effect, blurred background, depth of field", icon: <Camera className="h-4 w-4" />, category: "effect" },
  { id: "particles", name: "Particles", promptAddition: "particle effects, magical particles, sparkles", icon: <Sparkles className="h-4 w-4" />, category: "effect" },
  { id: "fog", name: "Atmospheric Fog", promptAddition: "atmospheric fog, misty, ethereal atmosphere", icon: <Layers className="h-4 w-4" />, category: "effect" },
  { id: "reflections", name: "Reflections", promptAddition: "reflective surfaces, mirror-like reflections", icon: <Layers className="h-4 w-4" />, category: "effect" },
  
  // Quality
  { id: "8k", name: "8K Ultra HD", promptAddition: "8K resolution, ultra high definition, extremely detailed", icon: <Sparkles className="h-4 w-4" />, category: "quality" },
  { id: "masterpiece", name: "Masterpiece", promptAddition: "masterpiece, best quality, award-winning", icon: <Sparkles className="h-4 w-4" />, category: "quality" },
  { id: "trending", name: "Trending Art", promptAddition: "trending on ArtStation, popular artwork", icon: <Zap className="h-4 w-4" />, category: "quality" },
];

interface EditPanelProps {
  activeEdits: EditOption[];
  onEditToggle: (edit: EditOption) => void;
}

export function EditPanel({ activeEdits, onEditToggle }: EditPanelProps) {
  const categories = [
    { key: "style", label: "Styles", color: "cyan" },
    { key: "lighting", label: "Lighting", color: "magenta" },
    { key: "effect", label: "Effects", color: "purple" },
    { key: "quality", label: "Quality", color: "cyan" },
  ] as const;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-neon-cyan" />
        <h2 className="font-display text-lg text-neon-cyan uppercase tracking-wider">
          Edit Options
        </h2>
        {activeEdits.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs font-body">
            {activeEdits.length} active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {categories.map(({ key, label, color }) => (
          <div key={key}>
            <h3 className={cn(
              "font-body text-sm mb-2",
              color === "cyan" && "text-neon-cyan",
              color === "magenta" && "text-neon-magenta",
              color === "purple" && "text-neon-purple"
            )}>
              {label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {EDIT_OPTIONS.filter(e => e.category === key).map((edit) => {
                const isActive = activeEdits.some(e => e.id === edit.id);
                return (
                  <button
                    key={edit.id}
                    onClick={() => onEditToggle(edit)}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-body text-sm transition-all duration-200",
                      isActive
                        ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]"
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
        ))}
      </div>
    </section>
  );
}
