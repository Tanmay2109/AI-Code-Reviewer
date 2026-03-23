import Navbar from "./Navbar";
import { ArrowRight, Code2, AlertTriangle, BugOff, Trophy, Shield, Zap } from "lucide-react";
import { CHALLENGES } from "../challengesData";

export default function ChallengesPage({ onNavigate, currentPath }) {

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      <div className="orb bg-primary-600 w-[500px] h-[500px] top-[-100px] left-[-150px]" />
      <div className="orb bg-accent-600 w-[600px] h-[600px] bottom-[-200px] right-[-200px] opacity-20" />
      
      <Navbar onNavigate={onNavigate} currentPath={currentPath} />
      
      <main className="w-full max-w-7xl px-6 pt-32 pb-12 flex-1 animate-slide-up">
        <div className="text-center mb-16">
          <p className="inline-flex rounded-full border border-accent-500/20 bg-accent-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-300 mb-4 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
            Coding Dojo
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Security & Logic <span className="gradient-text">Challenges</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Test your skills by identifying and patching vulnerabilities in real-world scenarios. Earn rank and level up your neural profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((c, idx) => (
             <article key={c.id} className="glass-card p-6 group hover:-translate-y-1 transition-all cursor-pointer">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 rounded-lg bg-surfaceHover border border-white/5 shadow-glass-sm group-hover:shadow-glow transition-all">
                   <c.icon className={`h-6 w-6 ${c.color}`} />
                 </div>
                 <div className="text-right">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${c.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : c.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : c.difficulty === 'Hard' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                     {c.difficulty}
                   </span>
                 </div>
               </div>
               <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-300 transition-colors">{c.title}</h3>
               <p className="text-sm text-slate-400 mb-6 border-b border-white/5 pb-4">Focus area: {c.topic}</p>
               
               <button onClick={() => onNavigate(`/learn?id=${c.id}`)} className="w-full btn-primary !py-2 !px-4 text-sm bg-transparent border border-primary-500/30 hover:border-primary-500">
                 Solve Challenge <ArrowRight className="h-4 w-4" />
               </button>
             </article>
          ))}
        </div>
      </main>
    </div>
  );
}

