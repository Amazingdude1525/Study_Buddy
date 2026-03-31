import SubjectsPanel from "../SubjectsPanel";
import CodePlayground from "../CodePlayground/CodePlayground";

export default function SubjectsRoom() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight glow-text-cyan">Study Materials & Terminal</h1>
        <p className="text-sm text-muted-foreground mt-2">Access your study guides, NotebookLM links, and program directly in the live terminal.</p>
      </div>
      
      <div className="w-full max-w-3xl">
        <SubjectsPanel />
      </div>

      <div className="glass-card overflow-hidden h-[700px] flex flex-col shadow-[0_0_30px_hsl(263,70%,50%/0.1)]">
        <CodePlayground />
      </div>
    </div>
  );
}
