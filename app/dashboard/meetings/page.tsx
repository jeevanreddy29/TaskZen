"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, Sparkles } from "lucide-react";
import { useState } from "react";

const mockSummary = {
  summary: "Team agreed to launch the new feature in Q3. Design assets are due May 25 and the backend API by June 10. Weekly standups every Monday at 10 AM.",
  actionItems: [
    "Design team to deliver mockups by May 25",
    "Backend to complete API by June 10",
    "PM to schedule weekly Monday standups",
    "QA to start test plan by end of May",
  ],
};

export default function MeetingsPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof mockSummary | null>(null);

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setResult(mockSummary);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">AI Meeting Summarizer</h1>
        <p className="text-gray-400 mt-1">Paste your meeting transcript to extract a summary and action items.</p>
      </motion.div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Video className="w-4 h-4 text-emerald-400" />
            Meeting Transcript
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            placeholder="Paste your meeting transcript or notes here..."
            className="w-full bg-transparent text-white text-sm leading-relaxed resize-none outline-none placeholder-gray-600 border border-white/10 rounded-xl p-3"
          />
          <Button onClick={summarize} disabled={loading || !text.trim()} className="bg-emerald-600 hover:bg-emerald-700 w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? "Analyzing with AI..." : "Summarize Meeting"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="bg-emerald-900/10 border-emerald-500/20">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Summary</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-900/10 border-purple-500/20">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-1.5"><Upload className="w-4 h-4" /> Action Items</h3>
              <ul className="space-y-2">
                {result.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
