import React from 'react';
import { X, Archive, ShieldAlert, GraduationCap, ChevronRight, User } from 'lucide-react';
import { StoryLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: StoryLog[];
}

export function DilemmaArchive({ isOpen, onClose, logs }: Props) {
  // Group logs into Dilemmas
  // A dilemma starts with a narrative, followed by an action, followed by an evaluation.
  const dilemmas: { narrative?: StoryLog; action?: StoryLog; evaluation?: StoryLog }[] = [];
  
  let currentDilemma: any = {};
  
  logs.forEach((log) => {
    if (log.type === 'narrative') {
      if (currentDilemma.narrative) {
        dilemmas.push(currentDilemma);
        currentDilemma = {};
      }
      currentDilemma.narrative = log;
    } else if (log.type === 'player_action') {
      currentDilemma.action = log;
    } else if (log.type === 'evaluation') {
      currentDilemma.evaluation = log;
      dilemmas.push(currentDilemma);
      currentDilemma = {};
    }
  });

  // Push the last one if it's incomplete but has a narrative
  if (currentDilemma.narrative && !dilemmas.includes(currentDilemma)) {
    dilemmas.push(currentDilemma);
  }

  // Reverse so newest is at the top
  const reversedDilemmas = [...dilemmas].reverse();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
              <Archive size={16} />
            </div>
            <h2 className="font-bold text-sm tracking-widest uppercase text-slate-200">Arsip Dilema</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {reversedDilemmas.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <Archive className="mx-auto mb-4 opacity-50" size={32} />
              <p className="text-sm">Belum ada riwayat dilema.</p>
            </div>
          ) : (
            reversedDilemmas.map((dilemma, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-lg overflow-hidden flex flex-col relative group">
                <div className="absolute top-0 left-0 w-1 bg-slate-700 h-full group-hover:bg-cyan-500 transition-colors"></div>
                
                {/* Narrative Section */}
                {dilemma.narrative && (
                  <div className="p-4 border-b border-slate-800">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <ShieldAlert size={12} /> Situasi
                    </h3>
                    <p className="text-sm text-slate-300 font-serif italic line-clamp-3 group-hover:line-clamp-none transition-all">
                      {dilemma.narrative.content}
                    </p>
                  </div>
                )}

                {/* Action Section */}
                {dilemma.action && (
                  <div className="p-4 bg-slate-900 border-b border-slate-800">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                      <User size={12} /> Tindakan Anda
                    </h3>
                    <p className="text-sm text-blue-100">
                      "{dilemma.action.content}"
                    </p>
                  </div>
                )}

                {/* Evaluation Section */}
                {dilemma.evaluation?.evaluation && (
                  <div className="p-4 bg-emerald-950/20">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                      <GraduationCap size={12} /> Hasil Evaluasi
                    </h3>
                    
                    <div className="flex gap-4 mb-3">
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-500 uppercase block mb-1">Sos</span>
                        <div className={`font-mono text-sm font-bold ${getScoreColor(dilemma.evaluation.evaluation.evaluasi?.skor_sosiologi || 0)}`}>
                          {dilemma.evaluation.evaluation.evaluasi?.skor_sosiologi || 0}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-500 uppercase block mb-1">Akhlak</span>
                        <div className={`font-mono text-sm font-bold ${getScoreColor(dilemma.evaluation.evaluation.evaluasi?.skor_akhlak || 0)}`}>
                          {dilemma.evaluation.evaluation.evaluasi?.skor_akhlak || 0}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {dilemma.evaluation.evaluation.evaluasi?.saran_guru || "-"}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-500';
}
