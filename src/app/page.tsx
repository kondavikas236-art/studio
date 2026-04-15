
"use client";

import Link from "next/link";
import { Gamepad2, ShieldCheck, HeartPulse, ChevronRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background overflow-hidden min-h-screen">
      <div className="text-center space-y-4 max-w-2xl mb-12 animate-in fade-in zoom-in duration-700">
        <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-4 animate-float shadow-sm">
          <HeartPulse className="h-14 w-14 text-primary" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-foreground md:text-8xl italic leading-none">
          Mindful <span className="text-primary">Play</span>
        </h1>
        <p className="text-xl text-muted-foreground font-semibold max-w-lg mx-auto leading-relaxed">
          The digital bridge between screen time and the real world. Healthy habits for a brighter future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <Link href="/kid/dashboard" className="group">
          <div className="h-full bg-card border-4 border-primary/20 p-10 rounded-[3rem] kid-card-hover flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Gamepad2 className="h-32 w-32 -mr-12 -mt-12" />
            </div>
            <div className="p-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
              <Gamepad2 className="h-20 w-20" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black">Kid Zone</h2>
              <p className="text-muted-foreground font-medium text-lg">Track focus, complete quests, and earn rewards!</p>
            </div>
            <Button size="lg" className="w-full rounded-full text-xl h-16 font-black shadow-xl group-hover:scale-105 transition-transform">
              Let's Play <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </Link>

        <Link href={user ? "/parent/dashboard" : "/login"} className="group">
          <div className="h-full bg-card border-4 border-accent/20 p-10 rounded-[3rem] kid-card-hover flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <ShieldCheck className="h-32 w-32 -mr-12 -mt-12" />
            </div>
            <div className="p-8 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500 shadow-inner">
              <ShieldCheck className="h-20 w-20" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black">Parent Portal</h2>
              <p className="text-muted-foreground font-medium text-lg">Manage limits, view insights, and keep them safe.</p>
            </div>
            <Button variant="secondary" size="lg" className="w-full rounded-full text-xl h-16 font-black shadow-xl group-hover:scale-105 transition-transform border-2 border-accent/20">
              {user ? "Go to Dashboard" : "Secure Access"} <ShieldCheck className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center space-y-2 opacity-60">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Mindful Play Protocol v1.0</p>
        <p className="text-xs">Trusted by 10,000+ mindful families worldwide.</p>
      </div>
    </div>
  );
}
