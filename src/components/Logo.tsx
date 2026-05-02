"use client";

import { cn } from "@/lib/utils";

/**
 * KidsyeeLogo - A custom "Healthy Eye" logo with the name integrated.
 * This ensures no copyright issues and directly follows the brand mission.
 */
export function KidsyeeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("h-12 w-12", className)} 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kidsyee Healthy Eye Logo"
    >
      {/* Subtle outer glow for depth */}
      <circle cx="50" cy="50" r="48" fill="currentColor" fillOpacity="0.05" />

      {/* The Protective Eye Lids (Healthy Eye Shape) */}
      <path 
        d="M10 50 Q50 15 90 50 Q50 85 10 50" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* The Iris - representing focus and health */}
      <circle cx="50" cy="50" r="26" fill="currentColor" />
      
      {/* Integrated Brand Name in the Core */}
      <text 
        x="50" 
        y="53.5" 
        textAnchor="middle" 
        fill="white" 
        fontSize="8" 
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.2"
      >
        KIDSYEE
      </text>

      {/* The Health Sparkle - reflecting a healthy digital environment */}
      <circle cx="65" cy="40" r="4" fill="white" fillOpacity="0.6" />
      <circle cx="68" cy="37" r="1.5" fill="white" fillOpacity="0.8" />
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
