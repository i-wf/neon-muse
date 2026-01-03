import { cn } from "@/lib/utils";
import { Square, RectangleHorizontal, RectangleVertical, Monitor, Smartphone, Film, Image } from "lucide-react";

export interface AspectRatio {
  id: string;
  label: string;
  labelAr: string;
  ratio: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export const ASPECT_RATIOS: AspectRatio[] = [
  {
    id: "1:1",
    label: "Square",
    labelAr: "مربع",
    ratio: "1:1",
    width: 1024,
    height: 1024,
    icon: <Square className="h-4 w-4" />,
  },
  {
    id: "16:9",
    label: "Landscape",
    labelAr: "أفقي",
    ratio: "16:9",
    width: 1920,
    height: 1080,
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: "9:16",
    label: "Portrait",
    labelAr: "عمودي",
    ratio: "9:16",
    width: 1080,
    height: 1920,
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "4:3",
    label: "Classic",
    labelAr: "كلاسيكي",
    ratio: "4:3",
    width: 1024,
    height: 768,
    icon: <RectangleHorizontal className="h-4 w-4" />,
  },
  {
    id: "3:4",
    label: "Portrait 3:4",
    labelAr: "عمودي 3:4",
    ratio: "3:4",
    width: 768,
    height: 1024,
    icon: <RectangleVertical className="h-4 w-4" />,
  },
  {
    id: "21:9",
    label: "Cinematic",
    labelAr: "سينمائي",
    ratio: "21:9",
    width: 1920,
    height: 820,
    icon: <Film className="h-4 w-4" />,
  },
  {
    id: "3:2",
    label: "Photo",
    labelAr: "صورة",
    ratio: "3:2",
    width: 1536,
    height: 1024,
    icon: <Image className="h-4 w-4" />,
  },
  {
    id: "2:3",
    label: "Portrait 2:3",
    labelAr: "عمودي 2:3",
    ratio: "2:3",
    width: 1024,
    height: 1536,
    icon: <RectangleVertical className="h-4 w-4" />,
  },
];

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
  isArabic?: boolean;
}

export function AspectRatioSelector({ 
  selectedRatio, 
  onRatioChange, 
  isArabic = false 
}: AspectRatioSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {ASPECT_RATIOS.map((ratio) => (
        <button
          key={ratio.id}
          onClick={() => onRatioChange(ratio)}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
            "hover:border-primary/50 hover:bg-primary/5",
            selectedRatio.id === ratio.id
              ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
              : "border-white/10 bg-white/5 text-muted-foreground"
          )}
        >
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            selectedRatio.id === ratio.id
              ? "bg-primary/20"
              : "bg-white/5"
          )}>
            {ratio.icon}
          </div>
          <span className="text-[10px] font-medium truncate w-full text-center">
            {ratio.ratio}
          </span>
        </button>
      ))}
    </div>
  );
}
