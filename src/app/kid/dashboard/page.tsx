
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusMeter } from "@/components/FocusMeter";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import { Eye, BookOpen, Gamepad2, Star, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { generateSmartBreakPrompt, type SmartBreakPromptOutput } from "@/ai/flows/ai-smart-break-prompt";
import { toast } from "@/hooks/use-toast";

const DATA = [
  { name: 'Game', mins: 45, color: '#2E8AB8' },
  { name: 'Study', mins: 120, color: '#CFE467' },
  { name: 'Stories', mins: 30, color: '#4FB0C6' },
];

export default function KidDashboard() {
  const [focusValue, setFocusValue] = useState(85);
  const [breakSuggestion, setBreakSuggestion] = useState<SmartBreakPromptOutput | null>(null);

  useEffect(() => {
    // Simulate low energy after some time or specific actions
    const timer = setTimeout(async () => {
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-foreground flex items-center gap-2">
          Daily Status <Sparkles className="text-accent-foreground h-8 w-8" />
        </h2>
        <Card className="rounded-[2.5rem] border-primary/20 overflow-hidden shadow-xl">
          <CardContent className="p-8 space-y-8">
            <FocusMeter value={focusValue} label="Focus Meter" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="bg-primary/10 p-4 rounded-3xl inline-block mb-1">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">Screen Time</p>
                <p className="text-xl font-black">3h 15m</p>
              </div>
              <div className="space-y-1">
                <div className="bg-accent/10 p-4 rounded-3xl inline-block mb-1">
                  <Eye className="h-6 w-6 text-accent-foreground" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">Eye Rests</p>
                <p className="text-xl font-black">4/5</p>
              </div>
              <div className="space-y-1">
                <div className="bg-blue-100 p-4 rounded-3xl inline-block mb-1">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">Missions</p>
                <p className="text-xl font-black">2 Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/kid/eye-health">
            <Card className="rounded-3xl border-2 border-transparent hover:border-primary/40 transition-all kid-card-hover cursor-pointer group">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Eye className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">Eye Mission</CardTitle>
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
        <h2 className="text-2xl font-bold">Today&apos;s Play Mix</h2>
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
