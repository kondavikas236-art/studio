"use client";

import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Trophy } from "lucide-react";
import { CockroachOverlay } from "@/components/CockroachOverlay";
import { useEffect, useState } from "react";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const avatar = PlaceHolderImages.find(img => img.id === 'avatar-buddy');
  const [isBugModeActive, setIsBugModeActive] = useState(false);

  useEffect(() => {
    // Check if parent has enabled bug mode in settings
    const checkSettings = () => {
      const settings = localStorage.getItem('parent-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        // Simulate "time up" after a short delay for demonstration
        if (parsed.enableBugDeterrent) {
           const timer = setTimeout(() => setIsBugModeActive(true), 5000);
           return () => clearTimeout(timer);
        }
      }
    };
    checkSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0 md:flex-row">
      <CockroachOverlay active={isBugModeActive} />
      
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r bg-white/50">
        <div className="p-6">
           <h1 className="text-2xl font-black text-primary italic">MindfulPlay</h1>
        </div>
        <Navigation />
      </div>

      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={avatar?.imageUrl} alt="Avatar" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Good day,</p>
              <p className="text-lg font-bold">Alex Explorer!</p>
            </div>
          </div>
          <div className="bg-accent/20 px-4 py-2 rounded-full flex items-center space-x-2 border border-accent/30">
            <Trophy className="h-5 w-5 text-accent-foreground" />
            <span className="font-black text-accent-foreground">1,240 pts</span>
          </div>
        </header>
        
        <div className="p-6 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
