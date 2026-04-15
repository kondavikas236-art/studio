
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ShieldAlert, Bug, Bell, Clock, Mail, Loader2, Smartphone, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

export default function ParentSettings() {
  const { user } = useUser();
  const db = useFirestore();

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile, isLoading } = useDoc(parentRef);

  const [settings, setSettings] = useState({
    dailyLimit: 120,
    enableBugDeterrent: false,
    eyeBreakInterval: 20,
    notificationsEnabled: true,
    receiveWeeklyReportEmail: false,
    weeklyReportDayOfWeek: "Monday",
    weeklyReportSendTime: "09:00",
    backgroundMonitoring: true,
    blockSocialMedia: true,
    blockVideoApps: true,
  });

  useEffect(() => {
    if (parentProfile) {
      setSettings((prev) => ({
        ...prev,
        receiveWeeklyReportEmail: parentProfile.receiveWeeklyReportEmail || false,
        weeklyReportDayOfWeek: parentProfile.weeklyReportDayOfWeek || "Monday",
        weeklyReportSendTime: parentProfile.weeklyReportSendTime || "09:00",
      }));
    }
    const saved = localStorage.getItem('parent-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings from local storage", e);
      }
    }
  }, [parentProfile]);

  const handleSave = () => {
    if (!parentRef || !user) return;

    setDocumentNonBlocking(parentRef, {
      id: user.uid,
      receiveWeeklyReportEmail: settings.receiveWeeklyReportEmail,
      weeklyReportDayOfWeek: settings.weeklyReportDayOfWeek,
      weeklyReportSendTime: settings.weeklyReportSendTime,
      firstName: parentProfile?.firstName || user.displayName?.split(' ')[0] || "Parent",
      lastName: parentProfile?.lastName || user.displayName?.split(' ').slice(1).join(' ') || "",
      email: user.email || "",
    }, { merge: true });

    localStorage.setItem('parent-settings', JSON.stringify(settings));

    toast({
      title: "Device Policy Saved!",
      description: "Cockroach mode and Health Breaks updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Control Center <ShieldCheck className="text-primary h-8 w-8" />
        </h2>
        <p className="text-muted-foreground">Configure boundaries and healthy habits for your family</p>
      </div>

      <Alert className="bg-primary/5 border-primary/20 rounded-2xl">
        <Smartphone className="h-4 w-4" />
        <AlertTitle className="font-bold">Prototyping Note</AlertTitle>
        <AlertDescription className="text-sm">
          Background monitoring and Cockroach mode are simulated in this prototype. Health Breaks are scaled to seconds for testing.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-accent-foreground" />
              <CardTitle>Health Breaks</CardTitle>
            </div>
            <CardDescription>How often should your child take a break? (Triggers Cockroach mode)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="font-bold">Health Break Interval</Label>
              <span className="font-bold text-accent-foreground">{settings.eyeBreakInterval} Minutes</span>
            </div>
            <Slider 
              value={[settings.eyeBreakInterval]} 
              onValueChange={([val]) => setSettings({...settings, eyeBreakInterval: val})} 
              max={60} 
              min={10}
              step={5} 
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm border-l-4 border-l-destructive overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-5 w-5 text-destructive" />
              <CardTitle>Cockroach mode</CardTitle>
            </div>
            <CardDescription>Trigger visual "invasions" when Health Break time is reached.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Enable Cockroach Mode</Label>
                <p className="text-sm text-muted-foreground">Bugs appear on screen at each Health Break interval.</p>
              </div>
              <Switch 
                checked={settings.enableBugDeterrent} 
                onCheckedChange={(val) => setSettings({...settings, enableBugDeterrent: val})} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Daily Time Limits</CardTitle>
            </div>
            <CardDescription>Set the maximum allowed screen time per day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="font-bold">Total Screen Time Limit</Label>
              <span className="font-bold text-primary">{Math.floor(settings.dailyLimit / 60)}h {settings.dailyLimit % 60}m</span>
            </div>
            <Slider 
              value={[settings.dailyLimit]} 
              onValueChange={([val]) => setSettings({...settings, dailyLimit: val})} 
              max={360} 
              step={15} 
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>App Enforcement</CardTitle>
            </div>
            <CardDescription>Simulate monitoring and restricting specific categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
              <Label className="font-bold">Monitor Video Apps</Label>
              <Switch 
                checked={settings.blockVideoApps} 
                onCheckedChange={(val) => setSettings({...settings, blockVideoApps: val})} 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
              <Label className="font-bold">Monitor Social Media</Label>
              <Switch 
                checked={settings.blockSocialMedia} 
                onCheckedChange={(val) => setSettings({...settings, blockSocialMedia: val})} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Reports</CardTitle>
            </div>
            <CardDescription>Receive weekly digital wellness summaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Weekly Report Email</Label>
                <p className="text-sm text-muted-foreground">Get a detailed PDF report every week.</p>
              </div>
              <Switch 
                checked={settings.receiveWeeklyReportEmail} 
                onCheckedChange={(val) => setSettings({...settings, receiveWeeklyReportEmail: val})} 
              />
            </div>

            {settings.receiveWeeklyReportEmail && (
              <div className="pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Delivery Day</Label>
                    <Select 
                      value={settings.weeklyReportDayOfWeek} 
                      onValueChange={(val) => setSettings({...settings, weeklyReportDayOfWeek: val})}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Time</Label>
                    <Input 
                      type="time" 
                      value={settings.weeklyReportSendTime}
                      onChange={(e) => setSettings({...settings, weeklyReportSendTime: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={() => window.location.reload()} className="rounded-full">Discard Changes</Button>
          <Button size="lg" className="rounded-full px-8 font-bold" onClick={handleSave}>Save Device Policy</Button>
        </div>
      </div>
    </div>
  );
}
