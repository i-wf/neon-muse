import { cn } from "@/lib/utils";

interface ImaginaryLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function ImaginaryLogo({ size = "md", showText = true, className }: ImaginaryLogoProps) {
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-lg" },
    md: { icon: "h-8 w-8", text: "text-xl" },
    lg: { icon: "h-10 w-10", text: "text-2xl" },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Mathematical "i" Logo */}
      <div className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-magenta p-0.5",
        sizes[size].icon
      )}>
        <div className="w-full h-full rounded-[6px] bg-background flex items-center justify-center">
          <span className="font-display font-bold italic bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent"
            style={{ 
              fontSize: size === "sm" ? "1rem" : size === "md" ? "1.25rem" : "1.5rem",
              fontFamily: "'Times New Roman', serif",
              letterSpacing: "-0.05em"
            }}
          >
            i
          </span>
        </div>
      </div>
      
      {showText && (
        <span className={cn(
          "font-display font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent uppercase tracking-wide",
          sizes[size].text
        )}>
          Imaginary
        </span>
      )}
    </div>
  );
}
