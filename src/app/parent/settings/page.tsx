"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ShieldAlert, Bug, Bell, Clock, Mail, Loader2, Smartphone, ShieldCheck, User, Send, Sparkles, FileText, Printer } from "lucide-react";
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
  const [testReport, setTestReport] = useState<{ subject: string, body: string, formal: string } | null>(null);

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
          usageMinutes: Math.floor(Math.random() * 500) + 200,
          missionsCompleted: Math.floor(Math.random() * 10) + 2,
          diaryEntries: Math.floor(Math.random() * 7),
          healthStatus: (['excellent', 'good', 'needs_attention'] as const)[Math.floor(Math.random() * 3)],
        })),
      };

      const result = await generateWeeklyReport(reportData);
      setTestReport({ 
        subject: result.emailSubject, 
        body: result.emailBody,
        formal: result.formalReportContent
      });
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

  const handlePrintReport = () => {
    window.print();
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

      <Alert className="bg-primary/5 border-primary/20 rounded-2xl print:hidden">
        <Smartphone className="h-4 w-4" />
        <AlertTitle className="font-bold">Prototyping Note</AlertTitle>
        <AlertDescription className="text-sm">
          Background monitoring and Cockroach mode are simulated. Reports are generated by Gemini AI. No actual emails are sent in this sandbox.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 print:hidden">
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
                  placeholder=" Johnson" 
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full" 
                onClick={handleTriggerTestReport}
                disabled={isReportLoading}
              >
                {isReportLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Generate PDF Preview
              </Button>
            </div>
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
        <DialogContent className="rounded-[2.5rem] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-8 pb-4 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-6 w-6" />
                <DialogTitle>Family Wellness PDF Preview</DialogTitle>
              </div>
              <Button onClick={handlePrintReport} size="sm" className="rounded-full bg-primary font-bold">
                <Printer className="h-4 w-4 mr-2" /> Save/Print PDF
              </Button>
            </div>
            <DialogDescription>This structured report is generated for all children in your profile.</DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-8 pt-0">
            <div id="pdf-report" className="bg-white p-8 border rounded-3xl shadow-inner space-y-8 font-serif leading-relaxed text-slate-800">
              <div className="border-b-4 border-primary pb-6 text-center space-y-2">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Kidsyee Wellness Report</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Consolidated Family Insight • {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold border-l-4 border-primary pl-4 py-1 bg-primary/5">Email Notification Preview</h2>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm whitespace-pre-wrap italic">
                  <strong>Subject:</strong> {testReport?.subject}<br/><br/>
                  {testReport?.body}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold border-l-4 border-primary pl-4 py-1 bg-primary/5">Detailed Individual Metrics</h2>
                <div className="whitespace-pre-wrap text-sm md:text-base bg-white">
                  {testReport?.formal}
                </div>
              </div>

              <div className="border-t pt-8 text-center text-[10px] text-muted-foreground font-sans uppercase tracking-widest">
                Kidsyee - Protecting the digital future of your family.
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-muted/20 flex justify-center print:hidden">
             <Button onClick={() => setTestReport(null)} variant="ghost" className="rounded-full font-bold">Close Preview</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
