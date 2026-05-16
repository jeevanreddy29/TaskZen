"use client";

import { motion } from "framer-motion";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, FileText, Video, Zap, TrendingUp, Clock, Star } from "lucide-react";

const stats = [
  { label: "Tasks Completed", value: "24", change: "+8 today", icon: CheckSquare, color: "text-blue-400" },
  { label: "Notes Created", value: "12", change: "+3 today", icon: FileText, color: "text-purple-400" },
  { label: "Meetings Summarized", value: "6", change: "+1 today", icon: Video, color: "text-emerald-400" },
  { label: "AI Actions", value: "48", change: "+15 today", icon: Zap, color: "text-orange-400" },
];

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "Mon", tasks: 4 },
  { name: "Tue", tasks: 7 },
  { name: "Wed", tasks: 5 },
  { name: "Thu", tasks: 12 },
  { name: "Fri", tasks: 8 },
  { name: "Sat", tasks: 3 },
  { name: "Sun", tasks: 6 },
];

const priorityColors: Record<string, string> = {
  High: "bg-red-500/10 text-red-400 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const statusColors: Record<string, string> = {
  Done: "bg-emerald-500/10 text-emerald-400",
  "In Progress": "bg-blue-500/10 text-blue-400",
  Pending: "bg-gray-500/10 text-gray-400",
};

export default function DashboardPage() {
  const [tasks] = useLocalStorage<any[]>("taskzen-tasks", []);
  const [notes] = useLocalStorage<any[]>("taskzen-notes", []);

  const activeTasks = tasks.filter(t => t.status !== "done");
  const completedTasks = tasks.filter(t => t.status === "done");

  const dynamicStats = [
    { label: "Tasks Completed", value: completedTasks.length.toString(), change: "+2 today", icon: CheckSquare, color: "text-blue-400" },
    { label: "Notes Created", value: notes.length.toString(), change: "+1 today", icon: FileText, color: "text-purple-400" },
    { label: "Meetings Summarized", value: "0", change: "+0 today", icon: Video, color: "text-emerald-400" },
    { label: "AI Actions", value: tasks.filter(t => t.aiGenerated).length.toString(), change: "+1 today", icon: Zap, color: "text-orange-400" },
  ];

  const recentDynamicTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">Good morning! 👋</h1>
        <p className="text-gray-400 mt-1">Here's your productivity overview for today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Productivity Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-white/5 border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-white text-lg">Recent Tasks</CardTitle>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                <CheckSquare className="w-3 h-3 mr-1" /> {activeTasks.length} Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDynamicTasks.map((task: any) => (
                  <div
                    key={task.title}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "Done" ? "line-through text-gray-500" : "text-white"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{task.due}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                      <Badge className={`text-xs border-none ${statusColors[task.status === "done" ? "Done" : task.status === "in-progress" ? "In Progress" : "Pending"] || statusColors.Pending}`}>
                        {task.status === "done" ? "Done" : task.status === "in-progress" ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentDynamicTasks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Create one in the Tasks tab!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-white/5 border-white/10 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" /> AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { text: "Block 2 hours for deep work on the client demo", icon: "🎯" },
                { text: "3 tasks from yesterday's meeting need action items", icon: "📋" },
                { text: "Your peak productivity time is 9–11 AM", icon: "⚡" },
                { text: "Consider breaking down the 'API docs' task into 4 subtasks", icon: "🔧" },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors cursor-pointer">
                  <span className="text-lg shrink-0">{s.icon}</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
