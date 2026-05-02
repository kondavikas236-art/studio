
"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A simple, minimalist "Two Healthy Eyes" logo.
 * The brand name is split across the pupils for a clean, professional, and balanced look.
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
        d="M10 50 C25 25 65 25 80 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M10 50 C25 75 65 75 80 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <circle cx="45" cy="50" r="18" fill="currentColor" />
      <text 
        x="45" 
        y="53" 
        textAnchor="middle" 
        fill="white" 
        fontSize="8" 
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        KIDS
      </text>

      {/* Right Eye */}
      <path 
        d="M80 50 C95 25 135 25 150 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M80 50 C95 75 135 75 150 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <circle cx="115" cy="50" r="18" fill="currentColor" />
      <text 
        x="115" 
        y="53" 
        textAnchor="middle" 
        fill="white" 
        fontSize="8" 
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        YEE
      </text>
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
