"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Shield, Rocket, CheckCircle2, Layout, BookOpen, Video } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "AI Task Manager",
      description: "Auto-prioritize tasks, suggest schedules, and generate subtasks instantly.",
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      badge: "MVP"
    },
    {
      title: "AI Notes Assistant",
      description: "Convert messy notes into actionable tasks and get AI-powered summaries.",
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      badge: "MVP"
    },
    {
      title: "Meeting Summarizer",
      description: "Extract action items and follow-ups from meeting transcripts with one click.",
      icon: <Video className="w-6 h-6 text-emerald-400" />,
      badge: "New"
    },
    {
      title: "Daily Planner",
      description: "Optimize your day with focus time suggestions and calendar integration.",
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      badge: "Popular"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 border-purple-500/50 text-purple-400 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-2" />
              Revolutionizing Productivity with AI
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Your Workflow, <br />
              <span className="text-purple-500">Supercharged.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
              TaskZen combines intelligent task management, smart notes, and meeting automation
              into one seamless, AI-powered workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 rounded-full text-lg">
                Start for Free
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-8 h-12 rounded-full text-lg">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition-all group h-full">
                  <CardHeader>
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                      <Badge className="bg-purple-500/10 text-purple-400 border-none">{feature.badge}</Badge>
                    </div>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="text-2xl font-bold tracking-tighter">NeuroFlow</div>
            <div className="text-2xl font-bold tracking-tighter">FocusPilot</div>
            <div className="text-2xl font-bold tracking-tighter">SmartFlow</div>
            <div className="text-2xl font-bold tracking-tighter">IntelliDesk</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 TaskZen AI. Built for the future of work.</p>
      </footer>
    </div>
  );
}
