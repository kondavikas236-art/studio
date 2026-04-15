
"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FocusMeterProps {
  value: number;
  label: string;
  className?: string;
}

export function FocusMeter({ value, label, className }: FocusMeterProps) {
  const isLow = value < 30;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-semibold text-primary">{label}</span>
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          isLow ? "bg-destructive/10 text-destructive animate-pulse" : "bg-accent/20 text-accent-foreground"
        )}>
          {value}% Remaining
        </span>
      </div>
      <div className="relative h-6 focus-meter-glow rounded-full overflow-hidden bg-muted">
        <Progress 
          value={value} 
          className={cn(
            "h-full transition-all duration-1000",
            isLow ? "bg-destructive" : "bg-primary"
          )} 
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}
