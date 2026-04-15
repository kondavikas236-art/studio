"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusMeter } from "@/components/FocusMeter";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import { Eye, BookOpen, Star, Sparkles, Timer, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { generateSmartBreakPrompt, type SmartBreakPromptOutput } from "@/ai/flows/ai-smart-break-prompt";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DATA = [
  { name: 'Game', mins: 45, color: '#2E8AB8' },
  { name: 'Study', mins: 120, color: '#CFE467' },
  { name: 'Stories', mins: 30, color: '#4FB0C6' },
];

export default function KidDashboard() {
  const [focusValue, setFocusValue] = useState(85);
  const [breakSuggestion, setBreakSuggestion] = useState<SmartBreakPromptOutput | null>(null);

  useEffect(() => {
    // Simulate low focus after 8 seconds
    const timer = setTimeout(async () => {
      setFocusValue(25);
      const output = await generateSmartBreakPrompt({
        childName: "Alex",
        screenTimeMinutes: 195,
        lastActivityCategory: "Educational",
        isEyeRestNeeded: true
      });
      setBreakSuggestion(output);
      
      toast({
        title: "Buddy Check-in! ✨",
        description: output.suggestionText,
        duration: 10000,
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const isLowFocus = focusValue < 30;

  return (
    <div className="space-y-8 pb-12">
      {/* Eye Wellness Animation Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white to-primary/5 p-8 border-4 border-white shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={cn(
            "p-8 rounded-full bg-white shadow-inner relative transition-all duration-700",
            isLowFocus ? "ring-8 ring-destructive/20" : "ring-8 ring-accent/20"
          )}>
            <div className={cn(
              "relative z-10 transition-colors duration-700",
              isLowFocus ? "text-destructive animate-eye-strained" : "text-green-500 animate-eye-healthy"
            )}>
              <Eye className="h-24 w-24" />
            </div>
            
            {/* Visual background effect */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-700",
              isLowFocus ? "bg-destructive animate-pulse" : "bg-green-500"
            )} />
          </div>

          <div className="space-y-2 max-w-lg">
            <h2 className={cn(
              "text-3xl font-black italic tracking-tight transition-colors duration-700",
              isLowFocus ? "text-destructive" : "text-primary"
            )}>
              {isLowFocus ? "Eyes need a break!" : "Your eyes are feeling great!"}
            </h2>
            <p className="text-muted-foreground font-semibold">
              {isLowFocus 
                ? "They've been looking at the screen for a long time. Let's rest them!" 
                : "Looking good, Explorer! Remember to blink often and look far away."}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
            My Focus Meter <Sparkles className="text-accent-foreground h-6 w-6" />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="rounded-[2.5rem] border-primary/20 overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-8">
              <div className="max-w-3xl mx-auto">
                <FocusMeter value={focusValue} label="Current Energy" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
                <div className="space-y-1">
                  <div className="bg-primary/10 p-4 rounded-3xl inline-block mb-1">
                    <Timer className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Screen Time</p>
                  <p className="text-2xl font-black">3h 15m</p>
                </div>
                <div className="space-y-1">
                  <div className="bg-accent/10 p-4 rounded-3xl inline-block mb-1">
                    <Eye className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Eye Rests</p>
                  <p className="text-2xl font-black">4/5</p>
                </div>
                <div className="space-y-1">
                  <div className="bg-blue-100 p-4 rounded-3xl inline-block mb-1">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Missions</p>
                  <p className="text-2xl font-black">2 Done</p>
                </div>
              </div>

              {isLowFocus && (
                <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-300">
                  <div className="p-3 bg-destructive rounded-2xl text-white">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-destructive text-lg">Recharge Needed!</h3>
                    <p className="text-destructive/80 font-bold">Try the 'Eye Gym' or look at the horizon for 20 seconds.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/kid/eye-health">
            <Card className="rounded-3xl border-2 border-transparent hover:border-primary/40 transition-all kid-card-hover cursor-pointer group">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">Eye Gym</CardTitle>
                  <p className="text-sm text-muted-foreground">Give your eyes a holiday</p>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/kid/story-chain">
            <Card className="rounded-3xl border-2 border-transparent hover:border-accent/40 transition-all kid-card-hover cursor-pointer group">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">Story Time</CardTitle>
                  <p className="text-sm text-muted-foreground">Write a tale with AI Buddy</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Today's Play Mix</h2>
        <Card className="rounded-3xl border-none shadow-lg bg-white/50">
          <CardContent className="p-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                  <Bar dataKey="mins" radius={[10, 10, 0, 0]}>
                    {DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
