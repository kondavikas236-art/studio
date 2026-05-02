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
  rotation: number;
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);
  const cockroachImg = PlaceHolderImages.find(img => img.id === 'cockroach-image');

  useEffect(() => {
    if (active) {
      // Create a swarm of lifelike bugs
      const newBugs = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 95}%`,
        duration: `${Math.random() * 3 + 4}s`,
        delay: `${Math.random() * 4}s`,
        scale: 0.12 + Math.random() * 0.1, // Lifelike small size
        rotation: Math.random() * 360,
      }));
      setBugs(newBugs);
    } else {
      setBugs([]);
    }
  }, [active]);

  if (!active || !cockroachImg) return null;

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
          }}
        >
          <div className="animate-bug-vibrate origin-center">
            <Image 
              src={cockroachImg.imageUrl} 
              alt="Realistic Cockroach" 
              width={300} 
              height={300}
              className="mix-blend-multiply contrast-125 brightness-90 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
              data-ai-hint="realistic cockroach"
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.3px] pointer-events-none" />
    </div>
  );
}
