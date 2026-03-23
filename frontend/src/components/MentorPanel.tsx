'use client';

import React from 'react';
import { Lightbulb, History, BrainCircuit, CheckCircle2, ChevronRight, AlertTriangle, PartyPopper } from 'lucide-react';

interface MemoryEntry {
  category: string;
  content: string;
  topic?: string;
}

interface MentorPanelProps {
  memories: MemoryEntry[];
  hint: string | null;
  onGetHint: () => void;
  loading: boolean;
  reflection: any | null;
}

const MentorPanel: React.FC<MentorPanelProps> = ({ 
  memories, hint, onGetHint, loading, reflection
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 p-8 overflow-y-auto w-[450px] shrink-0 sticky right-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-100">
           <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
           <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">AI Mentor</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Personalized Hindsight</p>
        </div>
      </div>

      {/* History Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <History className="w-4 h-4 text-primary-500" />
              <span>Hindsight History</span>
           </div>
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200"></span>
        </div>
        <div className="flex flex-col gap-3">
          {memories.length > 0 ? memories.slice(0, 4).map((m, i) => (
            <div key={i} className="group p-5 bg-white border border-slate-200/60 rounded-[28px] text-sm shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <span className="font-black text-[9px] text-primary-600 block mb-2 uppercase tracking-widest italic">{m.category.replace('_', ' ')}</span>
              <p className="text-slate-600 leading-relaxed font-medium line-clamp-2">{m.content}</p>
            </div>
          )) : (
            <div className="p-8 bg-slate-100/50 border border-dashed border-slate-300 rounded-[32px] text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">New Student Brain...</p>
            </div>
          )}
        </div>
      </section>

      {/* Actionable Hint Section */}
      <section className="mb-12 flex-1">
        <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Lightbulb className="w-4 h-4 text-orange-500" />
          <span>Adaptive Support</span>
        </div>
        
        {hint ? (
          <div className="p-6 bg-primary-600 text-white rounded-[32px] text-base leading-relaxed shadow-xl shadow-primary-200/50 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 font-bold text-4xl leading-none italic pointer-events-none">HINT</div>
             <p className="font-medium relative z-10">{hint}</p>
          </div>
        ) : (
          <div className="p-8 bg-white border border-slate-200 rounded-[40px] text-center shadow-sm">
            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed italic">"I've recalled your history. Stuck indexed? I can nudge you based on your old patterns."</p>
            <button 
              onClick={onGetHint}
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-100 group active:scale-95"
            >
              {loading ? 'Thinking...' : 'Get Contextual Nudge'}
              {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}
      </section>

      {/* Reflection Footer */}
      {reflection && (
        <section className="animate-in fade-in zoom-in-95 duration-500">
           <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <PartyPopper className="w-4 h-4 text-green-500" />
                 <span>Reflection Summary</span>
              </div>
              <p className="text-slate-800 font-bold mb-4 text-xl tracking-tight leading-tight">
                {reflection.correctness ? "Memory Synchronized!" : "Pattern Detected!"}
              </p>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner mb-6">
                <p className="text-slate-600 text-sm leading-relaxed italic">"{reflection.reflection}"</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {reflection.mistake_patterns?.map((p: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-[9px] rounded-full uppercase font-black border border-red-100">{p}</span>
                ))}
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

export default MentorPanel;
