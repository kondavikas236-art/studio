
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Clock, Smartphone, AlertCircle, TrendingUp, CheckCircle2, UserPlus, Shield, Loader2, Trash2, Settings, History, Lock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const USAGE_DATA = [
  { day: 'Mon', video: 45, education: 120, social: 15 },
  { day: 'Tue', video: 60, education: 90, social: 20 },
  { day: 'Wed', video: 30, education: 150, social: 10 },
  { day: 'Thu', video: 90, education: 60, social: 30 },
  { day: 'Fri', video: 120, education: 45, social: 40 },
  { day: 'Sat', video: 180, education: 30, social: 60 },
  { day: 'Sun', video: 150, education: 30, social: 45 },
];

const chartConfig: ChartConfig = {
  video: { label: "YouTube/Video", color: "#FF0000" },
  education: { label: "Educational", color: "#CFE467" },
  social: { label: "Social Media", color: "#4FB0C6" },
};

function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function ParentDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [newChildName, setNewChildName] = useState("");
  const [newChildDob, setNewChildDob] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: children, isLoading } = useCollection(childrenQuery);

  const handleAddChild = () => {
    if (!db || !user || !newChildName.trim() || !newChildDob) return;

    const colRef = collection(db, "parentProfiles", user.uid, "childProfiles");
    addDocumentNonBlocking(colRef, {
      parentId: user.uid,
      name: newChildName,
      dateOfBirth: newChildDob,
      avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
      dailyScreenTimeLimitMinutes: 120,
      gamingTimeLimitMinutes: 60
    });

    setNewChildName("");
    setNewChildDob("");
    setIsAddOpen(false);
  };

  const handleDeleteChild = (childId: string) => {
    if (!db || !user) return;
    const childRef = doc(db, "parentProfiles", user.uid, "childProfiles", childId);
    deleteDocumentNonBlocking(childRef);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Kidsyee - Eye & Brain Wellness',
      text: 'Check out Kidsyee, the ultimate screen time guardian for kids!',
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link Copied!",
        description: "App link copied! You can now paste and send it to your friend.",
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Family Insights</h2>
          <p className="text-muted-foreground">Monitoring wellness for {children?.length || 0} children</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare} className="rounded-full h-12 px-6 font-bold border-primary/20 hover:bg-primary/5 text-primary">
            <Share2 className="mr-2 h-5 w-5" /> Share App
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 px-6 font-bold">
                <UserPlus className="mr-2 h-5 w-5" /> Add Children
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle>New Child Profile</DialogTitle>
                <DialogDescription>Add a profile to track screen time and healthy habits.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Child Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Alex" 
                    value={newChildName} 
                    onChange={(e) => setNewChildName(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={newChildDob} 
                    onChange={(e) => setNewChildDob(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddChild} className="rounded-full w-full h-12 font-bold">Save Profile</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : children?.length === 0 ? (
        <Card className="rounded-[2.5rem] border-dashed border-2 border-primary/20 p-12 text-center bg-primary/5">
          <Shield className="h-12 w-12 text-primary/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No Children Yet</h3>
          <p className="text-muted-foreground mb-6">Add your first child profile to start monitoring screen time.</p>
          <Button variant="outline" onClick={() => setIsAddOpen(true)} className="rounded-full">Add Children Now</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Daily Avg
              </CardDescription>
              <CardTitle className="text-2xl font-black">2h 45m</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 12% decrease from last week
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-foreground" /> Goal Progress
              </CardDescription>
              <CardTitle className="text-2xl font-black">85%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-muted-foreground">Limits met 6/7 days</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-500" /> System Active
              </CardDescription>
              <CardTitle className="text-2xl font-black">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-xs font-bold text-blue-500 flex items-center gap-1">
                 <Shield className="h-3 w-3" /> Background monitoring ON
               </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" /> Active Alerts
              </CardDescription>
              <CardTitle className="text-2xl font-black">{children?.length > 0 ? "1 Active" : "0"}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-xs font-bold text-destructive">YouTube limit reached today</div>
            </CardContent>
          </Card>
        </div>
      )}

      {children && children.length > 0 && (
        <>
          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Global Usage Trends</CardTitle>
                <CardDescription>Breakdown of cross-app activity including YouTube and Social Media</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full px-4 py-1 flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                Live Monitoring
              </Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="week" className="w-full">
                <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="day" className="rounded-lg">Daily</TabsTrigger>
                  <TabsTrigger value="week" className="rounded-lg">Weekly</TabsTrigger>
                  <TabsTrigger value="month" className="rounded-lg">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="week">
                   <div className="h-[400px] w-full mt-4">
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={USAGE_DATA}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 500, fill: '#64748b'}} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 500, fill: '#64748b'}}
                              dx={-10}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend iconType="circle" />
                            <Bar dataKey="education" stackId="a" fill="var(--color-education)" />
                            <Bar dataKey="video" stackId="a" fill="var(--color-video)" />
                            <Bar dataKey="social" stackId="a" fill="var(--color-social)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                   </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white lg:col-span-2">
              <CardHeader>
                <CardTitle>Child Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={child.avatarUrl} alt={child.name} className="h-12 w-12 rounded-full border-2 border-primary/20 object-cover" />
                        <div>
                          <p className="font-bold text-lg">{child.name}</p>
                          <p className="text-xs text-muted-foreground font-semibold">Age {calculateAge(child.dateOfBirth)} • Explorer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/parent/settings">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Child Profile?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {child.name}? This will permanently delete their progress and settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteChild(child.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                              >
                                Delete Child
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" /> Block Log
                </CardTitle>
                <CardDescription>Recent app interventions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-destructive/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <Lock className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">YouTube</p>
                        <p className="text-[10px] text-muted-foreground">Blocked 12m ago</p>
                      </div>
                   </div>
                   <Badge variant="destructive" className="text-[10px]">Time Up</Badge>
                </div>
                <div className="p-3 rounded-xl bg-destructive/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <Lock className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">TikTok</p>
                        <p className="text-[10px] text-muted-foreground">Blocked 2h ago</p>
                      </div>
                   </div>
                   <Badge variant="destructive" className="text-[10px]">Policy</Badge>
                </div>
                <div className="pt-4 border-t text-center">
                   <p className="text-xs text-muted-foreground italic">"Enforcement active via local service."</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
