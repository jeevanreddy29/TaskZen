"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User } from "lucide-react";

interface Message { role: "user" | "ai"; content: string; }

const initialMessages: Message[] = [
  { role: "ai", content: "Hi! I'm your TaskZen AI assistant. Ask me anything about productivity, planning, or your tasks! 🚀" },
];

const aiResponses = [
  "Great question! Based on your current tasks, I recommend focusing on the high-priority items first thing in the morning when your energy is highest.",
  "I suggest using the Pomodoro technique — 25 minutes of focused work followed by a 5-minute break. This can boost your productivity significantly.",
  "Looking at your task list, it seems like the Q3 strategy deck needs the most attention. Would you like me to break it down into smaller steps?",
  "Time blocking is a powerful method. Reserve 2-hour deep work blocks for complex tasks, and batch smaller tasks together in the afternoon.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const aiMsg: Message = {
      role: "ai",
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-6rem)] gap-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">AI Chat Assistant</h1>
        <p className="text-gray-400 mt-1">Your personal productivity coach powered by AI.</p>
      </motion.div>

      <Card className="flex-1 bg-white/5 border-white/10 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-purple-600" : "bg-blue-600"}`}>
                  {msg.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-white/10 text-gray-200 rounded-tl-sm"
                    : "bg-purple-600 text-white rounded-tr-sm"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about productivity, planning, tasks..."
              className="flex-1 bg-white/5 border-white/10 text-white"
            />
            <Button onClick={send} disabled={loading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
