import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, FileText } from "lucide-react";
import { useAuth } from "../services/auth";

export default function SubjectsPanel() {
  const { user } = useAuth();
  const defaultSubjects: string[] = (user?.subjects && user.subjects.length > 0) ? user.subjects : ["Physics", "Chemistry", "React"];
  const [subjectsList, setSubjectsList] = useState<string[]>(defaultSubjects);
  const [activeSubject, setActiveSubject] = useState<string>(subjectsList[0] || "");
  const [newSub, setNewSub] = useState("");

  const handleAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSub.trim()) {
      if (!subjectsList.includes(newSub.trim())) {
        setSubjectsList([...subjectsList, newSub.trim()]);
      }
      setNewSub("");
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="h-5 w-5 glow-text-pink" />
        <h3 className="font-semibold text-sm">Study Resources</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg bg-secondary/30 flex-wrap">
        {subjectsList.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`relative px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubject === s ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeSubject === s && (
              <motion.div
                layoutId="subject-tab"
                className="absolute inset-0 rounded-md bg-primary/20 border border-primary/20"
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{s}</span>
          </button>
        ))}
        <input 
          type="text" 
          value={newSub}
          onChange={e => setNewSub(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="+ Add"
          className="px-3 py-1.5 rounded-md text-xs bg-transparent border border-dashed border-border/50 focus:border-primary/50 outline-none text-muted-foreground focus:text-foreground transition-all w-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* YouTube */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Play className="h-3 w-3" /> YouTube
          </p>
          <div className="space-y-2">
            {[1].map((v, i) => (
              <a 
                key={i} 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeSubject + ' crash course')}`} 
                target="_blank" 
                rel="noreferrer"
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all cursor-pointer group shadow-[0_0_10px_hsl(185,80%,55%/0)] hover:shadow-[0_0_15px_hsl(185,80%,55%/0.2)]"
                >
                  <p className="text-xs font-medium group-hover:glow-text transition-all">Search {activeSubject} Crash Course</p>
                  <p className="text-[10px] text-muted-foreground mt-1 mono-font">youtube.com</p>
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* Notebooks */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <FileText className="h-3 w-3" /> NotebookLM
          </p>
          <div className="space-y-2">
            {[1].map((n, i) => (
              <a 
                key={i} 
                href="https://notebooklm.google.com/" 
                target="_blank" 
                rel="noreferrer"
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-[#ff5f56]/50 transition-all cursor-pointer group shadow-[0_0_10px_hsl(330,80%,60%/0)] hover:shadow-[0_0_15px_hsl(330,80%,60%/0.2)]"
                >
                  <p className="text-xs font-medium group-hover:glow-text-pink transition-all">{activeSubject} Summary Guide</p>
                  <p className="text-[10px] text-muted-foreground mt-1 mono-font">notebooklm.google.com</p>
                </motion.div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
