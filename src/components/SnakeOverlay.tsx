
"use client";

import { useEffect, useState } from "react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import Image from "next/image";

interface SnakeInstance {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  scale: number;
}

export function SnakeOverlay({ active }: { active: boolean }) {
  const [snakes, setSnakes] = useState<SnakeInstance[]>([]);
  const snakeImg = PlaceHolderImages.find(img => img.id === 'snake-image');

  useEffect(() => {
    if (active) {
      const newSnakes = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 80}%`,
        left: `${-20 + Math.random() * 10}%`, // Start slightly off-screen
        duration: `${10 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
        scale: 0.4 + Math.random() * 0.3,
      }));
      setSnakes(newSnakes);
    } else {
      setSnakes([]);
    }
  }, [active]);

  if (!active || !snakeImg) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {snakes.map((snake) => (
        <div
          key={snake.id}
          className="absolute animate-snake-move"
          style={{
            top: snake.top,
            left: snake.left,
            animationDuration: snake.duration,
            animationDelay: snake.delay,
            transform: `scale(${snake.scale})`,
          }}
        >
          <div className="animate-snake-body origin-center">
            <Image 
              src={snakeImg.imageUrl} 
              alt="Snake" 
              width={300} 
              height={300}
              className="mix-blend-multiply brightness-90 contrast-125 filter drop-shadow-2xl"
              data-ai-hint={snakeImg.imageHint}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.1px] pointer-events-none" />
    </div>
  );
}
