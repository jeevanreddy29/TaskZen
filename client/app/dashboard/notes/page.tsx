"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus, Sparkles, FileText, Trash2, Zap,
  ClipboardList, PenLine, ChevronRight, Search
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  aiSummary?: string;
  aiTasks?: string[];
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Project Kickoff Meeting",
    content: "We discussed the timeline for the new product launch. Key stakeholders agreed on a Q3 deadline. The design team needs to deliver mockups by May 25. Backend API targets are set for June 10. We should schedule weekly sync-ups every Monday at 10 AM.",
    createdAt: "2026-05-16",
    aiSummary: "Q3 product launch agreed. Design mockups due May 25, backend API by June 10. Weekly Monday syncs at 10 AM.",
    aiTasks: ["Deliver design mockups by May 25", "Complete backend API by June 10", "Schedule weekly Monday syncs"],
  },
  {
    id: "2",
    title: "Ideas for AI Features",
    content: "Smart summarization, voice input, context-aware suggestions, auto-tagging of notes, and integration with calendar.",
    createdAt: "2026-05-15",
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>("taskzen-notes", initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [newTitle, setNewTitle] = useState("");
  const [editContent, setEditContent] = useState(selectedNote?.content || "");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<null | "summary" | "tasks">(null);
  const [search, setSearch] = useState("");

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditContent(note.content);
    setAiMode(null);
  };

  const createNote = () => {
    if (!newTitle.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setNotes([note, ...notes]);
    setSelectedNote(note);
    setEditContent("");
    setNewTitle("");
  };

  const updateContent = (content: string) => {
    setEditContent(content);
    if (selectedNote) {
      setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content } : n));
      setSelectedNote({ ...selectedNote, content });
    }
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    setSelectedNote(remaining[0] || null);
    setEditContent(remaining[0]?.content || "");
  };

  const runAI = async (mode: "summary" | "tasks") => {
    if (!selectedNote) return;
    setAiLoading(true);
    setAiMode(mode);
    await new Promise(r => setTimeout(r, 1600));
    if (mode === "summary") {
      const summary = `AI Summary: ${selectedNote.content.slice(0, 120)}...`;
      const updated = { ...selectedNote, aiSummary: summary };
      setNotes(notes.map(n => n.id === selectedNote.id ? updated : n));
      setSelectedNote(updated);
    } else {
      const tasks = [
        `Follow up on: "${selectedNote.title}"`,
        "Schedule a review meeting",
        "Draft documentation for this topic",
      ];
      const updated = { ...selectedNote, aiTasks: tasks };
      setNotes(notes.map(n => n.id === selectedNote.id ? updated : n));
      setSelectedNote(updated);
    }
    setAiLoading(false);
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-5 h-[calc(100vh-4rem)] max-w-6xl">
      {/* Sidebar */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-72 shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="pl-9 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && createNote()}
            placeholder="New note title..."
            className="bg-white/5 border-white/10 text-white text-sm"
          />
          <Button onClick={createNote} size="icon" className="bg-purple-600 hover:bg-purple-700 shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-1">
            <AnimatePresence>
              {filtered.map(note => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => selectNote(note)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all group ${
                    selectedNote?.id === note.id
                      ? "bg-purple-600/20 border-purple-500/30"
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{note.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.content || "No content yet..."}</p>
                      <p className="text-xs text-gray-600 mt-1">{note.createdAt}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {(note.aiSummary || note.aiTasks) && (
                    <Badge className="mt-2 bg-purple-500/10 text-purple-400 border-none text-[10px]">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI Enhanced
                    </Badge>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Editor */}
      {selectedNote ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedNote.title}</h2>
              <p className="text-xs text-gray-500">{selectedNote.createdAt}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => runAI("summary")}
                disabled={aiLoading}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-lg"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {aiLoading && aiMode === "summary" ? "Summarizing..." : "Summarize"}
              </Button>
              <Button
                size="sm"
                onClick={() => runAI("tasks")}
                disabled={aiLoading}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/20 rounded-lg"
              >
                <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                {aiLoading && aiMode === "tasks" ? "Extracting..." : "Extract Tasks"}
              </Button>
            </div>
          </div>

          <Card className="flex-1 bg-white/5 border-white/10 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <textarea
                value={editContent}
                onChange={e => updateContent(e.target.value)}
                placeholder="Start writing your note..."
                className="flex-1 bg-transparent text-white text-sm leading-relaxed resize-none outline-none placeholder-gray-600 min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* AI Results */}
          <AnimatePresence>
            {selectedNote.aiSummary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <Card className="bg-blue-900/10 border-blue-500/20">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedNote.aiSummary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {selectedNote.aiTasks && selectedNote.aiTasks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <Card className="bg-purple-900/10 border-purple-500/20">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm text-purple-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Extracted Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-1.5">
                    {selectedNote.aiTasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        {task}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500">
          <div>
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-sm">Select a note or create a new one.</p>
          </div>
        </div>
      )}
    </div>
  );
}
