"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A redesigned "Wise Owl" logo.
 * The owl represents wisdom and watchful protection, perfect for a screen time guardian.
 */
export function KidsyeeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("h-12 w-12", className)} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Friendly Brow / Ears */}
      <path 
        d="M20 45 Q50 15 80 45" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Left Eye */}
      <circle cx="35" cy="60" r="16" stroke="currentColor" strokeWidth="6" />
      <circle cx="35" cy="60" r="6" fill="currentColor" />
      <circle cx="38" cy="57" r="2" fill="white" />

      {/* Right Eye */}
      <circle cx="65" cy="60" r="16" stroke="currentColor" strokeWidth="6" />
      <circle cx="65" cy="60" r="6" fill="currentColor" />
      <circle cx="68" cy="57" r="2" fill="white" />

      {/* Beak */}
      <path 
        d="M45 75 L50 82 L55 75" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function KidsyeeTextLogo({ className }: { className?: string }) {
  return (
    <h1 className={cn("text-3xl font-black tracking-tighter text-foreground italic leading-none", className)}>
      Kids<span className="text-primary">yee</span>
    </h1>
  );
}
