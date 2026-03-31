import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { runCode } from '../../services/api';
import { Play, RotateCcw, Code } from 'lucide-react';
import { useTheme } from '../../services/theme';
import { motion } from 'framer-motion';

const STARTER_CODE = {
  python: `# Vityarthi AI Python Kernel v3.12
def fibonacci(n):
    return n if n <= 1 else fibonacci(n - 1) + fibonacci(n - 2)

for i in range(8):
    print(f"Fib({i}): {fibonacci(i)}")`,
  c: `#include <stdio.h>
int main() {
    printf("Vityarthi C Compiler Initialized...\\n");
    for(int i=0; i<5; i++) printf("Loop cycle %d\\n", i);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Vityarthi C++ Environment [g++ 15.2]" << endl;
    vector<string> items = {"Logic", "Memory", "Speed"};
    for(const auto& item : items) cout << "Processing " << item << "..." << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Vityarthi Java Neural Kernel [JDK 17]");
        for(int i=1; i<=3; i++) {
            System.out.println("Execution Layer: " + i);
        }
    }
}`
};

const EXAMPLES = [
  { label: 'Fibonacci', code: STARTER_CODE.python },
  { label: 'Neural Net', code: `# Neural network progress simulation
import random
import time

for epoch in range(1, 6):
    loss = random.uniform(0.1, 0.5) / epoch
    print(f"Epoch {epoch}/5 - loss: {loss:.4f} - acc: {1.0-loss:.4f}")
    time.sleep(0.1)` 
  },
];

export default function CodePlayground() {
  const { theme } = useTheme();
  const [language, setLanguage] = useState<'python' | 'c' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const run = async () => {
    setRunning(true);
    setOutput('');
    setError('');
    setTimedOut(false);
    try {
      const res = await runCode(code, language);
      setOutput(res.data.output);
      setError(res.data.error);
      setTimedOut(res.data.timed_out);
    } catch {
      setError('[FATAL] Neural Kernel Disconnect. Check backend log.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1b26]/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* macOS Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1f2335]/95 border-b border-black/50">
        <div className="flex gap-2.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner border border-[#e0443e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner border border-[#dea123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner border border-[#1aab29]"></div>
        </div>
        <div className="text-xs font-bold text-[#a9b1d6] mono-font tracking-widest flex items-center gap-2">
          <Code size={14} className="text-[#7aa2f7]" />
          vityarthi@ai-terminal:~
        </div>
        <div className="w-[50px]"></div> {/* Setup equal spacing */}
      </div>

      <div className="flex items-center gap-2 px-6 py-3 bg-black/20 border-b border-white/5 overflow-x-auto scrollbar-hide">
        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mr-2">Language:</div>
        <select 
          value={language}
          onChange={(e) => {
            const val = e.target.value as any;
            setLanguage(val);
            setCode(STARTER_CODE[val as keyof typeof STARTER_CODE]);
          }}
          className="bg-primary/10 border border-primary/20 rounded-lg text-xs font-bold text-primary px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary transition-all uppercase"
        >
          <option value="python" className="bg-[#0f172a]">Python 3.12</option>
          <option value="c" className="bg-[#0f172a]">GNU C (gcc)</option>
          <option value="cpp" className="bg-[#0f172a]">GNU C++ (g++)</option>
          <option value="java" className="bg-[#0f172a]">Java 17 (openjdk)</option>
        </select>
        
        <div className="w-px h-6 bg-white/5 mx-4" />

        <div className="flex gap-2">
          {EXAMPLES.map(ex => (
            <button 
              key={ex.label}
              className={`px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter ${language !== 'python' ? 'opacity-20 pointer-events-none' : ''}`}
              onClick={() => setCode(ex.code)}
            >
              {ex.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1" />
        
        <button className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-all" onClick={() => { setCode(''); setOutput(''); setError(''); }}>
          <RotateCcw size={14} />
        </button>
        <button 
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-white font-bold text-xs glow-btn disabled:opacity-50 transition-all"
          onClick={run} 
          disabled={running}
        >
          {running ? 'EXECUTING...' : 'EXECUTE'}
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={v => setCode(v || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'} /* Force dark theme for terminal vibe */
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              lineNumbers: 'on',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              formatOnType: true,
            }}
          />
        </div>

        <div className={`h-[35%] bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col z-20 transition-all ${!output && !error && !running ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
          <div className="px-6 py-3 flex items-center justify-between border-b border-white/5 shrink-0">
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="text-primary font-mono">$</span> KERNEL_STDOUT
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">{running ? 'Busy' : 'Idle'}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
            {timedOut && <div className="text-orange-400 mb-2">[CRITICAL] TIMEOUT: Neural Kernel threshold exceeded.</div>}
            {error && <div className="text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 mb-4 whitespace-pre-wrap">{error}</div>}
            {output && <div className="text-green-400 font-medium whitespace-pre-wrap">{output}</div>}
            {!output && !error && !running && <div className="text-muted-foreground/30 italic">Kernel awaiting bytecode stream...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
