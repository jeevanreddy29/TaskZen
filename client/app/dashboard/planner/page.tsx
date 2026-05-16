"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sparkles, Sun, Sunset, Moon, Clock } from "lucide-react";

const mockPlan = [
  { time: "9:00 AM", task: "Deep work: Q3 strategy deck", duration: "2h", type: "focus", icon: "🎯" },
  { time: "11:00 AM", task: "Team standup", duration: "30m", type: "meeting", icon: "👥" },
  { time: "11:30 AM", task: "Review pull requests", duration: "1h", type: "work", icon: "💻" },
  { time: "12:30 PM", task: "Lunch break", duration: "1h", type: "break", icon: "🍱" },
  { time: "1:30 PM", task: "Update client documentation", duration: "1.5h", type: "work", icon: "📝" },
  { time: "3:00 PM", task: "Email & communication catch-up", duration: "30m", type: "admin", icon: "📧" },
  { time: "3:30 PM", task: "Focus block: API integration", duration: "2h", type: "focus", icon: "⚡" },
  { time: "5:30 PM", task: "Review & plan tomorrow", duration: "30m", type: "admin", icon: "📋" },
];

const typeColors: Record<string, string> = {
  focus: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  meeting: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  work: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  break: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  admin: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function PlannerPage() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setGenerated(true);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">AI Daily Planner</h1>
        <p className="text-gray-400 mt-1">Let AI generate your optimal daily schedule.</p>
      </motion.div>

      {!generated ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20 text-center">
            <CardContent className="p-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto">
                <CalendarDays className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Generate Your Day</h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                AI will analyze your tasks, priorities, and work patterns to build the perfect schedule for today.
              </p>
              <Button onClick={generate} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-8">
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Planning your day..." : "Generate AI Plan"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" /> Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <Button size="sm" onClick={() => setGenerated(false)} variant="ghost" className="text-purple-400 hover:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Regenerate
            </Button>
          </div>
          {mockPlan.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-center w-16 shrink-0">
                    <p className="text-xs text-gray-500 font-mono">{block.time}</p>
                  </div>
                  <div className="text-xl shrink-0">{block.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{block.task}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{block.duration}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${typeColors[block.type]}`}>
                    {block.type}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
