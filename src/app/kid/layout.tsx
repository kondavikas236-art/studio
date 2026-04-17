"use client";

import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Trophy, Lock, ShieldCheck, Share2 } from "lucide-react";
import { CockroachOverlay } from "@/components/CockroachOverlay";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find(img => img.id === 'avatar-buddy');
  const [isBugModeActive, setIsBugModeActive] = useState(false);
  const bugTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cockroach mode is suppressed while in the Diary Buddy "Safe Zone"
  const isSafeZone = pathname === "/kid/diary";
  const shouldDisplayBugs = isBugModeActive && !isSafeZone;

  const handleShare = async () => {
    const shareData = {
      title: 'Kidsyee - Eye & Brain Wellness',
      text: 'Check out Kidsyee, the ultimate screen time guardian for kids!',
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link Copied!",
        description: "App link has been copied to your clipboard.",
      });
    }
  };

  const checkSettingsAndSetTimer = () => {
    if (bugTimerRef.current) {
      clearTimeout(bugTimerRef.current);
      bugTimerRef.current = null;
    }

    const savedSettings = localStorage.getItem('parent-settings');
    let settings = { enableBugDeterrent: true, eyeBreakInterval: 20 }; // Default for testing
    
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
      localStorage.setItem('parent-settings', JSON.stringify(settings));
    }

    if (settings.enableBugDeterrent) {
      const intervalSeconds = settings.eyeBreakInterval || 20;
      bugTimerRef.current = setTimeout(() => {
        setIsBugModeActive(true);
      }, intervalSeconds * 1000);
    }
  };

  useEffect(() => {
    checkSettingsAndSetTimer();

    const handleBreakCompleted = () => {
      setIsBugModeActive(false);
      checkSettingsAndSetTimer();
    };

    window.addEventListener('mindful-play:break-completed', handleBreakCompleted);

    return () => {
      if (bugTimerRef.current) clearTimeout(bugTimerRef.current);
      window.removeEventListener('mindful-play:break-completed', handleBreakCompleted);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0 md:flex-row relative overflow-x-hidden">
      <CockroachOverlay active={shouldDisplayBugs} />
      
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r bg-white/50 backdrop-blur-sm">
        <div className="p-8">
           <Link href="/">
             <h1 className="text-2xl font-black text-primary italic hover:scale-105 transition-transform cursor-pointer flex items-center gap-2">
               <ShieldCheck className="h-6 w-6" /> Kidsyee
             </h1>
           </Link>
        </div>
        <Navigation />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-auto scrollbar-hide">
        <header className="flex justify-between items-center p-5 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary ring-2 ring-primary/5">
              <AvatarImage src={avatar?.imageUrl} alt="Explorer Avatar" />
              <AvatarFallback>EX</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Kid Mode</p>
              <p className="text-base font-black tracking-tight leading-none">Alex (Explorer)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden xs:flex bg-accent/20 px-3 py-1.5 rounded-full items-center space-x-2 border border-accent/30 shadow-sm">
              <Trophy className="h-4 w-4 text-accent-foreground" />
              <span className="font-black text-xs text-accent-foreground">1.2k</span>
            </div>
            
            <Link href="/parent/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary">
                <Lock className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full">
          {children}
        </div>

        <div className="fixed bottom-24 left-6 z-[60] md:bottom-6 md:left-72">
          <Button 
            onClick={handleShare} 
            size="icon" 
            className="h-14 w-14 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-primary text-white hover:scale-110 active:scale-90 transition-all flex items-center justify-center border-2 border-white/20"
          >
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </main>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
