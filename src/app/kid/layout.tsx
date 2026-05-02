"use client";

import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { CockroachOverlay } from "@/components/CockroachOverlay";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useFirebase, useUser, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore: db } = useFirebase();
  const avatar = PlaceHolderImages.find(img => img.id === 'avatar-buddy');
  
  const [isBugModeActive, setIsBugModeActive] = useState(false);
  const [simulatedUsageMinutes, setSimulatedUsageMinutes] = useState(130); // Default simulated high usage for demo
  const bugTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch children to get current kid
  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: childrenData, isLoading: isChildrenLoading } = useCollection(childrenQuery);
  const child = childrenData?.[0];
  const explorerName = child?.name || "Explorer";

  // Watch specifically for this child's profile to get latest limits
  const childRef = useMemoFirebase(() => {
    if (!db || !user || !child?.id) return null;
    return doc(db, "parentProfiles", user.uid, "childProfiles", child.id);
  }, [db, user, child?.id]);

  const { data: liveChild } = useDoc(childRef);

  const isSafeZone = pathname === "/kid/eye-health";
  
  // Cockroach Mode Logic:
  // 1. Parent must have enabled it in settings.
  // 2. Kid must be outside a "Safe Zone" (like eye-health gym).
  // 3. Simulated/Actual usage must exceed the parent-set limit.
  const limitReached = simulatedUsageMinutes >= (liveChild?.dailyScreenTimeLimitMinutes || 120);
  const shouldDisplayBugs = isBugModeActive && limitReached && !isSafeZone;

  const checkSettingsAndSetTimer = () => {
    if (bugTimerRef.current) {
      clearTimeout(bugTimerRef.current);
      bugTimerRef.current = null;
    }
    
    const savedSettings = localStorage.getItem('parent-settings');
    let settings = { enableBugDeterrent: true, eyeBreakInterval: 20 };
    if (savedSettings) {
      try { settings = JSON.parse(savedSettings); } catch (e) {}
    }

    if (settings.enableBugDeterrent) {
      // For demo purposes, we trigger "Bug Mode" intent after a short interval
      // but the actual bugs only show if limitReached is also true.
      bugTimerRef.current = setTimeout(() => {
        setIsBugModeActive(true);
      }, 5000); // Trigger check after 5s
    }
  };

  useEffect(() => {
    checkSettingsAndSetTimer();
    
    const handleBreakCompleted = () => {
      setIsBugModeActive(false);
      setSimulatedUsageMinutes(0); // Reset simulated usage after a break
      checkSettingsAndSetTimer();
    };

    window.addEventListener('mindful-play:break-completed', handleBreakCompleted);
    return () => {
      if (bugTimerRef.current) clearTimeout(bugTimerRef.current);
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