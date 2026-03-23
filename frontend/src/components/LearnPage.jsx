import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Play, CheckCircle2, ChevronRight, TerminalSquare, AlertTriangle, ArrowRight } from "lucide-react";
import Editor from "@monaco-editor/react";
import { CHALLENGES } from "../challengesData";

export default function LearnPage({ onNavigate, currentPath, search }) {
  const params = new URLSearchParams(search || "");
  const challengeId = params.get("id") || "mission-1";
  const challenge = CHALLENGES.find(c => c.id === challengeId) || CHALLENGES[0];
  
  const currentIndex = CHALLENGES.findIndex(c => c.id === challenge.id);
  const hasNext = currentIndex >= 0 && currentIndex < CHALLENGES.length - 1;
  const nextChallenge = hasNext ? CHALLENGES[currentIndex + 1] : null;

  const [code, setCode] = useState(challenge.initialCode);
  const [output, setOutput] = useState("$ waiting for code execution...");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setCode(challenge.initialCode);
    setOutput("$ waiting for code execution...");
    setShowHint(false);
  }, [challenge.id]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    let initialTerminal = "$ Compiling neural pathways...\n$ Running heuristic sandbox...";
    setOutput(initialTerminal);
    
    setTimeout(() => {
      let passedAll = true;
      let newOutput = "\n\n[TEST SUITE EXECUTION]\n";
      
      challenge.testCases.forEach((tc, idx) => {
         const passed = tc.test(code || "");
         if (!passed) passedAll = false;
         newOutput += `>> Test ${idx + 1} - ${tc.name}: ${passed ? "[PASS]" : "[FAIL]"}\n`;
      });
      
      if (passedAll) {
        newOutput += "\n[SUCCESS] Patch applied! System vulnerability resolved.";
      } else {
        newOutput += "\n[ERROR] Vulnerability still present or logic failed to execute.";
      }
      
      setOutput(initialTerminal + newOutput);
      setIsRunning(false);
    }, 800);
  };

  const currentTestCount = challenge.testCases ? challenge.testCases.length : 1;
  const passedTestCount = output.match(/\[PASS\]/g)?.length || (output.includes("[SUCCESS]") ? currentTestCount : 0);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      <div className="orb bg-primary-600 w-[500px] h-[500px] top-[-100px] left-[-150px]" />
      <div className="orb bg-accent-600 w-[600px] h-[600px] bottom-[-200px] right-[-200px] opacity-20" />
      
      <Navbar 
        onNavigate={onNavigate} 
        currentPath={currentPath}
        rightElement={
          <button onClick={handleRun} disabled={isRunning} className="btn-primary py-2 px-6 shadow-glow disabled:opacity-50 hover:shadow-accent-glow transition-all">
             <Play className="h-4 w-4" /> {isRunning ? "Running..." : "Run Code"}
          </button>
        }
      />
      
      <main className="w-full max-w-[1400px] px-6 pt-24 pb-12 flex-1 animate-slide-up flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* Left Pane - Curriculum */}
        <section className="glass-panel w-full lg:w-1/3 p-0 flex flex-col h-[calc(100vh-140px)] rounded-2xl overflow-hidden shadow-glass-sm shrink-0">
          <div className="p-6 border-b border-white/10 bg-surface/80">
            <div className="flex items-center gap-2 mb-2 text-sm text-primary-400 font-bold uppercase tracking-wider">
              <span>{challenge.topic}</span> <ChevronRight className="h-4 w-4" /> <span className={challenge.difficulty === 'Easy' ? 'text-emerald-400' : challenge.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'}>{challenge.difficulty}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white drop-shadow-md">{challenge.title}</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 text-slate-300 leading-relaxed font-medium space-y-6">
            <div className={`border p-4 rounded-xl flex items-start gap-3 bg-white/5 border-white/10`}>
              <div className="shrink-0 mt-1">
                 <AlertTriangle className={`h-5 w-5 ${challenge.color.replace('text', 'text')}`} />
              </div>
              <div>
                <strong className={`block mb-1 font-bold text-white tracking-wide`}>Context</strong>
                <p className="text-sm leading-relaxed">{challenge.description}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t border-white/10 pt-6">
              {!showHint ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-xl bg-surfaceHover/30 w-full animate-fade-in">
                  <span className="text-slate-400 font-medium mb-4 text-center">Are you stuck identifying the vulnerability?</span>
                  <div className="flex gap-4">
                    <button onClick={() => setShowHint(true)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors shadow-glass-sm hover:shadow-glow">
                      Reveal Hint & Objectives
                    </button>
                    <button onClick={() => {
                        setCode(challenge.solutionCode);
                        setOutput("Answer script injected into editor array. Tap 'Run Code' to execute validation suite.");
                    }} className="px-5 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold hover:bg-primary-500/20 transition-colors shadow-glass-sm hover:shadow-glow">
                      Reveal Final Answer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Executive Orders
                     </h3>
                     <button onClick={() => {
                        setCode(challenge.solutionCode);
                        setOutput("Answer script injected into editor array. Tap 'Run Code' to execute validation suite.");
                     }} className="px-3 py-1.5 rounded bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold hover:bg-primary-500/20 transition-colors shadow-glass-sm">
                       Reveal Valid Code
                     </button>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 bg-black/20 p-4 border border-white/5 rounded-xl">
                    {challenge.task}
                  </p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 text-sm text-slate-400">
                    <li>Review the buggy logic in the editor.</li>
                    <li>Apply your fix directly to neutralize the vulnerability.</li>
                    <li>Press <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded text-xs border border-white/10">Run Code</strong> to verify against the sandbox heuristic engine.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10 bg-surface/80 flex justify-between items-center shrink-0">
             <span className="text-sm font-bold text-slate-500">{passedTestCount}/{currentTestCount} Tests Passing</span>
             <div className="flex gap-2 relative z-10">
               <CheckCircle2 className={`h-5 w-5 transition-colors ${output.includes("[SUCCESS]") ? "text-emerald-400" : "text-slate-600"}`} />
               <TerminalSquare className="h-5 w-5 text-primary-500" />
             </div>
          </div>
        </section>

        {/* Right Pane - Live Editor */}
        <section className="glass-panel p-2 flex-1 flex flex-col h-[calc(100vh-140px)] rounded-2xl relative overflow-hidden shadow-glass-sm z-10">
             <div className="h-10 w-full border-b border-white/5 bg-[#0a0f18] flex items-center px-4 gap-2 rounded-t-xl shrink-0">
                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-[10px] text-slate-500 font-medium ml-2 uppercase tracking-widest">sandbox.py</span>
              </div>
              
              <div className="flex-1 w-full relative">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    automaticLayout: true,
                    padding: { top: 20 },
                  }}
                />
              </div>
              
              {/* Output Console area at bottom */}
              <div className="h-56 z-20 relative border-t border-white/10 bg-[#060a12] p-4 flex flex-col shrink-0">
                 <div className="flex justify-between items-center mb-2">
                   <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Terminal Output</div>
                   {output.includes("[SUCCESS]") && hasNext && (
                     <button onClick={() => onNavigate(`/learn?id=${nextChallenge.id}`)} className="text-xs flex items-center gap-1 font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded shadow-glow-sm hover:bg-emerald-500/30 transition-colors animate-fade-in">
                       Next Challenge <ArrowRight className="h-3 w-3" />
                     </button>
                   )}
                 </div>
                 <pre className={`flex-1 font-mono text-sm overflow-y-auto whitespace-pre-wrap transition-colors ${output.includes("[ERROR]") ? "text-rose-400" : output.includes("[SUCCESS]") ? "text-emerald-400" : "text-slate-400"}`}>
                   {output}
                 </pre>
              </div>
        </section>

      </main>
    </div>
  );
}
