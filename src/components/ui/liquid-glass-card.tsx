import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "glow";
  children: React.ReactNode;
}

const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "liquid-glass rounded-2xl p-6 transition-all duration-300",
          {
            "hover-float hover-glow": variant === "hover",
            "glow-primary animate-glow": variant === "glow",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

export { LiquidGlassCard };