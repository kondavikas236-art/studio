
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusMeter } from "@/components/FocusMeter";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import { Eye, BookOpen, Star, Sparkles, Timer, Camera, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { generateSmartBreakPrompt, type SmartBreakPromptOutput } from "@/ai/flows/ai-smart-break-prompt";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const DATA = [
  { name: 'Game', mins: 45, color: '#2E8AB8' },
  { name: 'Study', mins: 120, color: '#CFE467' },
  { name: 'Stories', mins: 30, color: '#4FB0C6' },
];

export default function KidDashboard() {
  const [focusValue, setFocusValue] = useState(85);
  const [breakSuggestion, setBreakSuggestion] = useState<SmartBreakPromptOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to see your Explorer Selfie!',
        });
      }
    };

    getCameraPermission();

    // Cleanup stream on unmount
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Simulate low energy after some time
    const timer = setTimeout(async () => {
      setFocusValue(25); // Trigger low focus state
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
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black text-foreground flex items-center gap-2">
            Daily Status <Sparkles className="text-accent-foreground h-8 w-8" />
          </h2>
          <div className="text-right">
            <p className="text-xs font-bold text-muted-foreground uppercase">Explorer Cam</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-primary/20 overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm">
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

          <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-black relative aspect-square lg:aspect-auto">
            <div className={cn(
              "absolute inset-0 z-10 pointer-events-none border-8 rounded-[2.5rem] transition-colors duration-1000",
              isLowFocus ? "border-destructive/40" : "border-primary/20"
            )} />
            
            <video 
              ref={videoRef} 
              className={cn(
                "w-full h-full object-cover transition-all duration-1000",
                isLowFocus ? "grayscale contrast-125 scale-110 blur-[1px]" : "animate-float scale-100",
                !hasCameraPermission && "opacity-20"
              )} 
              autoPlay 
              muted 
              playsInline
            />

            {!hasCameraPermission && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-20">
                <div className="space-y-2">
                  <Camera className="h-12 w-12 text-white/50 mx-auto" />
                  <p className="text-white/80 text-sm font-bold">Enable camera to see your Buddy Selfie!</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className={cn(
                "px-4 py-2 rounded-2xl backdrop-blur-md border flex items-center gap-2",
                isLowFocus 
                  ? "bg-destructive/80 border-destructive text-white animate-pulse" 
                  : "bg-white/80 border-primary/20 text-primary font-bold"
              )}>
                {isLowFocus ? <AlertCircle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                <span className="text-xs uppercase tracking-widest">
                  {isLowFocus ? "Focus Low: Take a Break!" : "Focus High: You're Shining!"}
                </span>
              </div>
            </div>
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
