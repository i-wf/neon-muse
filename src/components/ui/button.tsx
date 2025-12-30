import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold uppercase tracking-wider ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-[0_0_20px_hsl(var(--neon-magenta)/0.5)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neonCyan: "bg-transparent border-2 border-[hsl(180_100%_50%)] text-[hsl(180_100%_50%)] hover:bg-[hsl(180_100%_50%/0.2)] hover:shadow-[0_0_30px_hsl(180_100%_50%/0.6)] active:scale-95",
        neonMagenta: "bg-transparent border-2 border-[hsl(300_100%_60%)] text-[hsl(300_100%_60%)] hover:bg-[hsl(300_100%_60%/0.2)] hover:shadow-[0_0_30px_hsl(300_100%_60%/0.6)] active:scale-95",
        neonGradient: "bg-gradient-to-r from-[hsl(180_100%_50%)] to-[hsl(300_100%_60%)] text-[hsl(220_20%_6%)] font-bold hover:shadow-[0_0_40px_hsl(180_100%_50%/0.4),0_0_40px_hsl(300_100%_60%/0.4)] active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-14 rounded-lg px-10 text-base",
        xl: "h-16 rounded-xl px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
