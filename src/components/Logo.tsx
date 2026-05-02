
"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A simple, minimalist "Healthy Eye" logo.
 * The brand name is integrated into the pupil for a clean, professional look.
 */
export function KidsyeeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("h-12 w-12", className)} 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kidsyee Simple Eye Logo"
    >
      {/* Protective Eye Lids - Simplified Curve */}
      <path 
        d="M10 50 C25 20 75 20 90 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M10 50 C25 80 75 80 90 50" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Pupil - The focus point */}
      <circle cx="50" cy="50" r="22" fill="currentColor" />
      
      {/* Integrated Brand Name */}
      <text 
        x="50" 
        y="53" 
        textAnchor="middle" 
        fill="white" 
        fontSize="7" 
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        KIDSYEE
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
