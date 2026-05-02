"use client";

import { useEffect, useState } from "react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import Image from "next/image";

interface SnakeInstance {
  id: number;
  top: string;
  duration: string;
  delay: string;
  scale: number;
}

export function SnakeOverlay({ active }: { active: boolean }) {
  const [snakes, setSnakes] = useState<SnakeInstance[]>([]);
  const snakeImg = PlaceHolderImages.find(img => img.id === 'snake-image');

  useEffect(() => {
    if (active) {
      // Create a few snakes that will slither across
      const newSnakes = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        top: `${10 + Math.random() * 70}%`, // Stay away from extreme top/bottom
        duration: `${12 + Math.random() * 8}s`,
        delay: `${Math.random() * 10}s`,
        scale: 0.5 + Math.random() * 0.4,
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
          className="absolute animate-snake-move left-0"
          style={{
            top: snake.top,
            animationDuration: snake.duration,
            animationDelay: snake.delay,
          }}
        >
          <div 
            className="animate-snake-body origin-center"
            style={{ transform: `scale(${snake.scale})` }}
          >
            <Image 
              src={snakeImg.imageUrl} 
              alt="Slithering Snake" 
              width={400} 
              height={400}
              className="mix-blend-multiply brightness-90 contrast-125 filter drop-shadow-2xl"
              data-ai-hint="top-down snake"
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] pointer-events-none" />
    </div>
  );
}
