"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Rocket, Layout, BookOpen, Video, CalendarDays, MessageSquare } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "AI Task Manager",
      description: "Auto-prioritize tasks, suggest schedules, and generate subtasks instantly.",
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      badge: "MVP",
    },
    {
      title: "AI Notes Assistant",
      description: "Convert messy notes into actionable tasks and get AI-powered summaries.",
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      badge: "MVP",
    },
    {
      title: "Meeting Summarizer",
      description: "Extract action items and follow-ups from meeting transcripts with one click.",
      icon: <Video className="w-6 h-6 text-emerald-400" />,
      badge: "New",
    },
    {
      title: "Daily Planner",
      description: "Optimize your day with AI-generated focus blocks and schedule suggestions.",
      icon: <CalendarDays className="w-6 h-6 text-orange-400" />,
      badge: "Popular",
    },
    {
      title: "AI Chat Coach",
      description: "Your personal productivity coach available 24/7 to keep you on track.",
      icon: <MessageSquare className="w-6 h-6 text-pink-400" />,
      badge: "New",
    },
    {
      title: "Smart Automation",
      description: "Automate repetitive workflows and let AI handle the heavy lifting.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      badge: "Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Task<span className="text-purple-400">Zen</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-full px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
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
              <Link href="/sign-up">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 rounded-full text-lg">
                  Start for Free
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-8 h-12 rounded-full text-lg">
                  View Dashboard →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-3">Everything you need to stay in flow</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powered by Gemini and GPT-4 — your entire productivity stack, reimagined.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
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

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-5xl font-bold text-white mb-4">Ready to transform your workflow?</h2>
            <p className="text-gray-400 mb-8">Join thousands of professionals who use TaskZen to work smarter.</p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-10 h-12 rounded-full text-lg">
                Get Started — It's Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 TaskZen AI. Built for the future of work.</p>
      </footer>
    </div>
  );
}
