import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PromptDisplayProps {
  prompt: string;
}

export function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl opacity-75 blur group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
      <div className="relative bg-card rounded-xl p-6 md:p-8 border border-border/50">
        <p className="text-lg md:text-xl lg:text-2xl font-body text-foreground leading-relaxed min-h-[80px] flex items-center">
          {prompt}
        </p>
        <Button
          variant="neonCyan"
          size="sm"
          onClick={handleCopy}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
