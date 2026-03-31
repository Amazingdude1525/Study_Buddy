import React, { useState, useRef, useEffect } from 'react';
import { streamAdvisorChat, streamDailyPlan } from '../../services/api';
import { Send, Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message { role: 'user' | 'ai'; text: string; }

const SUGGESTIONS = [
  'Plan my day for maximum productivity',
  'What should I study first?',
  'I\'m feeling burnt out, help me',
  'Explain what recursion is simply',
  'How do I improve my focus?',
  'Give me a 30-day DSA roadmap',
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '👋 Hi! I\'m your AI study advisor powered by Gemini. Ask me anything — how to plan your day, study tips, subject help, or motivation. I know your goals and will give personalized advice!' },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [mood, setMood] = useState('focused');
  const [planMode, setPlanMode] = useState(false);
  const [hours, setHours] = useState(4);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || streaming) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setStreaming(true);
    setMessages(m => [...m, { role: 'ai', text: '' }]);

    streamAdvisorChat(
      text, mood, '',
      (chunk) => setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + chunk };
        return copy;
      }),
      () => setStreaming(false),
    );
  };

  const generatePlan = () => {
    setStreaming(true);
    setMessages(m => [...m,
      { role: 'user', text: `Generate my study plan for today (${hours}h available, mood: ${mood})` },
      { role: 'ai', text: '' },
    ]);
    streamDailyPlan(mood, hours,
      (chunk) => setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + chunk };
        return copy;
      }),
      () => setStreaming(false),
    );
    setPlanMode(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
            <Sparkles className="h-5 w-5 glow-text" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Study Advisor</h2>
            <p className="text-xs text-muted-foreground">Powered by Gemini Neural Engine</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="bg-secondary/40 border border-border/50 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            value={mood} 
            onChange={e => setMood(e.target.value)}
          >
            {['focused','happy','sad','angry','neutral'].map(m => (
              <option key={m} value={m} className="bg-secondary text-foreground">{m.toUpperCase()}</option>
            ))}
          </select>
          <button 
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
            onClick={() => setPlanMode(!planMode)}
          >
            <Calendar className="h-3 w-3" />
            Daily Plan
          </button>
        </div>
      </div>

      {planMode && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 border-primary/30 bg-primary/5"
        >
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Generate Today's Neural Plan
          </h4>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Available Hours</label>
              <input 
                type="number" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all text-white" 
                min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)} 
              />
            </div>
            <button 
              className="mt-5 px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm glow-btn disabled:opacity-50" 
              onClick={generatePlan} 
              disabled={streaming}
            >
              Generate
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Chat Window */}
      <div className="glass-card flex-1 flex flex-col overflow-hidden relative border-white/5 bg-black/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20">
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-none' 
                  : 'bg-secondary/40 border border-border/50 text-muted-foreground rounded-tl-none relative overflow-hidden'
              }`}>
                {m.role === 'ai' && <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />}
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.role === 'ai' && streaming && i === messages.length - 1 && (
                  <motion.span 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                  />
                )}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions Shelf */}
        {messages.length < 3 && (
          <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/5">
            {SUGGESTIONS.map(s => (
              <button 
                key={s} 
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative flex items-center gap-2">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all text-white placeholder:text-white/20"
              placeholder="Ask your AI advisor anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              disabled={streaming}
            />
            <button 
              className="absolute right-2 p-2 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-30 transition-all"
              onClick={() => sendMessage(input)} 
              disabled={streaming || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
