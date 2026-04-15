"use client";

import { useEffect, useState } from "react";

interface BugInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
}

/**
 * A realistic Cockroach SVG component modeled after American Cockroach anatomy.
 * Reddish-brown amber tones, long antennae, and spiky legs.
 */
function RealisticCockroach() {
  return (
    <svg 
      viewBox="0 0 100 120" 
      className="h-28 w-28 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Antennae - very long and thin */}
      <path 
        d="M50 30 Q30 -10 5 5" 
        stroke="#4a2c10" 
        fill="none" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
        className="animate-pulse"
      />
      <path 
        d="M50 30 Q70 -10 95 5" 
        stroke="#4a2c10" 
        fill="none" 
        strokeWidth="0.8" 
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* Legs - Spiky and hairy appearance */}
      <g stroke="#2d1a0a" strokeWidth="1.5" strokeLinecap="round" fill="none">
        {/* Front Legs */}
        <path d="M42 45 L20 35 L10 40" />
        <path d="M58 45 L80 35 L90 40" />
        {/* Middle Legs */}
        <path d="M38 65 L15 65 L5 75" />
        <path d="M62 65 L85 65 L95 75" />
        {/* Back Legs - Long and powerful */}
        <path d="M42 85 L15 105 L5 115" />
        <path d="M58 85 L85 105 L95 115" />
      </g>

      {/* Body Gradient */}
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d2691e" />
          <stop offset="70%" stopColor="#8b4513" />
          <stop offset="100%" stopColor="#4a2c10" />
        </radialGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(139, 69, 19, 0.8)" />
          <stop offset="100%" stopColor="rgba(45, 26, 10, 0.9)" />
        </linearGradient>
      </defs>

      {/* Abdomen/Body */}
      <ellipse cx="50" cy="75" rx="18" ry="35" fill="url(#bodyGrad)" />
      
      {/* Thorax - Lighter amber pattern as seen in image */}
      <path 
        d="M35 45 Q50 35 65 45 L60 60 Q50 65 40 60 Z" 
        fill="#b35a16" 
        stroke="#4a2c10" 
        strokeWidth="0.5" 
      />
      
      {/* Wings - overlay for texture */}
      <path 
        d="M32 50 Q50 45 68 50 L65 110 Q50 115 35 110 Z" 
        fill="url(#wingGrad)" 
        stroke="#2d1a0a" 
        strokeWidth="0.3" 
      />

      {/* Head */}
      <ellipse cx="50" cy="38" rx="8" ry="10" fill="#2d1a0a" />
      
      {/* Tiny Eyes */}
      <circle cx="46" cy="35" r="1.5" fill="#000" />
      <circle cx="54" cy="35" r="1.5" fill="#000" />
    </svg>
  );
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);

  useEffect(() => {
    if (active) {
      // Create a swarm of realistic cockroaches
      const newBugs = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 85}%`,
        left: `${Math.random() * 85}%`,
        duration: `${Math.random() * 6 + 6}s`, // Varied movement speeds
        delay: `${Math.random() * 2}s`,
      }));
      setBugs(newBugs);
    } else {
      setBugs([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="absolute animate-bug-float"
          style={{
            top: bug.top,
            left: bug.left,
            animationDuration: bug.duration,
            animationDelay: bug.delay,
          }}
        >
          <div className="animate-bug-skitter origin-center">
            <RealisticCockroach />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/5 backdrop-blur-[0.5px] animate-pulse pointer-events-none" />
    </div>
  );
}