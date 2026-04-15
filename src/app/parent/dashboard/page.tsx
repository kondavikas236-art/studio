"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Clock, Smartphone, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const USAGE_DATA = [
  { day: 'Mon', games: 45, education: 120, other: 15 },
  { day: 'Tue', games: 60, education: 90, other: 20 },
  { day: 'Wed', games: 30, education: 150, other: 10 },
  { day: 'Thu', games: 90, education: 60, other: 30 },
  { day: 'Fri', games: 120, education: 45, other: 40 },
  { day: 'Sat', games: 180, education: 30, other: 60 },
  { day: 'Sun', games: 150, education: 30, other: 45 },
];

const chartConfig: ChartConfig = {
  games: { label: "Gaming", color: "#2E8AB8" },
  education: { label: "Educational", color: "#CFE467" },
  other: { label: "Others", color: "#4FB0C6" },
};

export default function ParentDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold">Weekly Insights</h2>
          <p className="text-muted-foreground">Monitoring Alex&apos;s digital wellness</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download PDF Report</Button>
          <Button>Set New Limits</Button>
        </div>
      </div>

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
            <div className="text-xs font-bold text-muted-foreground">Alex met limits 6/7 days</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-500" /> Focus Score
            </CardDescription>
            <CardTitle className="text-2xl font-black">Good</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-xs font-bold text-blue-500">Highest during math games</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" /> Alerts
            </CardDescription>
            <CardTitle className="text-2xl font-black">1 Active</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-xs font-bold text-destructive">Gaming limit exceeded on Friday</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>Daily breakdown of activity categories</CardDescription>
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
                        <Bar dataKey="education" stackId="a" fill="var(--color-education)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="games" stackId="a" fill="var(--color-games)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="other" stackId="a" fill="var(--color-other)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Top Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Duolingo', category: 'Education', time: '1h 20m', color: 'bg-green-500' },
                { name: 'Roblox', category: 'Gaming', time: '45m', color: 'bg-red-500' },
                { name: 'Minecraft', category: 'Gaming', time: '30m', color: 'bg-primary' },
                { name: 'Khan Academy', category: 'Education', time: '25m', color: 'bg-blue-400' },
              ].map((app) => (
                <div key={app.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${app.color} opacity-20 flex items-center justify-center font-bold text-xs`}>
                      {app.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.category}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm">{app.time}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary font-bold">View All Apps</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Proactive Suggestions</CardTitle>
            <CardDescription>AI-driven observations for wellness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
               <TrendingUp className="h-6 w-6 text-primary shrink-0" />
               <p className="text-sm">Alex shows <strong>20% better focus</strong> after taking an eye health break. Consider scheduling automated breaks every 45 mins.</p>
            </div>
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex gap-4">
               <AlertCircle className="h-6 w-6 text-accent-foreground shrink-0" />
               <p className="text-sm">Late-night usage increased by 15% this week. We suggest activating <strong>Wind-Down Mode</strong> at 7:30 PM.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
