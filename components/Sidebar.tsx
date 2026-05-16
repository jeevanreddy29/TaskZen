"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Video,
  CalendarDays,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Notes", href: "/dashboard/notes", icon: FileText },
  { label: "Meetings", href: "/dashboard/meetings", icon: Video },
  { label: "Planner", href: "/dashboard/planner", icon: CalendarDays },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Task<span className="text-purple-400">Zen</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* AI Pro Badge */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">AI Pro Active</span>
          </div>
          <p className="text-xs text-gray-500">Powered by Gemini &amp; GPT-4</p>
        </div>
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Your Account</p>
            <p className="text-xs text-gray-500">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
