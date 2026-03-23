'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { problemService, authService, memoryService } from '@/services/api';
import { Brain, ChevronRight, History, PlayCircle, BarChart3, Code2, Sparkles, UserCircle } from 'lucide-react';

export default function LandingPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await authService.login('demo_student', 'python');
        setUser(userRes.data);
        
        const [probRes, sumRes] = await Promise.all([
          problemService.list(),
          memoryService.summary(userRes.data.id)
        ]);
        
        setProblems(probRes.data);
        setSummary(sumRes.data);
      } catch (err) {
        console.error('Landing load failed', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-12 h-12 bg-primary-600 rounded-xl animate-bounce flex items-center justify-center text-white">
        <Brain className="w-6 h-6" />
      </div>
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Recalling your memory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-200">RC</div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">RECALLCODE</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm">
              <UserCircle className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">{user?.username}</span>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-16 px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Dashboard */}
          <div className="flex-1">
             <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-primary-100 italic">
                  <Sparkles className="w-3 h-3" /> Hindsight Activated
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-none">Welcome back, {user?.username}</h1>
                <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">Your mentor has been reflecting on your recent work. Ready to tackle those <span className="text-primary-600 font-bold">weak spots</span> we found?</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => router.push(`/practice/${p.id}`)}
                    className="group p-8 bg-white border border-slate-200 rounded-[32px] hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 cursor-pointer flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <PlayCircle className="w-16 h-16 text-primary-500" />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors border border-slate-100">
                         <Code2 className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        p.difficulty === 'beginner' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-1">{p.title}</h3>
                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-1">{p.description}</p>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded uppercase tracking-tighter border border-slate-100">{p.topic}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Sidebar - The Learning Brain */}
          <div className="w-full lg:w-96 shrink-0 space-y-8">
             <div className="p-8 bg-primary-600 rounded-[40px] text-white shadow-2xl shadow-primary-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-primary-500 rounded-full blur-3xl opacity-50 opacity-0 group-hover:opacity-100 "></div>
                <div className="relative z-10">
                   <h4 className="flex items-center gap-2 text-xs font-black opacity-60 uppercase tracking-widest mb-8">
                      <BarChart3 className="w-4 h-4" /> Live Stats
                   </h4>
                   <div className="space-y-8">
                      <div>
                        <div className="text-6xl font-black">{summary?.total_sessions || 0}</div>
                        <div className="text-sm font-bold opacity-60 uppercase tracking-tight">Total Sessions</div>
                      </div>
                      <div className="pt-8 border-t border-primary-500/30">
                        <div className="text-6xl font-black">{Math.round((summary?.improvement_rate || 0) * 100)}%</div>
                        <div className="text-sm font-bold opacity-60 uppercase tracking-tight">Growth Growth Accuracy</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm relative group overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-5 font-black text-8xl leading-none pointer-events-none select-none">BRAIN</div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">Hindsight Summary</h4>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner relative">
                    <p className="text-slate-700 text-sm italic leading-relaxed relative z-10">
                      "{summary?.summary || "Let's start your first session to build your coding memory!"}"
                    </p>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200 font-bold text-lg">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Topic Focus</div>
                        <div className="text-sm font-bold text-slate-700">Recursion & Arrays</div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
