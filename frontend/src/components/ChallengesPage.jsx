import Navbar from "./Navbar";
import { ArrowRight, Code2, AlertTriangle, BugOff, Trophy, Shield, Zap } from "lucide-react";
import { CHALLENGES } from "../challengesData";
import { useState, useEffect, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, PieChart, Pie } from "recharts";

export default function ChallengesPage({ onNavigate, currentPath }) {
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    try {
      const existingRaw = localStorage.getItem('bugsense-progress');
      if (existingRaw) setProgressData(JSON.parse(existingRaw));
    } catch(e) {}
  }, []);

  const totalChallenges = CHALLENGES.length;
  const completedChallenges = useMemo(() => {
    return Object.values(progressData).filter(p => p.passed === p.total).length;
  }, [progressData]);

  const difficultyStats = useMemo(() => {
    const stats = { Easy: { passed: 0, total: 0 }, Medium: { passed: 0, total: 0 }, Hard: { passed: 0, total: 0 }, Expert: { passed: 0, total: 0 } };
    CHALLENGES.forEach(c => {
        stats[c.difficulty].total += 1;
        if (progressData[c.id] && progressData[c.id].passed === progressData[c.id].total) {
            stats[c.difficulty].passed += 1;
        }
    });
    return [
       { name: "Easy", completed: stats.Easy.passed, total: stats.Easy.total, color: "#10b981" },
       { name: "Medium", completed: stats.Medium.passed, total: stats.Medium.total, color: "#f59e0b" },
       { name: "Hard", completed: stats.Hard.passed, total: stats.Hard.total, color: "#ef4444" },
       { name: "Expert", completed: stats.Expert.passed, total: stats.Expert.total, color: "#8b5cf6" },
    ];
  }, [progressData]);

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

        {/* Global Progress Dashboard */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
           <div className="glass-panel p-6 col-span-1 lg:col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 z-10">Global Integrity</h3>
              <div className="h-40 w-full z-10 text-center relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={[{ value: completedChallenges, fill: "#3b82f6" }, { value: totalChallenges - completedChallenges, fill: "rgba(255,255,255,0.05)" }]}
                       cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                       stroke="none" dataKey="value" startAngle={90} endAngle={-270}
                     />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-3xl font-extrabold text-white leading-none">{completedChallenges}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">/ {totalChallenges} Solved</span>
                </div>
              </div>
           </div>

           <div className="glass-panel p-6 col-span-1 lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Completion by Threat Level</h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyStats} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                    <XAxis type="number" domain={[0, 'dataMax']} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} width={60} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }} />
                    <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: 'rgba(255,255,255,0.05)', radius: [0,4,4,0] }}>
                      {difficultyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((c, idx) => {
             const pData = progressData[c.id];
             const testsPassed = pData ? pData.passed : 0;
             const testsTotal = c.testCases.length;
             const isFullySolved = testsPassed === testsTotal;

             return (
             <article key={c.id} className={`glass-card p-6 group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden ${isFullySolved ? 'border-emerald-500/30' : ''}`}>
               {isFullySolved && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-[30px] rounded-full pointer-events-none"></div>}
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="p-3 rounded-lg bg-surfaceHover border border-white/5 shadow-glass-sm group-hover:shadow-glow transition-all">
                   <c.icon className={`h-6 w-6 ${isFullySolved ? 'text-emerald-400' : c.color}`} />
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${c.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : c.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : c.difficulty === 'Hard' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                     {c.difficulty}
                   </span>
                   {pData && (
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${isFullySolved ? 'text-emerald-400' : 'text-amber-400'}`}>
                       {testsPassed} / {testsTotal} PASS
                     </span>
                   )}
                 </div>
               </div>
               <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-300 transition-colors relative z-10">{c.title}</h3>
               <p className="text-sm text-slate-400 mb-6 border-b border-white/5 pb-4 relative z-10">Focus area: {c.topic}</p>
               
               <button onClick={() => onNavigate(`/learn?id=${c.id}`)} className={`w-full btn-primary !py-2 !px-4 text-sm transition-all relative z-10 ${isFullySolved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-transparent border border-primary-500/30 hover:border-primary-500'}`}>
                 {isFullySolved ? 'Review Payload' : 'Solve Challenge'} <ArrowRight className="h-4 w-4" />
               </button>
             </article>
             );
          })}
        </div>
      </main>
    </div>
  );
}

