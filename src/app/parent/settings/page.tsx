
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ShieldAlert, Bug, Bell, Clock, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ParentSettings() {
  const [settings, setSettings] = useState({
    dailyLimit: 120,
    enableBugDeterrent: false,
    eyeBreakInterval: 20,
    notificationsEnabled: true,
    receiveWeeklyReportEmail: false,
    weeklyReportDayOfWeek: "Monday",
  });

  useEffect(() => {
    const saved = localStorage.getItem('parent-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('parent-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved!",
      description: "Child device policies and email alert preferences have been updated.",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Control Center</h2>
        <p className="text-muted-foreground">Configure boundaries and healthy habits for Alex</p>
      </div>

      <div className="grid gap-6">
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
              <Label>Total Screen Time</Label>
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
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Reports</CardTitle>
            </div>
            <CardDescription>Receive a weekly summary of digital wellness and activity.</CardDescription>
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm border-l-4 border-l-destructive overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-5 w-5 text-destructive" />
              <CardTitle>Creative Deterrent (Bug Mode)</CardTitle>
            </div>
            <CardDescription>Enable visual "invasions" to encourage stopping usage when time is up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Invasive Bug Visuals</Label>
                <p className="text-sm text-muted-foreground">Cockroaches appear on screen when time limit is exceeded.</p>
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
              <CardTitle>Health Breaks</CardTitle>
            </div>
            <CardDescription>Configure frequency of eye health prompts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Break Frequency (Minutes)</Label>
              <span className="font-bold text-accent-foreground">{settings.eyeBreakInterval} min</span>
            </div>
            <Slider 
              value={[settings.eyeBreakInterval]} 
              onValueChange={([val]) => setSettings({...settings, eyeBreakInterval: val})} 
              max={60} 
              min={10}
              step={5} 
            />
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label>Parent Notifications</Label>
              </div>
              <Switch 
                checked={settings.notificationsEnabled} 
                onCheckedChange={(val) => setSettings({...settings, notificationsEnabled: val})} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={() => window.location.reload()}>Discard Changes</Button>
          <Button size="lg" className="rounded-full px-8 font-bold" onClick={handleSave}>Save Device Policy</Button>
        </div>
      </div>
    </div>
  );
}
