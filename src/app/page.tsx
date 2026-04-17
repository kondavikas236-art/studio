
"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ShieldCheck, ChevronRight, LogIn, Smartphone, Eye, Trophy, Sparkles, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc } from "firebase/firestore";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile } = useDoc(parentRef);

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

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background min-h-screen p-6">
        <div className="w-full max-w-md mt-12 mb-12 text-center space-y-4">
          <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-4 animate-float shadow-sm border-2 border-primary/20">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground italic leading-none">
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
      </div>
    );
  }

  const parentName = parentProfile?.firstName || "Parent";

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
            Welcome back, {parentName}! Choose your destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-24">
          <Link href="/kid/dashboard" className="group">
            <div className="h-full bg-card border-4 border-primary/20 p-10 rounded-[3rem] transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="p-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <Gamepad2 className="h-20 w-20" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black">Kid Zone</h2>
                <p className="text-muted-foreground font-medium text-lg">Track focus and complete quests!</p>
              </div>
              <Button size="lg" className="w-full rounded-full text-xl h-16 font-black shadow-xl group-hover:scale-105 transition-transform">
                Let's Play <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </Link>

          <Link href="/parent/dashboard" className="group">
            <div className="h-full bg-card border-4 border-accent/20 p-10 rounded-[3rem] transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="p-8 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500 shadow-inner">
                <ShieldCheck className="h-20 w-20" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black">Parent Portal</h2>
                <p className="text-muted-foreground font-medium text-lg">Manage limits and view insights.</p>
              </div>
              <Button variant="secondary" size="lg" className="w-full rounded-full text-xl h-16 font-black shadow-xl group-hover:scale-105 transition-transform border-2 border-accent/20">
                Manage Family <ShieldCheck className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
