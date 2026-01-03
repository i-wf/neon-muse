import { 
  Palette, Sparkles, Sun, Camera, Zap, Layers, 
  Wand2, Eye, Mountain, Star, Flame, Snowflake,
  Cloud, Moon, Sunset, Waves, TreePine, Building2,
  Aperture, Focus, Contrast, Lightbulb, Rainbow,
  Ghost, Skull, Heart, Gem, Crown, Music, Smile,
  Frown, Meh, Angry, Laugh, SmilePlus, CircleDot,
  Glasses, CircleUser, Baby, Cat, Dog, Bird, Fish,
  Flower2, Castle, Church, Factory, Warehouse,
  Tent, Sailboat, Plane, Car, Rocket, Landmark,
  Home, Store, School, Palmtree, Citrus, Grape
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export interface EditOption {
  id: string;
  name: string;
  nameAr: string;
  promptAddition: string;
  icon: React.ReactNode;
  category: string;
}

export const EDIT_OPTIONS: EditOption[] = [
  // Art Styles
  { id: "cyberpunk", name: "Cyberpunk", nameAr: "سايبربانك", promptAddition: "cyberpunk style, neon lights, futuristic city", icon: <Zap className="h-4 w-4" />, category: "Art Style" },
  { id: "anime", name: "Anime", nameAr: "أنمي", promptAddition: "anime style, vibrant colors, detailed illustration, Studio Ghibli inspired", icon: <Sparkles className="h-4 w-4" />, category: "Art Style" },
  { id: "oil-painting", name: "Oil Painting", nameAr: "لوحة زيتية", promptAddition: "oil painting style, textured brushstrokes, classical art, museum quality", icon: <Palette className="h-4 w-4" />, category: "Art Style" },
  { id: "watercolor", name: "Watercolor", nameAr: "ألوان مائية", promptAddition: "watercolor painting, soft colors, artistic, flowing pigments", icon: <Palette className="h-4 w-4" />, category: "Art Style" },
  { id: "3d-render", name: "3D Render", nameAr: "تصيير ثلاثي الأبعاد", promptAddition: "3D render, octane render, highly detailed CGI, Blender", icon: <Layers className="h-4 w-4" />, category: "Art Style" },
  { id: "photorealistic", name: "Photorealistic", nameAr: "واقعي", promptAddition: "photorealistic, ultra realistic, 8K photography, DSLR quality", icon: <Camera className="h-4 w-4" />, category: "Art Style" },
  { id: "fantasy", name: "Fantasy Art", nameAr: "فن الخيال", promptAddition: "fantasy art style, magical, epic, detailed illustration", icon: <Wand2 className="h-4 w-4" />, category: "Art Style" },
  { id: "surrealism", name: "Surrealism", nameAr: "سريالية", promptAddition: "surrealist art, dreamlike, Salvador Dali inspired, impossible geometry", icon: <Eye className="h-4 w-4" />, category: "Art Style" },
  { id: "pixel-art", name: "Pixel Art", nameAr: "فن البكسل", promptAddition: "pixel art style, 16-bit, retro game aesthetic", icon: <Layers className="h-4 w-4" />, category: "Art Style" },
  { id: "comic-book", name: "Comic Book", nameAr: "كتاب مصور", promptAddition: "comic book style, bold lines, halftone dots, dynamic", icon: <Star className="h-4 w-4" />, category: "Art Style" },
  { id: "steampunk", name: "Steampunk", nameAr: "ستيم بانك", promptAddition: "steampunk style, Victorian era, brass gears, mechanical", icon: <Building2 className="h-4 w-4" />, category: "Art Style" },
  { id: "vaporwave", name: "Vaporwave", nameAr: "فيبورويف", promptAddition: "vaporwave aesthetic, retro 80s, pink and blue, synthwave", icon: <Rainbow className="h-4 w-4" />, category: "Art Style" },
  { id: "gothic", name: "Gothic", nameAr: "قوطي", promptAddition: "gothic art style, dark, medieval, ornate architecture, moody", icon: <Skull className="h-4 w-4" />, category: "Art Style" },
  { id: "art-deco", name: "Art Deco", nameAr: "آرت ديكو", promptAddition: "art deco style, geometric patterns, 1920s, gold accents, luxurious", icon: <Gem className="h-4 w-4" />, category: "Art Style" },
  { id: "pop-art", name: "Pop Art", nameAr: "فن البوب", promptAddition: "pop art style, Andy Warhol inspired, bold colors, comic dots", icon: <Heart className="h-4 w-4" />, category: "Art Style" },
  { id: "baroque", name: "Baroque", nameAr: "باروك", promptAddition: "baroque style, dramatic, ornate, rich colors, Caravaggio inspired", icon: <Crown className="h-4 w-4" />, category: "Art Style" },
  { id: "minimalist", name: "Minimalist", nameAr: "بسيط", promptAddition: "minimalist style, clean lines, simple, modern, elegant", icon: <Focus className="h-4 w-4" />, category: "Art Style" },
  { id: "ukiyo-e", name: "Ukiyo-e", nameAr: "أوكييو-إي", promptAddition: "ukiyo-e style, Japanese woodblock print, Hokusai inspired", icon: <Waves className="h-4 w-4" />, category: "Art Style" },
  
  // Lighting
  { id: "golden-hour", name: "Golden Hour", nameAr: "الساعة الذهبية", promptAddition: "golden hour lighting, warm sunlight, soft shadows, magic hour", icon: <Sunset className="h-4 w-4" />, category: "Lighting" },
  { id: "dramatic", name: "Dramatic", nameAr: "دراماتيكي", promptAddition: "dramatic lighting, high contrast, chiaroscuro, Rembrandt lighting", icon: <Sun className="h-4 w-4" />, category: "Lighting" },
  { id: "neon-glow", name: "Neon Glow", nameAr: "توهج نيون", promptAddition: "neon lighting, glowing effects, vibrant colors, light trails", icon: <Zap className="h-4 w-4" />, category: "Lighting" },
  { id: "studio", name: "Studio Light", nameAr: "إضاءة استوديو", promptAddition: "professional studio lighting, soft box, key light, fill light", icon: <Lightbulb className="h-4 w-4" />, category: "Lighting" },
  { id: "moonlight", name: "Moonlight", nameAr: "ضوء القمر", promptAddition: "moonlit scene, soft blue light, nighttime, ethereal glow", icon: <Moon className="h-4 w-4" />, category: "Lighting" },
  { id: "volumetric", name: "Volumetric", nameAr: "حجمي", promptAddition: "volumetric lighting, god rays, light beams, atmospheric", icon: <Sun className="h-4 w-4" />, category: "Lighting" },
  { id: "cinematic", name: "Cinematic", nameAr: "سينمائي", promptAddition: "cinematic lighting, movie scene, color graded, anamorphic", icon: <Camera className="h-4 w-4" />, category: "Lighting" },
  { id: "bioluminescent", name: "Bioluminescent", nameAr: "إضاءة حيوية", promptAddition: "bioluminescent lighting, glowing organisms, Avatar style", icon: <Sparkles className="h-4 w-4" />, category: "Lighting" },
  { id: "rim-light", name: "Rim Light", nameAr: "إضاءة خلفية", promptAddition: "rim lighting, backlit, silhouette edges, halo effect", icon: <Sun className="h-4 w-4" />, category: "Lighting" },
  
  // Effects
  { id: "bokeh", name: "Bokeh", nameAr: "بوكيه", promptAddition: "bokeh effect, blurred background, shallow depth of field, f/1.4", icon: <Aperture className="h-4 w-4" />, category: "Effects" },
  { id: "particles", name: "Particles", nameAr: "جزيئات", promptAddition: "particle effects, magical particles, sparkles, floating embers", icon: <Sparkles className="h-4 w-4" />, category: "Effects" },
  { id: "fog", name: "Atmospheric Fog", nameAr: "ضباب", promptAddition: "atmospheric fog, misty, ethereal atmosphere, volumetric haze", icon: <Cloud className="h-4 w-4" />, category: "Effects" },
  { id: "reflections", name: "Reflections", nameAr: "انعكاسات", promptAddition: "reflective surfaces, mirror-like reflections, wet surfaces", icon: <Waves className="h-4 w-4" />, category: "Effects" },
  { id: "motion-blur", name: "Motion Blur", nameAr: "ضبابية الحركة", promptAddition: "motion blur, dynamic movement, speed lines, action shot", icon: <Zap className="h-4 w-4" />, category: "Effects" },
  { id: "rain", name: "Rain", nameAr: "مطر", promptAddition: "rain effects, wet surfaces, rain drops, stormy weather", icon: <Cloud className="h-4 w-4" />, category: "Effects" },
  { id: "fire", name: "Fire & Flames", nameAr: "نار ولهب", promptAddition: "fire effects, flames, burning embers, heat distortion", icon: <Flame className="h-4 w-4" />, category: "Effects" },
  { id: "snow", name: "Snow", nameAr: "ثلج", promptAddition: "snow effects, falling snowflakes, frost, winter scene", icon: <Snowflake className="h-4 w-4" />, category: "Effects" },
  { id: "lens-flare", name: "Lens Flare", nameAr: "توهج العدسة", promptAddition: "lens flare, anamorphic flare, light streaks", icon: <Sun className="h-4 w-4" />, category: "Effects" },
  { id: "chromatic", name: "Chromatic", nameAr: "كروماتيك", promptAddition: "chromatic aberration, RGB split, glitch effect", icon: <Rainbow className="h-4 w-4" />, category: "Effects" },
  { id: "double-exposure", name: "Double Exposure", nameAr: "تعريض مزدوج", promptAddition: "double exposure effect, overlay, merged images, artistic blend", icon: <Layers className="h-4 w-4" />, category: "Effects" },
  { id: "holographic", name: "Holographic", nameAr: "هولوغرافي", promptAddition: "holographic effect, iridescent, rainbow shimmer, futuristic", icon: <Sparkles className="h-4 w-4" />, category: "Effects" },
  
  // Facial Expressions & Emotions
  { id: "happy", name: "Happy", nameAr: "سعيد", promptAddition: "happy expression, joyful smile, bright eyes, cheerful", icon: <Smile className="h-4 w-4" />, category: "Expression" },
  { id: "sad", name: "Sad", nameAr: "حزين", promptAddition: "sad expression, melancholic, teary eyes, sorrowful look", icon: <Frown className="h-4 w-4" />, category: "Expression" },
  { id: "smirk", name: "Smirking", nameAr: "مبتسم بخبث", promptAddition: "smirking expression, sly smile, mischievous look, one-sided grin", icon: <Meh className="h-4 w-4" />, category: "Expression" },
  { id: "angry", name: "Angry", nameAr: "غاضب", promptAddition: "angry expression, furrowed brows, intense stare, fierce look", icon: <Angry className="h-4 w-4" />, category: "Expression" },
  { id: "laughing", name: "Laughing", nameAr: "ضاحك", promptAddition: "laughing expression, wide smile, genuine laughter, crinkled eyes", icon: <Laugh className="h-4 w-4" />, category: "Expression" },
  { id: "surprised", name: "Surprised", nameAr: "مندهش", promptAddition: "surprised expression, wide eyes, open mouth, shocked look", icon: <SmilePlus className="h-4 w-4" />, category: "Expression" },
  { id: "thoughtful", name: "Thoughtful", nameAr: "متأمل", promptAddition: "thoughtful expression, contemplative, pensive look, deep in thought", icon: <CircleDot className="h-4 w-4" />, category: "Expression" },
  { id: "confident", name: "Confident", nameAr: "واثق", promptAddition: "confident expression, self-assured, strong gaze, empowered look", icon: <CircleUser className="h-4 w-4" />, category: "Expression" },
  { id: "mysterious", name: "Mysterious", nameAr: "غامض", promptAddition: "mysterious expression, enigmatic smile, secretive look, alluring", icon: <Eye className="h-4 w-4" />, category: "Expression" },
  { id: "serene", name: "Serene", nameAr: "هادئ", promptAddition: "serene expression, peaceful, calm demeanor, tranquil look", icon: <Heart className="h-4 w-4" />, category: "Expression" },
  { id: "fierce", name: "Fierce", nameAr: "شرس", promptAddition: "fierce expression, determined, warrior look, intense eyes", icon: <Flame className="h-4 w-4" />, category: "Expression" },
  { id: "cute", name: "Cute", nameAr: "لطيف", promptAddition: "cute expression, adorable, innocent look, kawaii", icon: <Baby className="h-4 w-4" />, category: "Expression" },
  { id: "cool", name: "Cool", nameAr: "رائع", promptAddition: "cool expression, relaxed confidence, stylish demeanor, chill vibes", icon: <Glasses className="h-4 w-4" />, category: "Expression" },
  { id: "dreamy", name: "Dreamy", nameAr: "حالم", promptAddition: "dreamy expression, distant gaze, romantic look, wistful", icon: <Cloud className="h-4 w-4" />, category: "Expression" },
  { id: "scared", name: "Scared", nameAr: "خائف", promptAddition: "scared expression, fearful eyes, trembling, anxious look", icon: <Ghost className="h-4 w-4" />, category: "Expression" },
  
  // Environment & Background
  { id: "underwater", name: "Underwater", nameAr: "تحت الماء", promptAddition: "underwater scene, ocean depths, caustic light, bubbles", icon: <Waves className="h-4 w-4" />, category: "Environment" },
  { id: "space", name: "Space", nameAr: "الفضاء", promptAddition: "outer space, nebula, stars, cosmic, galactic", icon: <Star className="h-4 w-4" />, category: "Environment" },
  { id: "forest", name: "Enchanted Forest", nameAr: "غابة ساحرة", promptAddition: "enchanted forest, mystical woods, fairy tale setting", icon: <TreePine className="h-4 w-4" />, category: "Environment" },
  { id: "urban", name: "Urban City", nameAr: "مدينة حضرية", promptAddition: "urban cityscape, metropolitan, skyscrapers, city lights", icon: <Building2 className="h-4 w-4" />, category: "Environment" },
  { id: "desert", name: "Desert", nameAr: "صحراء", promptAddition: "desert landscape, sand dunes, arid, golden sands", icon: <Mountain className="h-4 w-4" />, category: "Environment" },
  { id: "arctic", name: "Arctic", nameAr: "قطب شمالي", promptAddition: "arctic environment, ice, frozen landscape, aurora borealis", icon: <Snowflake className="h-4 w-4" />, category: "Environment" },
  { id: "haunted", name: "Haunted", nameAr: "مسكون", promptAddition: "haunted environment, spooky, abandoned, dark atmosphere, eerie", icon: <Ghost className="h-4 w-4" />, category: "Environment" },
  { id: "tropical", name: "Tropical", nameAr: "استوائي", promptAddition: "tropical paradise, palm trees, crystal clear water, sunset beach", icon: <Palmtree className="h-4 w-4" />, category: "Environment" },
  { id: "medieval-castle", name: "Medieval Castle", nameAr: "قلعة", promptAddition: "medieval castle, stone walls, towers, fantasy kingdom", icon: <Castle className="h-4 w-4" />, category: "Environment" },
  { id: "japanese-garden", name: "Japanese Garden", nameAr: "حديقة يابانية", promptAddition: "Japanese garden, zen, cherry blossoms, koi pond, serene", icon: <Flower2 className="h-4 w-4" />, category: "Environment" },
  { id: "cyberpunk-city", name: "Cyberpunk City", nameAr: "مدينة سايبربانك", promptAddition: "cyberpunk city, neon signs, rain-slicked streets, holograms", icon: <Zap className="h-4 w-4" />, category: "Environment" },
  { id: "ancient-ruins", name: "Ancient Ruins", nameAr: "آثار قديمة", promptAddition: "ancient ruins, crumbling temples, overgrown vegetation, lost civilization", icon: <Landmark className="h-4 w-4" />, category: "Environment" },
  { id: "cozy-interior", name: "Cozy Interior", nameAr: "داخلي دافئ", promptAddition: "cozy interior, warm lighting, comfortable furniture, homey atmosphere", icon: <Home className="h-4 w-4" />, category: "Environment" },
  { id: "futuristic-lab", name: "Futuristic Lab", nameAr: "مختبر مستقبلي", promptAddition: "futuristic laboratory, high-tech equipment, holographic displays, sci-fi", icon: <Factory className="h-4 w-4" />, category: "Environment" },
  { id: "mountain-peak", name: "Mountain Peak", nameAr: "قمة جبل", promptAddition: "mountain peak, snowy summit, dramatic clouds, epic vista", icon: <Mountain className="h-4 w-4" />, category: "Environment" },
  { id: "gothic-cathedral", name: "Gothic Cathedral", nameAr: "كاتدرائية قوطية", promptAddition: "gothic cathedral, stained glass, vaulted ceilings, candlelight", icon: <Church className="h-4 w-4" />, category: "Environment" },
  { id: "apocalyptic", name: "Post-Apocalyptic", nameAr: "ما بعد نهاية العالم", promptAddition: "post-apocalyptic wasteland, destroyed buildings, overgrown, survival", icon: <Warehouse className="h-4 w-4" />, category: "Environment" },
  { id: "cafe", name: "Cozy Café", nameAr: "مقهى", promptAddition: "cozy café interior, warm ambiance, coffee shop, inviting", icon: <Store className="h-4 w-4" />, category: "Environment" },
  { id: "library", name: "Grand Library", nameAr: "مكتبة كبيرة", promptAddition: "grand library, endless bookshelves, ancient tomes, magical atmosphere", icon: <School className="h-4 w-4" />, category: "Environment" },
  { id: "alien-planet", name: "Alien Planet", nameAr: "كوكب غريب", promptAddition: "alien planet, strange flora, multiple moons, otherworldly landscape", icon: <Rocket className="h-4 w-4" />, category: "Environment" },
  { id: "vineyard", name: "Vineyard", nameAr: "كرم عنب", promptAddition: "vineyard, rolling hills, grape vines, golden hour, Tuscany", icon: <Grape className="h-4 w-4" />, category: "Environment" },
  { id: "camping", name: "Campsite", nameAr: "مخيم", promptAddition: "campsite, tent, campfire, starry night, wilderness", icon: <Tent className="h-4 w-4" />, category: "Environment" },
  { id: "sailing", name: "Ocean Voyage", nameAr: "رحلة بحرية", promptAddition: "sailing ship, open ocean, adventure, dramatic waves", icon: <Sailboat className="h-4 w-4" />, category: "Environment" },
  
  // Camera & Composition
  { id: "macro", name: "Macro Shot", nameAr: "لقطة ماكرو", promptAddition: "macro photography, extreme close-up, fine details", icon: <Focus className="h-4 w-4" />, category: "Camera" },
  { id: "wide-angle", name: "Wide Angle", nameAr: "زاوية واسعة", promptAddition: "wide angle lens, expansive view, 16mm lens", icon: <Camera className="h-4 w-4" />, category: "Camera" },
  { id: "portrait", name: "Portrait", nameAr: "بورتريه", promptAddition: "portrait photography, 85mm lens, shallow depth", icon: <Camera className="h-4 w-4" />, category: "Camera" },
  { id: "aerial", name: "Aerial View", nameAr: "منظر جوي", promptAddition: "aerial view, birds eye view, drone shot", icon: <Mountain className="h-4 w-4" />, category: "Camera" },
  { id: "symmetry", name: "Symmetry", nameAr: "تماثل", promptAddition: "perfect symmetry, centered composition, balanced", icon: <Layers className="h-4 w-4" />, category: "Camera" },
  { id: "tilt-shift", name: "Tilt Shift", nameAr: "تلت شيفت", promptAddition: "tilt shift effect, miniature effect, selective focus", icon: <Aperture className="h-4 w-4" />, category: "Camera" },
  { id: "fish-eye", name: "Fish Eye", nameAr: "عين السمكة", promptAddition: "fish eye lens, distorted perspective, 180 degree view", icon: <Aperture className="h-4 w-4" />, category: "Camera" },
  
  // Quality & Detail
  { id: "8k", name: "8K Ultra HD", nameAr: "8K فائق الدقة", promptAddition: "8K resolution, ultra high definition, extremely detailed", icon: <Sparkles className="h-4 w-4" />, category: "Quality" },
  { id: "masterpiece", name: "Masterpiece", nameAr: "تحفة فنية", promptAddition: "masterpiece, best quality, award-winning, exceptional", icon: <Star className="h-4 w-4" />, category: "Quality" },
  { id: "trending", name: "Trending Art", nameAr: "فن رائج", promptAddition: "trending on ArtStation, popular artwork, featured", icon: <Zap className="h-4 w-4" />, category: "Quality" },
  { id: "intricate", name: "Intricate Detail", nameAr: "تفاصيل دقيقة", promptAddition: "intricate details, fine textures, ornate, elaborate", icon: <Eye className="h-4 w-4" />, category: "Quality" },
  { id: "sharp", name: "Sharp Focus", nameAr: "تركيز حاد", promptAddition: "sharp focus, crisp details, high clarity, tack sharp", icon: <Focus className="h-4 w-4" />, category: "Quality" },
  { id: "hdr", name: "HDR", nameAr: "نطاق ديناميكي عالي", promptAddition: "HDR, high dynamic range, vivid colors, enhanced contrast", icon: <Contrast className="h-4 w-4" />, category: "Quality" },
];

const categoryTranslations: Record<string, string> = {
  "Art Style": "أسلوب فني",
  "Lighting": "الإضاءة",
  "Effects": "تأثيرات",
  "Expression": "تعبيرات الوجه",
  "Environment": "البيئة والخلفية",
  "Camera": "الكاميرا",
  "Quality": "الجودة",
};

interface EditPanelProps {
  activeEdits: EditOption[];
  onEditToggle: (edit: EditOption) => void;
  isArabic?: boolean;
}

export function EditPanel({ activeEdits, onEditToggle, isArabic = false }: EditPanelProps) {
  const categories = [
    { key: "Art Style", color: "primary" },
    { key: "Lighting", color: "secondary" },
    { key: "Effects", color: "accent" },
    { key: "Expression", color: "primary" },
    { key: "Environment", color: "secondary" },
    { key: "Camera", color: "accent" },
    { key: "Quality", color: "primary" },
  ] as const;

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent-foreground";
      default: return "text-primary";
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 pb-4" dir={isArabic ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg text-gradient uppercase tracking-wider">
              {isArabic ? "التأثيرات والأساليب" : "Effects & Styles"}
            </h2>
          </div>
          {activeEdits.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-body">
              {activeEdits.length} {isArabic ? "محدد" : "selected"}
            </span>
          )}
        </div>

        {categories.map(({ key, color }) => {
          const categoryEdits = EDIT_OPTIONS.filter(e => e.category === key);
          return (
            <div key={key} className="space-y-3">
              <h3 className={cn("font-body text-sm font-semibold uppercase tracking-wide", getCategoryColor(color))}>
                {isArabic ? categoryTranslations[key] : key}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryEdits.map((edit) => {
                  const isActive = activeEdits.some(e => e.id === edit.id);
                  return (
                    <button
                      key={edit.id}
                      onClick={() => onEditToggle(edit)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs transition-all duration-200",
                        isActive
                          ? "bg-primary/20 text-primary border border-primary/30 glow-purple"
                          : "glass-subtle text-muted-foreground hover:text-foreground hover:border-primary/20 border border-transparent"
                      )}
                    >
                      {edit.icon}
                      {isArabic ? edit.nameAr : edit.name}
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
