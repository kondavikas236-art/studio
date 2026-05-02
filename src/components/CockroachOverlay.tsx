"use client";

import { useEffect, useState } from "react";

interface BugInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  scale: number;
  rotation: number;
}

/**
 * RealisticCockroach - A custom SVG cockroach with reddish-brown gradients,
 * long antennae, and spiky legs.
 */
function RealisticCockroach() {
  return (
    <svg 
      viewBox="0 0 100 150" 
      className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bugGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A0522D" />
          <stop offset="60%" stopColor="#5D2E0A" />
          <stop offset="100%" stopColor="#1A0F03" />
        </radialGradient>
      </defs>
      
      {/* Antennae */}
      <path d="M45 25 Q 35 0 10 5" stroke="#1A0F03" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M55 25 Q 65 0 90 5" stroke="#1A0F03" strokeWidth="1" fill="none" opacity="0.8" />

      {/* Legs - 3 pairs */}
      <g stroke="#1A0F03" strokeWidth="2.5" fill="none" strokeLinecap="round">
        {/* Front */}
        <path d="M35 50 L10 35" />
        <path d="M65 50 L90 35" />
        {/* Middle */}
        <path d="M30 75 L5 75" />
        <path d="M70 75 L95 75" />
        {/* Back */}
        <path d="M35 100 L15 130" />
        <path d="M65 100 L85 130" />
      </g>

      {/* Body */}
      <ellipse cx="50" cy="80" rx="22" ry="48" fill="url(#bugGradient)" />
      
      {/* Texture/Wing Line */}
      <path d="M50 35 L50 125" stroke="#000" strokeWidth="0.8" opacity="0.4" />
      
      {/* Head */}
      <circle cx="50" cy="30" r="10" fill="#1A0F03" />
      
      {/* Eyes */}
      <circle cx="45" cy="28" r="1.5" fill="#333" />
      <circle cx="55" cy="28" r="1.5" fill="#333" />
    </svg>
  );
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);

  useEffect(() => {
    if (active) {
      // Create a swarm of realistic insects
      const newBugs = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: `${Math.random() * 2 + 3}s`, // Slightly faster
        delay: `${Math.random() * 5}s`,
        scale: 0.2 + Math.random() * 0.15, // Better visibility
        rotation: Math.random() * 360,
      }));
      setBugs(newBugs);
    } else {
      setBugs([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="absolute animate-bug-scurry"
          style={{
            top: bug.top,
            left: bug.left,
            animationDuration: bug.duration,
            animationDelay: bug.delay,
            transform: `rotate(${bug.rotation}deg) scale(${bug.scale})`,
            width: "80px",
            height: "120px",
          }}
        >
          <div className="animate-bug-vibrate origin-center w-full h-full">
            <RealisticCockroach />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.2px] pointer-events-none" />
    </div>
  );
}
