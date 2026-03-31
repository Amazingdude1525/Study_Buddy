import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { runCode } from '../../services/api';
import { Play, RotateCcw, Code } from 'lucide-react';
import { useTheme } from '../../services/theme';

const STARTER = `# Welcome to the Vityarthi AI Terminal.
# Fully integrated Python 3 kernel.

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(f"[{i}] Fibonacci computation: {fibonacci(i)}")
`;

const EXAMPLES = [
  { label: 'Fibonacci', code: STARTER },
  { label: 'Neural Net (Pseudo)', code: `# Neural network initialization
import random

epochs = 5
learning_rate = 0.01

for epoch in range(1, epochs + 1):
    loss = random.uniform(0.1, 0.9) / epoch
    print(f"Epoch {epoch}/{epochs} [==============================] - loss: {loss:.4f} - accuracy: {1.0 - loss:.4f}")` },
  { label: 'Dictionary', code: `# Word frequency counter
text = "the quick brown fox jumps over the lazy dog"
words = text.split()
freq = {w: words.count(w) for w in words}

for word, count in sorted(freq.items(), key=lambda x: -x[1]):
    print(f"{word:12} {'█' * count} ({count})")` },
];

export default function CodePlayground() {
  const { theme } = useTheme();
  const [language, setLanguage] = useState<'python' | 'c' | 'cpp'>('python');
  const [code, setCode] = useState(STARTER);
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
      setError('[FATAL] Connection refused. Is the Kernel alive on port 8000?');
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

      <div className="flex items-center gap-2 px-4 py-2 bg-[#1f2335]/50 border-b border-white/5">
        <select 
          value={language}
          onChange={(e) => {
            const val = e.target.value as any;
            setLanguage(val);
            if (val === 'c') setCode('#include <stdio.h>\\n\\nint main() {\\n    printf("Hello Vityarthi C Compiler!\\\\n");\\n    return 0;\\n}');
            else if (val === 'cpp') setCode('#include <iostream>\\n\\nint main() {\\n    std::cout << "Hello Vityarthi C++ Compiler!" << std::endl;\\n    return 0;\\n}');
            else setCode(STARTER);
          }}
          className="bg-black/80 border border-white/10 rounded-md text-xs font-bold text-[#a9b1d6] px-2 py-1 outline-none focus:border-[#7aa2f7]/50 uppercase tracking-wider"
        >
          <option value="python">Python 3</option>
          <option value="c">GNU C (gcc)</option>
          <option value="cpp">GNU C++ (g++)</option>
        </select>
        
        <div className="w-px h-4 bg-white/10 mx-2" />

        {EXAMPLES.map(ex => (
          <button key={ex.label} className={`px-3 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-[#a9b1d6] transition-colors mono-font ${language !== 'python' ? 'opacity-30 pointer-events-none' : ''}`} onClick={() => setCode(ex.code)}>
            {ex.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="p-1.5 rounded-md hover:bg-white/10 text-[#a9b1d6] transition-colors" onClick={() => { setCode(''); setOutput(''); setError(''); }} title="Clear">
          <RotateCcw size={14} />
        </button>
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#7aa2f7]/20 hover:bg-[#7aa2f7]/30 text-[#7aa2f7] border border-[#7aa2f7]/30 transition-all font-semibold text-xs"
          onClick={run} 
          disabled={running}
        >
          <Play size={12} className={running ? 'animate-pulse' : ''} />
          {running ? 'EXECUTING...' : 'RUN.py'}
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

        {/* Console Output */}
        <div className="h-1/3 bg-[#000000]/60 border-t border-white/10 p-4 font-mono text-sm overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 text-[#7aa2f7]/70 text-xs">
            <span>$ {language === 'python' ? 'python3 main.py' : language === 'c' ? 'gcc main.c -o exec && ./exec' : 'g++ main.cpp -o exec && ./exec'}</span>
            {running && <span className="animate-pulse">_</span>}
          </div>
          
          <div className="text-[#a9b1d6] whitespace-pre-wrap leading-relaxed">
            {!output && !error && !timedOut && (
              <span className="text-[#565f89] italic">Awaiting kernel command execution...</span>
            )}
            {timedOut && <span className="text-[#e0af68]">➜ [TIMEOUT] Execution exceeded 5000ms limit. Sandbox terminated.</span>}
            {output && <span className="text-[#9ece6a]">{output}</span>}
            {error && <span className="text-[#f7768e]">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
