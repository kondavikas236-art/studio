"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ShieldCheck, Mail, Loader2, User, Sparkles, Printer, PieChart as PieChartIcon, BarChart3, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Input } from "@/components/ui/input";
import { generateWeeklyReport } from "@/ai/flows/ai-weekly-report-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = ['#1996C5', '#CFE467', '#4FB0C6', '#A855F7', '#F97316'];

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
    enableBugDeterrent: true,
    eyeBreakInterval: 20,
    receiveWeeklyReportEmail: false,
    weeklyReportDayOfWeek: "Monday",
    weeklyReportSendTime: "09:00",
  });

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [testReport, setTestReport] = useState<{ 
    subject: string, 
    body: string, 
    formal: string,
    chartData: { name: string, value: number }[] 
  } | null>(null);

  useEffect(() => {
    if (parentProfile) {
      setSettings((prev) => ({
        ...prev,
        firstName: parentProfile.firstName || "",
        lastName: parentProfile.lastName || "",
        receiveWeeklyReportEmail: parentProfile.receiveWeeklyReportEmail || false,
      }));
    }
    const saved = localStorage.getItem('parent-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, [parentProfile]);

  const handleSave = () => {
    if (!parentRef || !user) return;

    setDocumentNonBlocking(parentRef, {
      id: user.uid,
      firstName: settings.firstName,
      lastName: settings.lastName,
      receiveWeeklyReportEmail: settings.receiveWeeklyReportEmail,
      email: user.email || "",
      isPro: parentProfile?.isPro || false,
    }, { merge: true });

    localStorage.setItem('parent-settings', JSON.stringify(settings));

    toast({
      title: "Settings Saved! 🛡️",
      description: "Cockroach deterrents and wellness policies updated.",
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
      const simulatedChildren = children.map(c => ({
        name: c.name,
        usageMinutes: Math.floor(Math.random() * 500) + 200,
        missionsCompleted: Math.floor(Math.random() * 10) + 2,
        description: "",
        diaryEntries: Math.floor(Math.random() * 7),
        healthStatus: (['excellent', 'good', 'needs_attention'] as const)[Math.floor(Math.random() * 3)],
      }));

      const result = await generateWeeklyReport({
        parentName: settings.firstName || "Parent",
        children: simulatedChildren,
      });
      
      setTestReport({ 
        subject: result.emailSubject, 
        body: result.emailBody,
        formal: result.formalReportContent,
        chartData: simulatedChildren.map(c => ({ name: c.name, value: c.usageMinutes }))
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Report Generation Failed" });
    } finally {
      setIsReportLoading(false);
    }
  };

  const handlePrintReport = () => {
    if (typeof window !== "undefined") {
      window.print();
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
          <p className="text-muted-foreground">Configure boundaries and digital wellness habits.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleTriggerTestReport} disabled={isReportLoading} className="rounded-full font-bold">
             {isReportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
             Preview Report
           </Button>
           <Button onClick={handleSave} className="rounded-full px-8 font-bold shadow-lg">Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-[2rem] border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Parent Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={settings.firstName} onChange={(e) => setSettings({...settings, firstName: e.target.value})} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={settings.lastName} onChange={(e) => setSettings({...settings, lastName: e.target.value})} className="rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm border-l-4 border-l-primary bg-white">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Cockroach Deterrent</CardTitle>
            </div>
            <CardDescription>Bugs appear when screen time limits are exceeded or eye breaks are missed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Enable Cockroach Mode</Label>
                <p className="text-sm text-muted-foreground">Automatic deterrent when healthy limits are hit.</p>
              </div>
              <Switch checked={settings.enableBugDeterrent} onCheckedChange={(val) => setSettings({...settings, enableBugDeterrent: val})} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>AI Family Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Weekly Wellness Email</Label>
                <p className="text-sm text-muted-foreground">Receive a consolidated summary of all children's activity.</p>
              </div>
              <Switch checked={settings.receiveWeeklyReportEmail} onCheckedChange={(val) => setSettings({...settings, receiveWeeklyReportEmail: val})} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!testReport} onOpenChange={() => setTestReport(null)}>
        <DialogContent className="rounded-[3rem] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 bg-primary text-white report-modal-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8" />
                <div className="text-left">
                  <DialogTitle className="text-2xl font-black">Family Wellness Summary</DialogTitle>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest">AI Generated Preview</p>
                </div>
              </div>
              <Button onClick={handlePrintReport} className="rounded-full bg-white text-primary hover:bg-white/90 font-bold">
                <Download className="h-4 w-4 mr-2" /> Save PDF
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-8 bg-[#F8FAFC]">
            <div id="pdf-report" className="bg-white p-10 rounded-[2.5rem] border shadow-sm space-y-8 text-foreground max-w-3xl mx-auto">
              <div className="flex justify-between items-center border-b pb-6 report-section">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-primary italic">Kids<span className="text-foreground/80">yee</span></h1>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">Smart Screen Time Guardian</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Report Period</p>
                  <p className="text-lg font-bold">Weekly Update</p>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 report-section">
                <h2 className="text-xl font-black text-primary mb-3">Health Assistant Note</h2>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                  {testReport?.body}
                </div>
              </div>

              {testReport?.chartData && testReport.chartData.length > 0 && (
                <div className="space-y-4 report-section">
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" /> Family Screen Time Distribution
                  </h2>
                  <div className="report-chart-container h-[400px] w-full bg-white rounded-3xl border flex items-center justify-center p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={testReport.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          isAnimationActive={false}
                        >
                          {testReport.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-4 report-section">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Individual Breakdown
                </h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed p-6 bg-muted/5 rounded-3xl border font-medium text-foreground">
                  {testReport?.formal}
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col items-center gap-2 text-center report-section">
                <div className="bg-accent/10 text-accent-foreground font-black text-[10px] px-3 py-1 rounded-full">
                  PROTECTED BY KIDSYEE AI
                </div>
                <p className="text-[10px] text-muted-foreground font-bold italic">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
