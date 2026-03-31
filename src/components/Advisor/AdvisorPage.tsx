import React, { useState, useRef, useEffect } from 'react';
import { streamAdvisorChat, streamDailyPlan } from '../../services/api';
import { Send, Sparkles, Calendar } from 'lucide-react';

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
    <div className="page-body page-with-music" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 className="topbar-title"><Sparkles size={20} style={{ display: 'inline', marginRight: 8 }} />AI Advisor</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" style={{ width: 'auto', padding: '4px 10px' }} value={mood} onChange={e => setMood(e.target.value)}>
            {['focused','happy','sad','angry','neutral'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setPlanMode(!planMode)}>
            <Calendar size={14} /> Daily Plan
          </button>
        </div>
      </div>

      {planMode && (
        <div className="glass-card fade-in" style={{ margin: '16px 0', padding: 16 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Generate Today's Plan</h4>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Available hours:</label>
            <input type="number" className="input" style={{ width: 80 }} min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={generatePlan} disabled={streaming}>✨ Generate</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto', padding: '20px 0' }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role} fade-in`} style={{ whiteSpace: 'pre-wrap' }}>
            {m.text}
            {m.role === 'ai' && streaming && i === messages.length - 1 && (
              <span className="cursor">▌</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map(s => (
            <button key={s} className="chat-chip" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="input"
          placeholder="Ask your AI advisor anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          disabled={streaming}
        />
        <button className="btn btn-primary btn-icon" onClick={() => sendMessage(input)} disabled={streaming || !input.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
