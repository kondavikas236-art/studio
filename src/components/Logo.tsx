
"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A simple, minimalist "Two Healthy Eyes" logo.
 * Features natural eye shapes with subtle highlights and no text in the pupils.
 */
export function KidsyeeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 160 100" 
      className={cn("h-12 w-auto", className)} 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kidsyee Two Eyes Logo"
    >
      {/* Left Eye */}
      <path 
        d="M15 50 C30 25 60 25 75 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M15 50 C30 75 60 75 75 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <circle cx="45" cy="50" r="14" fill="currentColor" />
      <circle cx="50" cy="44" r="4" fill="white" fillOpacity="0.4" />

      {/* Right Eye */}
      <path 
        d="M85 50 C100 25 130 25 145 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M85 50 C100 75 130 75 145 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <circle cx="115" cy="50" r="14" fill="currentColor" />
      <circle cx="120" cy="44" r="4" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

export function KidsyeeTextLogo({ className }: { className?: string }) {
  return (
    <h1 className={cn("text-3xl font-black tracking-tighter text-foreground italic leading-none select-none", className)}>
      Kids<span className="text-primary">yee</span>
    </h1>
  );
}
