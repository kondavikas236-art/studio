"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A custom SVG logo representing the "Guardian Eye" shield.
 */
export function KidsyeeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("h-12 w-12", className)} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Shield Shape */}
      <path 
        d="M50 5 L15 20 V50 C15 75 50 95 50 95 C50 95 85 75 85 50 V20 L50 5Z" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinejoin="round" 
      />
      {/* Friendly Eye Outer */}
      <circle cx="50" cy="45" r="18" stroke="currentColor" strokeWidth="6" />
      {/* Pupil */}
      <circle cx="50" cy="45" r="6" fill="currentColor" />
      {/* Eyelid / Expression line */}
      <path 
        d="M35 40 Q50 28 65 40" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none"
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
