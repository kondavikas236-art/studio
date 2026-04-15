
"use client";

import { Navigation } from "@/components/Navigation";
import { ShieldCheck, Bell, Gamepad2, LogOut, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

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
        description: "App link has been copied to your clipboard. Send it to your friend!",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <header className="h-20 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
           <Link href="/" className="flex items-center space-x-2 group">
             <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-md">
                <ShieldCheck className="h-5 w-5" />
             </div>
             <h1 className="text-xl font-black tracking-tighter text-foreground">
               Kids<span className="text-primary">yee</span>
             </h1>
           </Link>
        </div>
        
        <div className="flex items-center space-x-4">
           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShare} className="text-muted-foreground hover:text-primary">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Kidsyee</p>
                </TooltipContent>
              </Tooltip>
           </TooltipProvider>

           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/kid/dashboard">
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-primary/20 hover:bg-primary/5 text-primary font-bold">
                      <Gamepad2 className="mr-2 h-4 w-4" /> Kid Zone
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to Child Dashboard</p>
                </TooltipContent>
              </Tooltip>
           </TooltipProvider>

           <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
           </Button>
           
           <div className="flex items-center gap-2">
             <div className="h-10 w-10 rounded-full bg-primary/5 border-2 border-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm">
               {user.email?.substring(0, 2).toUpperCase() || "JD"}
             </div>
             <Button variant="ghost" size="icon" onClick={() => signOut(auth)} className="text-muted-foreground hover:text-destructive">
               <LogOut className="h-5 w-5" />
             </Button>
           </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="hidden md:block w-64 border-r bg-white p-6">
          <div className="mb-8 px-4 py-2">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operations</h2>
          </div>
          <Navigation />
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-auto">
          {children}
        </main>
      </div>
      
      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
