import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Coffee } from "lucide-react";

export default function MusicRoom() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold tracking-tight glow-text-pink mb-4">Focus Radio</h1>
        <p className="text-muted-foreground">Continuous 24/7 Lo-Fi beats to deep study and code to.</p>
      </div>
      
      <div className="glass-player w-full max-w-2xl mx-auto p-4 rounded-3xl flex flex-col items-center relative overflow-hidden shadow-[0_0_40px_hsl(330,80%,60%/0.15)]">
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0" 
            title="Lofi Girl Radio" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
