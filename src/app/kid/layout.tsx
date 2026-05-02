"use client";

import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Lock, Loader2 } from "lucide-react";
import { SnakeOverlay } from "@/components/SnakeOverlay";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useFirebase, useUser, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { KidsyeeLogo, KidsyeeTextLogo } from "@/components/Logo";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore: db } = useFirebase();
  const avatar = PlaceHolderImages.find(img => img.id === 'avatar-buddy');
  
  const [isSnakeModeActive, setIsSnakeModeActive] = useState(false);
  const [simulatedUsageMinutes, setSimulatedUsageMinutes] = useState(200); // High simulated usage to trigger limit immediately
  const snakeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: childrenData, isLoading: isChildrenLoading } = useCollection(childrenQuery);
  const child = childrenData?.[0];
  const explorerName = child?.name || "Explorer";

  const childRef = useMemoFirebase(() => {
    if (!db || !user || !child?.id) return null;
    return doc(db, "parentProfiles", user.uid, "childProfiles", child.id);
  }, [db, user, child?.id]);

  const { data: liveChild } = useDoc(childRef);

  const isSafeZone = pathname === "/kid/eye-health";
  
  // Logic to show snakes: limit is reached, we aren't in a safe zone (like Eye Gym), and mode is enabled.
  const limitReached = simulatedUsageMinutes >= (liveChild?.dailyScreenTimeLimitMinutes || 120);
  const shouldDisplaySnakes = isSnakeModeActive && limitReached && !isSafeZone;

  const checkSettingsAndSetTimer = () => {
    if (snakeTimerRef.current) {
      clearTimeout(snakeTimerRef.current);
      snakeTimerRef.current = null;
    }
    
    const savedSettings = localStorage.getItem('parent-settings');
    let settings = { enableSnakeDeterrent: true, eyeBreakInterval: 20 };
    if (savedSettings) {
      try { settings = JSON.parse(savedSettings); } catch (e) {}
    }

    if (settings.enableSnakeDeterrent) {
      // Small delay before snakes appear for dramatic effect
      snakeTimerRef.current = setTimeout(() => {
        setIsSnakeModeActive(true);
      }, 3000);
    }
  };

  useEffect(() => {
    checkSettingsAndSetTimer();
    
    const handleBreakCompleted = () => {
      setIsSnakeModeActive(false);
      setSimulatedUsageMinutes(0);
      checkSettingsAndSetTimer();
    };

    window.addEventListener('mindful-play:break-completed', handleBreakCompleted);
    return () => {
      if (snakeTimerRef.current) clearTimeout(snakeTimerRef.current);
      window.removeEventListener('mindful-play:break-completed', handleBreakCompleted);
    };
  }, []);

  if (isAuthLoading || isChildrenLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0 md:flex-row relative overflow-x-hidden">
      <SnakeOverlay active={shouldDisplaySnakes} />
      
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r bg-white/50 backdrop-blur-sm">
        <div className="p-8">
           <Link href="/">
             <div className="flex flex-col items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
                <KidsyeeLogo className="h-12 w-12 text-primary" />
                <KidsyeeTextLogo className="text-2xl" />
             </div>
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
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Eye Data</p>
              <p className="text-base font-black tracking-tight leading-none">{explorerName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
      </main>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
