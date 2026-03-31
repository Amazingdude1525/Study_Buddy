import { useState } from "react";
import FaceScanner from "../FaceScanner";
import Chatbot from "../Chatbot/Chatbot";
import PomodoroTimer from "../PomodoroTimer/PomodoroTimer";

export default function FocusRoom() {
  const [scannerActive, setScannerActive] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold glow-text">Focus Mode</h1>
        <p className="text-sm text-muted-foreground">Engage deep work mode. Your AI tracks your posture, emotion, and guides your sessions.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FaceScanner onScanStateChange={setScannerActive} />
          <PomodoroTimer subject="Deep Work Session" />
        </div>
        <div className="glass-card flex-1 overflow-hidden min-h-[500px] flex flex-col">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
