"use client";

import { Bug } from "lucide-react";
import { useEffect, useState } from "react";

interface BugInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
}

export function CockroachOverlay({ active }: { active: boolean }) {
  const [bugs, setBugs] = useState<BugInstance[]>([]);

  useEffect(() => {
    if (active) {
      // Increased count slightly for more "invasion" feel, but larger size means we need fewer to be effective
      const newBugs = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: `${Math.random() * 8 + 8}s`, // Slightly faster movement
        delay: `${Math.random() * 3}s`,
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
          <div className="animate-bug-skitter">
            {/* Sized up to h-20 w-20 for much larger presence */}
            <Bug 
              className="h-20 w-20 text-amber-950 opacity-90 drop-shadow-2xl filter brightness-50" 
              fill="#2d1a0a" 
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/5 backdrop-blur-[0.5px] animate-pulse pointer-events-none" />
    </div>
  );
}