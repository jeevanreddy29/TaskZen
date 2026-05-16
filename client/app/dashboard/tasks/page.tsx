"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus, Zap, Clock, CheckCircle2, Circle, Trash2,
  Sparkles, ArrowUpCircle, ChevronDown, ChevronUp, CalendarDays
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type Status = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  due: string;
  subtasks?: string[];
  aiGenerated?: boolean;
}

const initialTasks: Task[] = [
  { id: "1", title: "Prepare Q3 strategy deck", priority: "High", status: "in-progress", due: "2026-05-17", subtasks: ["Gather metrics", "Design slides", "Review with team"], aiGenerated: false },
  { id: "2", title: "Review pull requests", priority: "Medium", status: "todo", due: "2026-05-16", subtasks: [], aiGenerated: false },
  { id: "3", title: "Update client documentation", priority: "Low", status: "todo", due: "2026-05-18", subtasks: [], aiGenerated: false },
  { id: "4", title: "Team standup notes", priority: "Low", status: "done", due: "2026-05-16", subtasks: [], aiGenerated: false },
];

const priorityColors: Record<Priority, string> = {
  High: "bg-red-500/10 text-red-400 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading2, setAiLoading2] = useState(false);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      priority: newPriority,
      status: "todo",
      due: newDue || new Date().toISOString().split("T")[0],
      subtasks: [],
      aiGenerated: false,
    };
    setTasks([task, ...tasks]);
    setNewTask(""); setNewDue("");
    setIsDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: t.status === "done" ? "todo" : "done" }
        : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const generateSubtasks = async (task: Task) => {
    setAiLoading(task.id);
    // Simulate AI call
    await new Promise(r => setTimeout(r, 1500));
    const mockSubtasks = [
      `Research best practices for "${task.title}"`,
      `Draft initial outline`,
      `Review and iterate`,
      `Final check & submit`,
    ];
    setTasks(tasks.map(t => t.id === task.id ? { ...t, subtasks: mockSubtasks, aiGenerated: true } : t));
    setExpandedTask(task.id);
    setAiLoading(null);
  };

  const aiCreateTask = async () => {
    if (!aiInput.trim()) return;
    setAiLoading2(true);
    await new Promise(r => setTimeout(r, 1200));
    const task: Task = {
      id: Date.now().toString(),
      title: aiInput.trim(),
      priority: "High",
      status: "todo",
      due: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      subtasks: [`Plan "${aiInput.trim()}"`, "Execute step by step", "Review outcome"],
      aiGenerated: true,
    };
    setTasks([task, ...tasks]);
    setAiInput("");
    setAiLoading2(false);
  };

  const filterTasks = (status: Status | "all") =>
    status === "all" ? tasks : tasks.filter(t => t.status === status);

  const TaskCard = ({ task }: { task: Task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
    >
      <div className="flex items-start gap-3">
        <button onClick={() => toggleStatus(task.id)} className="mt-0.5 shrink-0">
          {task.status === "done"
            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            : <Circle className="w-5 h-5 text-gray-500 hover:text-purple-400 transition-colors" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-gray-500" : "text-white"}`}>
              {task.title}
            </p>
            {task.aiGenerated && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] px-1.5">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>{task.priority}</Badge>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <CalendarDays className="w-3 h-3" /> {task.due}
            </span>
          </div>
          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
              >
                {expandedTask === task.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {task.subtasks.length} subtasks
              </button>
              <AnimatePresence>
                {expandedTask === task.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2 pl-2 border-l border-white/10 space-y-1"
                  >
                    {task.subtasks.map((sub, i) => (
                      <p key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Circle className="w-2.5 h-2.5 text-gray-600" /> {sub}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {task.status !== "done" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => generateSubtasks(task)}
              disabled={aiLoading === task.id}
              className="h-7 px-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              {aiLoading === task.id ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Zap className="w-3.5 h-3.5" />
                </motion.div>
              ) : (
                <><Zap className="w-3.5 h-3.5 mr-1" /><span className="text-xs">AI</span></>
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteTask(task.id)}
            className="h-7 w-7 p-0 text-gray-600 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Task Manager</h1>
          <p className="text-gray-400 mt-1">Organize, prioritize, and auto-generate subtasks with AI.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </motion.div>

      {/* AI Input Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <Input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && aiCreateTask()}
                placeholder="Ask AI to create a task... e.g. 'Prepare a project roadmap for Q3'"
                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus-visible:ring-0"
              />
              <Button
                onClick={aiCreateTask}
                disabled={aiLoading2 || !aiInput.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 rounded-lg shrink-0"
              >
                {aiLoading2 ? "Creating..." : <><ArrowUpCircle className="w-4 h-4 mr-1" /> Create</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="todo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            To Do ({filterTasks("todo").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            In Progress ({filterTasks("in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="done" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Done ({filterTasks("done").length})
          </TabsTrigger>
        </TabsList>

        {(["all", "todo", "in-progress", "done"] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            <AnimatePresence mode="popLayout">
              {filterTasks(tab as Status | "all").map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
            {filterTasks(tab as Status | "all").length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-gray-700" />
                <p className="text-sm">No tasks here. Add one above!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Task Name</label>
              <Input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="Enter task title..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Priority</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as Priority)}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Due Date</label>
                <Input
                  type="date"
                  value={newDue}
                  onChange={e => setNewDue(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-gray-400">Cancel</Button>
              <Button onClick={addTask} className="bg-purple-600 hover:bg-purple-700">Create Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
