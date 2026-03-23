import { Bug, ArrowLeft } from "lucide-react";

export default function Navbar({ onNavigate, backHref, rightElement, currentPath }) {
  return (
    <nav className="fixed top-4 z-50 w-[90%] left-1/2 -translate-x-1/2 max-w-7xl rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-xl shadow-glass-sm pl-4 pr-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {backHref && (
          <button onClick={() => onNavigate(backHref)} className="p-2 hover:bg-white/10 rounded-xl transition-colors group">
            <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        )}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("/")}>
          <div className="rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-600 p-2 shadow-glow">
            <Bug className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md hidden sm:block">BugSense AI</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex ml-8 gap-1">
          {[
             { path: '/', label: 'Home' },
             { path: '/analyzer', label: 'Matrix' },
             { path: '/challenges', label: 'Challenges' },
             { path: '/learn', label: 'Play & Learn' },
          ].map(link => (
             <button 
               key={link.path}
               onClick={() => onNavigate(link.path)}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPath === link.path ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               {link.label}
             </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {rightElement}
      </div>
    </nav>
  );
}
