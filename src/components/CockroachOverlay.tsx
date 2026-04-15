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
      const newBugs = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        duration: `${Math.random() * 10 + 10}s`,
        delay: `${Math.random() * 5}s`,
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
            <Bug className="h-8 w-8 text-amber-900 opacity-80" fill="#451a03" />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[1px] animate-pulse pointer-events-none" />
    </div>
  );
}
