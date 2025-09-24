import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "ripple relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-gradient-primary text-primary-foreground hover:scale-105 glow-primary": variant === "primary",
            "bg-gradient-secondary text-secondary-foreground hover:scale-105": variant === "secondary",
            "bg-gradient-accent text-accent-foreground hover:scale-105 glow-accent": variant === "accent",
            "liquid-glass text-foreground hover:scale-105 hover-glow": variant === "glass",
            
            // Sizes
            "px-3 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };