'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useRouter } from 'next/navigation';
import { problemService, sessionService, memoryService } from '@/services/api';
import MentorPanel from '@/components/MentorPanel';
import { ArrowLeft, Play, Save, ChevronRight, CheckCircle, Brain, Target, Info } from 'lucide-react';

export default function PracticePage() {
  const params = useParams();
  const problemId = params.problemId;
  const router = useRouter();
  
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [session, setSession] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [reflection, setReflection] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(1);

  useEffect(() => {
    async function init() {
      if (!problemId) return;
      try {
        const [probRes, memRes] = await Promise.all([
          problemService.get(Number(problemId)),
          memoryService.list(userId)
        ]);
        
        setProblem(probRes.data);
        setCode(probRes.data.base_code);
        setMemories(memRes.data);
        
        const sessRes = await sessionService.start(userId, Number(problemId), 'python');
        setSession(sessRes.data);
      } catch (err) {
        console.error('Practice init failed', err);
      }
    }
    init();
  }, [problemId, userId]);

  const handleGetHint = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await sessionService.getHint(userId, session.id, code);
      setHint(res.data.hint);
    } catch (err) {
      console.error('Hint fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await sessionService.submit(userId, session.id, code);
      setReflection(res.data);
      const memRes = await memoryService.list(userId);
      setMemories(memRes.data);
    } catch (err) {
      console.error('Submit failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 gap-4">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing Workspace...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="hover:text-primary-600 p-3 rounded-2xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-black text-slate-800 text-xl tracking-tight">{problem.title}</h1>
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-black uppercase tracking-widest border border-primary-100">{problem.difficulty}</span>
              </div>
              <p className="text-xs text-slate-400 font-bold tracking-tighter uppercase">{problem.topic} Module</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 border border-slate-200">
              <Play className="w-4 h-4" /> Run Sandbox
            </button>
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-200 transition-all flex items-center gap-2 active:scale-95">
              {loading ? 'Analyzing...' : 'Finish Attempt'}
              {!loading && <CheckCircle className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Problem Details */}
          <div className="w-[400px] border-r border-slate-200 p-8 overflow-y-auto bg-slate-50/30">
            <div className="mb-10">
               <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-white w-fit px-3 py-1 rounded-full border border-slate-100">
                  <Info className="w-3.5 h-3.5 text-primary-500" /> Instructions
               </div>
               <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">{problem.description}</p>
            </div>
            
            <div className="mb-8">
               <div className="flex items-center gap-2 mb-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-white w-fit px-3 py-1 rounded-full border border-slate-100">
                  <Target className="w-3.5 h-3.5 text-orange-500" /> Focus Target
               </div>
               <div className="p-5 bg-white border border-slate-200 rounded-[28px] shadow-sm">
                  <span className="text-sm font-bold text-slate-800 block mb-2">{problem.topic}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">Pay close attention to your memory history on the right. Your mentor will chime in if you repeat old mistakes.</p>
               </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-[#1e1e1e] overflow-hidden relative group">
            <div className="absolute top-4 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="px-2 py-1 bg-white/10 backdrop-blur text-white/40 text-[10px] rounded font-bold uppercase tracking-widest border border-white/10">Python 3.10</span>
            </div>
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 15,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                padding: { top: 24 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            />
          </div>
        </div>
      </div>

      {/* Adaptive Mentor Panel */}
      <MentorPanel 
        memories={memories}
        hint={hint}
        onGetHint={handleGetHint}
        loading={loading}
        reflection={reflection}
      />
    </div>
  );
}
