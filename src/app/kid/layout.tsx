"use client";

import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Trophy, Lock, ShieldCheck } from "lucide-react";
import { CockroachOverlay } from "@/components/CockroachOverlay";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const avatar = PlaceHolderImages.find(img => img.id === 'avatar-buddy');
  const [isBugModeActive, setIsBugModeActive] = useState(false);
  const bugTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSettings = () => {
      // Clear any existing timer
      if (bugTimerRef.current) {
        clearTimeout(bugTimerRef.current);
        bugTimerRef.current = null;
      }

      const settingsStr = localStorage.getItem('parent-settings');
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          if (settings.enableBugDeterrent) {
             const triggerDelayMs = (settings.eyeBreakInterval || 20) * 1000;
             if (!isBugModeActive) {
               bugTimerRef.current = setTimeout(() => {
                 setIsBugModeActive(true);
               }, triggerDelayMs);
             }
          }
        } catch (e) {
          console.error("Failed to parse settings", e);
        }
      }
    };

    checkSettings();

    const handleBreakCompleted = () => {
      setIsBugModeActive(false);
      checkSettings();
    };

    window.addEventListener('mindful-play:break-completed', handleBreakCompleted);

    return () => {
      if (bugTimerRef.current) clearTimeout(bugTimerRef.current);
      window.removeEventListener('mindful-play:break-completed', handleBreakCompleted);
    };
  }, [isBugModeActive]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0 md:flex-row relative">
      <CockroachOverlay active={isBugModeActive} />
      
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r bg-white/50 backdrop-blur-sm">
        <div className="p-8">
           <Link href="/">
             <h1 className="text-2xl font-black text-primary italic hover:scale-105 transition-transform cursor-pointer flex items-center gap-2">
               <ShieldCheck className="h-6 w-6" /> ScreenGuard
             </h1>
           </Link>
        </div>
        <Navigation />
      </div>

      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-md border-b sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary ring-4 ring-primary/5">
              <AvatarImage src={avatar?.imageUrl} alt="Avatar" />
              <AvatarFallback>SG</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Explorer</p>
              <p className="text-lg font-black tracking-tight">Alex Buddy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-accent/20 px-4 py-2 rounded-full items-center space-x-2 border border-accent/30 shadow-sm">
              <Trophy className="h-5 w-5 text-accent-foreground" />
              <span className="font-black text-accent-foreground">1,240 pts</span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary">
                      <Lock className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Parent Access</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
