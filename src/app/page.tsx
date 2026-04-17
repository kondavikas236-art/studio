
"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ShieldCheck, ChevronRight, LogIn, Smartphone, Eye, Trophy, Sparkles, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If NOT logged in, show the Login/Signup Screen
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background min-h-screen p-6">
        <div className="w-full max-w-md mt-12 mb-12 text-center space-y-4">
          <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-4 animate-float shadow-sm border-2 border-primary/20">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground italic">
            Kids<span className="text-primary">yee</span>
          </h1>
          <p className="text-muted-foreground font-semibold">The Smart Screen Time Guardian</p>
        </div>

        <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="space-y-1 text-center bg-primary/5 p-8">
            <CardTitle className="text-2xl font-black">
              {isSignUp ? "Create Account" : "Parent Login"}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {isSignUp ? "Start protecting your family today" : "Access your secure family dashboard"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuthSubmit}>
            <CardContent className="space-y-4 p-8">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    className="pl-10 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
              <Button type="submit" className="w-full rounded-full h-12 font-bold text-lg shadow-lg">
                {isSignUp ? <><UserPlus className="mr-2 h-5 w-5" /> Sign Up</> : <><LogIn className="mr-2 h-5 w-5" /> Sign In</>}
              </Button>
              <Button
                variant="ghost"
                type="button"
                className="text-sm font-semibold text-primary"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Already have an account? Sign In" : "New to Kidsyee? Create Account"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-12 text-center opacity-40 max-w-xs">
          <p className="text-xs font-bold uppercase tracking-widest">Wellness simplified for modern families.</p>
        </div>
      </div>
    );
  }

  // If LOGGED IN, show the Main Portal Selection
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
            Welcome back! Choose your destination to start your mindful digital journey.
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

          <Link href="/parent/dashboard" className="group">
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
                Manage Family <ShieldCheck className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </Link>
        </div>

        <section className="w-full max-w-4xl space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-foreground flex items-center justify-center gap-2">
              The Kidsyee Cycle <Sparkles className="h-6 w-6 text-accent-foreground" />
            </h2>
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
        </div>
      </div>
    </div>
  );
}
