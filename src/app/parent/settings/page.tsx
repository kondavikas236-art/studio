"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ShieldAlert, Bug, Bell, Clock, Mail, Loader2, Smartphone, ShieldCheck, User, Send, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { generateWeeklyReport } from "@/ai/flows/ai-weekly-report-flow";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ParentSettings() {
  const { user } = useUser();
  const db = useFirestore();

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile, isLoading } = useDoc(parentRef);

  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: children } = useCollection(childrenQuery);

  const [settings, setSettings] = useState({
    firstName: "",
    lastName: "",
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

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [testReport, setTestReport] = useState<{ subject: string, body: string } | null>(null);

  useEffect(() => {
    if (parentProfile) {
      setSettings((prev) => ({
        ...prev,
        firstName: parentProfile.firstName || "",
        lastName: parentProfile.lastName || "",
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
      firstName: settings.firstName,
      lastName: settings.lastName,
      receiveWeeklyReportEmail: settings.receiveWeeklyReportEmail,
      weeklyReportDayOfWeek: settings.weeklyReportDayOfWeek,
      weeklyReportSendTime: settings.weeklyReportSendTime,
      email: user.email || "",
      isPro: parentProfile?.isPro || false,
    }, { merge: true });

    localStorage.setItem('parent-settings', JSON.stringify(settings));

    toast({
      title: "Profile Updated!",
      description: "Your parent profile and device policies have been saved.",
    });
  };

  const handleTriggerTestReport = async () => {
    if (!children || children.length === 0) {
      toast({
        variant: "destructive",
        title: "No Profiles Found",
        description: "Please add a child profile before testing reports.",
      });
      return;
    }

    setIsReportLoading(true);
    try {
      const reportData = {
        parentName: settings.firstName || "Parent",
        children: children.map(c => ({
          name: c.name,
          usageMinutes: Math.floor(Math.random() * 500) + 200, // Simulated weekly data
          missionsCompleted: Math.floor(Math.random() * 10) + 2,
          diaryEntries: Math.floor(Math.random() * 7),
          healthStatus: (['excellent', 'good', 'needs_attention'] as const)[Math.floor(Math.random() * 3)],
        })),
      };

      const result = await generateWeeklyReport(reportData);
      setTestReport({ subject: result.emailSubject, body: result.emailBody });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Report Failed",
        description: "Could not generate test report. Please try again.",
      });
    } finally {
      setIsReportLoading(false);
    }
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Control Center <ShieldCheck className="text-primary h-8 w-8" />
          </h2>
          <p className="text-muted-foreground">Configure boundaries and healthy habits for your family</p>
        </div>
        <Button onClick={handleSave} className="rounded-full px-8 font-bold">Save All Changes</Button>
      </div>

      <Alert className="bg-primary/5 border-primary/20 rounded-2xl">
        <Smartphone className="h-4 w-4" />
        <AlertTitle className="font-bold">Prototyping Note</AlertTitle>
        <AlertDescription className="text-sm">
          Background monitoring and Cockroach mode are simulated. Reports generated are powered by Gemini AI.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Parent Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information used throughout the portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="e.g. Sarah" 
                  value={settings.firstName}
                  onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="e.g. Johnson" 
                  value={settings.lastName}
                  onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm border-l-4 border-l-primary overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>AI Weekly Reports</CardTitle>
              </div>
              <CardDescription>Consolidated digital wellness summaries for all children.</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full" 
              onClick={handleTriggerTestReport}
              disabled={isReportLoading}
            >
              {isReportLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Test Email Now
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Auto-Email Reports</Label>
                <p className="text-sm text-muted-foreground">Automatically send a summary of all children every week.</p>
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

        <Card className="rounded-3xl border-none shadow-sm border-l-4 border-l-destructive overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-5 w-5 text-destructive" />
              <CardTitle>Cockroach Mode</CardTitle>
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
              <ShieldAlert className="h-5 w-5 text-accent-foreground" />
              <CardTitle>Health Break Timer</CardTitle>
            </div>
            <CardDescription>How often should your child take a mandatory eye rest?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="font-bold">Interval (Minutes)</Label>
              <span className="font-bold text-accent-foreground">{settings.eyeBreakInterval}m</span>
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
      </div>

      <Dialog open={!!testReport} onOpenChange={() => setTestReport(null)}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-6 w-6" />
              <DialogTitle>Consolidated Family Report Preview</DialogTitle>
            </div>
            <DialogDescription>This is what your AI-generated weekly email looks like.</DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 p-4 rounded-2xl border space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase text-muted-foreground">Subject</p>
              <p className="font-bold text-foreground">{testReport?.subject}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase text-muted-foreground">Report Content</p>
              <ScrollArea className="h-[300px] w-full pr-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-foreground/80">
                  {testReport?.body}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-center pt-4">
             <Button onClick={() => setTestReport(null)} className="rounded-full px-8">Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
