import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Code, Mail, Globe, Code2, Send, Mic } from "lucide-react";
import { useRef, useEffect } from "react";

export default function DeveloperProfile() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => (prev ? prev + " " : "") + transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {}
    }
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message from ${email} sent to Prateek's inbox! (Simulated)`);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold tracking-tight glow-text-cyan mb-3">The Architect</h1>
        <p className="text-muted-foreground">Crafted with precision by Prateek Das.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 flex flex-col items-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-40 h-40 mb-6 rounded-full p-1 bg-gradient-to-tr from-primary to-[hsl(185,80%,55%)] shadow-[0_0_30px_hsl(263,70%,50%/0.3)]">
            <img 
              src="/developer.jpg" 
              alt="Prateek Das" 
              className="w-full h-full object-cover rounded-full bg-secondary border-4 border-background"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Prateek+Das&background=random&size=200";
              }}
            />
          </div>

          <h2 className="text-2xl font-bold glow-text mb-1">Prateek Das</h2>
          <p className="text-sm text-muted-foreground mono-font mb-6">Full Stack AI Developer</p>

          <div className="flex gap-4">
            <a href="https://github.com/Amazingdude1525" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary hover:bg-white/10 hover:text-white transition-colors border border-border/50">
              <Code className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/prateek-das-a45215252/" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary hover:bg-[#0077b5]/20 hover:text-[#0077b5] transition-colors border border-border/50">
              <UserPlus className="w-5 h-5" />
            </a>
            <a href="https://prateek-verse.vercel.app/" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-colors border border-border/50">
              <Globe className="w-5 h-5" />
            </a>
            <a href="mailto:prateekdas5255@gmail.com" className="p-3 rounded-full bg-secondary hover:bg-[#ea4335]/20 hover:text-[#ea4335] transition-colors border border-border/50">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="h-5 w-5 glow-text-pink" />
            <h3 className="text-xl font-bold">Contact Developer</h3>
          </div>

          <form onSubmit={handleContact} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Your Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/50 transition-all text-foreground placeholder:text-muted-foreground/50 relative z-50 pointer-events-auto"
                placeholder="hello@example.com"
              />
            </div>
            <div className="relative">
              <label className="block text-xs text-muted-foreground mb-1">Message for Prateek</label>
              <textarea 
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/50 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none relative z-50 pointer-events-auto"
                placeholder="Loved the AI Vityarthi platform! Let's connect..."
              />
              <button
                type="button"
                onClick={toggleListen}
                className={`absolute right-3 bottom-3 p-1.5 rounded-full transition-colors z-[60] ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                title="Voice Type Message"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <button 
              type="submit"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 glow-btn font-medium mt-2"
            >
              <Send className="w-4 h-4 ml-1" />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
