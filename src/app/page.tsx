"use client";

import Link from "next/link";
import { Gamepad2, ShieldCheck, HeartPulse, ChevronRight, LogIn, Smartphone, Eye, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user } = useUser();

  const steps = [
    {
      icon: Smartphone,
      title: "Set Boundaries",
      desc: "Create a child profile and set the Health Break interval in the Parent Portal."
    },
    {
      icon: Eye,
      title: "Active Protection",
      desc: "Switch to Kid Zone. If the limit is reached, Cockroach Mode triggers automatically."
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      desc: "Your child clears the bugs by completing fun Eye Gym missions and building healthy habits."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background min-h-screen">
      <div className="w-full max-w-6xl px-6 py-20 flex flex-col items-center">
        <div className="text-center space-y-4 max-w-3xl mb-16 animate-in fade-in zoom-in duration-700">
          <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-4 animate-float shadow-sm border-2 border-primary/20">
            <ShieldCheck className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground md:text-8xl italic leading-none">
            Kids<span className="text-primary">yee</span>
          </h1>
          <p className="text-xl text-muted-foreground font-semibold max-w-xl mx-auto leading-relaxed">
            The pediatric digital bridge between screen time and wellness. Protect eyes, boost brains, and build lasting habits with a fun twist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-24">
          <Link href="/kid/dashboard" className="group">
            <div className="h-full bg-card border-4 border-primary/20 p-10 rounded-[3rem] transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
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
            <div className="h-full bg-card border-4 border-accent/20 p-10 rounded-[3rem] transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
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

        <section className="w-full max-w-4xl space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-foreground flex items-center justify-center gap-2">
              How it Works <Sparkles className="h-6 w-6 text-accent-foreground" />
            </h2>
            <p className="text-muted-foreground font-bold">The Kidsyee Protection Cycle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card key={i} className="rounded-[2.5rem] border-none shadow-lg bg-white/50 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute -top-4 -left-4 text-primary/5 font-black text-8xl group-hover:text-primary/10 transition-colors">
                    {i + 1}
                  </div>
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{step.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mt-24 text-center space-y-2 opacity-60">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Kidsyee Wellness v1.0</p>
          <p className="text-xs font-medium">Trusted by thousands of mindful families worldwide.</p>
        </div>
      </div>
    </div>
  );
}
