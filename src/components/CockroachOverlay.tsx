
"use client";

import { useEffect, useState } from "react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import Image from "next/image";

interface BugInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  scale: number;
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);
  const cockroachImg = PlaceHolderImages.find(img => img.id === 'cockroach-image');

  useEffect(() => {
    if (active) {
      // Increase bug count for a more "active" infestation feel
      const newBugs = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: `${Math.random() * 5 + 5}s`, // Faster scurry
        delay: `${Math.random() * 3}s`,
        scale: 0.4 + Math.random() * 0.4, // Smaller, more realistic size
      }));
      setBugs(newBugs);
    } else {
      setBugs([]);
    }
  }, [active]);

  if (!active || !cockroachImg) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          className="absolute animate-bug-scurry"
          style={{
            top: bug.top,
            left: bug.left,
            animationDuration: bug.duration,
            animationDelay: bug.delay,
            transform: `scale(${bug.scale})`,
          }}
        >
          <div className="animate-bug-vibrate origin-center">
            <Image 
              src={cockroachImg.imageUrl} 
              alt="Cockroach" 
              width={60} 
              height={60}
              className="filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] brightness-75 contrast-125"
              data-ai-hint={cockroachImg.imageHint}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/5 backdrop-blur-[0.5px] animate-pulse" />
    </div>
  );
}
