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

  if (!active || !cockroachImg) return null;

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
            <Image 
              src={cockroachImg.imageUrl} 
              alt="Cockroach" 
              width={100} 
              height={100}
              className="filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
              data-ai-hint={cockroachImg.imageHint}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[1px] animate-pulse" />
    </div>
  );
}