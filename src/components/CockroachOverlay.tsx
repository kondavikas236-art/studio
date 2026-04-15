"use client";

import { useEffect, useState } from "react";

interface BugInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  scale: number;
}

function RealisticCockroach() {
  return (
    <svg 
      viewBox="0 0 100 120" 
      className="h-32 w-32 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Long Antennae */}
      <g stroke="#4a2c10" fill="none" strokeWidth="0.8" strokeLinecap="round">
        <path d="M50 30 Q30 -20 0 10" className="animate-pulse" />
        <path d="M50 30 Q70 -20 100 10" className="animate-pulse" />
      </g>

      {/* Spiky Legs */}
      <g stroke="#2d1a0a" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M40 45 L15 30 L5 35" />
        <path d="M60 45 L85 30 L95 35" />
        <path d="M35 65 L10 65 L0 75" />
        <path d="M65 65 L90 65 L100 75" />
        <path d="M40 90 L10 110 L0 120" />
        <path d="M60 90 L90 110 L100 120" />
      </g>

      {/* Body Parts */}
      <defs>
        <radialGradient id="cockroachBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d2691e" />
          <stop offset="60%" stopColor="#8b4513" />
          <stop offset="100%" stopColor="#2d1a0a" />
        </radialGradient>
      </defs>

      {/* Main Body (Abdomen) */}
      <ellipse cx="50" cy="75" rx="20" ry="40" fill="url(#cockroachBody)" />
      
      {/* Thorax Pattern */}
      <path 
        d="M32 45 Q50 35 68 45 L62 65 Q50 70 38 65 Z" 
        fill="#b35a16" 
        stroke="#4a2c10" 
        strokeWidth="0.5" 
      />

      {/* Head */}
      <ellipse cx="50" cy="35" rx="10" ry="12" fill="#1a0f05" />
      
      {/* Wings overlay */}
      <path 
        d="M30 50 Q50 45 70 50 L65 115 Q50 120 35 115 Z" 
        fill="rgba(45, 26, 10, 0.85)" 
        stroke="#1a0f05" 
        strokeWidth="0.3" 
      />
    </svg>
  );
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);

  useEffect(() => {
    if (active) {
      const newBugs = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 10 + 10}s`,
        delay: `${Math.random() * 5}s`,
        scale: 0.8 + Math.random() * 0.7,
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
          className="absolute animate-bug-roam"
          style={{
            top: bug.top,
            left: bug.left,
            animationDuration: bug.duration,
            animationDelay: bug.delay,
            transform: `scale(${bug.scale})`,
          }}
        >
          <div className="animate-bug-skitter origin-center">
            <RealisticCockroach />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[1px] animate-pulse" />
    </div>
  );
}