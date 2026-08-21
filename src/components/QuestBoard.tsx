import React, { useState } from 'react';
import { GameState } from '../types';
import { X, Lock, Play, CheckCircle, Sparkles, Loader2, Map as MapIcon, List } from 'lucide-react';
import { Scenario } from '../data/scenarioData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onStartQuest: (questId: number) => void;
  onGenerateAIQuest: () => Promise<void>;
}

export function QuestBoard({ isOpen, onClose, gameState, onStartQuest, onGenerateAIQuest }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateAIQuest();
    setIsGenerating(false);
  };

  // Map Layout Calculations
  const questsPerRow = 3;
  const rowHeight = 250;
  const totalRows = Math.ceil(gameState.quests.length / questsPerRow);
  const totalMapHeight = Math.max(totalRows * rowHeight, 400);

  const getQuestPosition = (index: number) => {
    const row = Math.floor(index / questsPerRow);
    const isEvenRow = row % 2 === 0;
    const colIndex = index % questsPerRow;
    const actualCol = isEvenRow ? colIndex : (questsPerRow - 1 - colIndex);
    const spacingX = 100 / questsPerRow;
    const x = (actualCol * spacingX) + (spacingX / 2);
    const y = (row * rowHeight) + (rowHeight / 2);
    return { x, y };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2">
              <MapIcon size={24} className="text-emerald-500" />
              Keliling Indonesia
            </h2>
            <p className="text-slate-400 text-sm mt-1">Selesaikan kasus di berbagai daerah dan buka zona baru.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <MapIcon size={14} /> Peta
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={14} /> Daftar
            </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wide text-xs transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Kasus AI Baru
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">
          
          {viewMode === 'map' ? (
            <div className="relative w-full" style={{ height: `${totalMapHeight}px` }}>
              {/* Decorative Map Background pattern (optional abstract dots) */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              
              {/* SVG Connecting Lines */}
              <svg className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: `${totalMapHeight}px` }}>
                {gameState.quests.map((quest, i) => {
                  if (i === 0) return null;
                  const prevPos = getQuestPosition(i - 1);
                  const currPos = getQuestPosition(i);
                  const isCompletedOrAvailable = quest.status !== 'locked';
                  
                  return (
                    <line 
                      key={`line-${i}`} 
                      x1={`${prevPos.x}%`} 
                      y1={prevPos.y} 
                      x2={`${currPos.x}%`} 
                      y2={currPos.y} 
                      stroke={isCompletedOrAvailable ? '#10b981' : '#334155'}
                      strokeWidth={isCompletedOrAvailable ? "4" : "2"}
                      strokeDasharray={isCompletedOrAvailable ? "none" : "8 8"}
                      className="transition-colors duration-500"
                    />
                  );
                })}
              </svg>

              {/* Map Nodes */}
              {gameState.quests.map((quest, i) => {
                const isLocked = quest.status === 'locked';
                const isCompleted = quest.status === 'completed';
                const isAvailable = quest.status === 'available';
                const pos = getQuestPosition(i);

                return (
                  <div 
                    key={`node-${quest.id}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 w-[200px]"
                    style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
                    onClick={() => !isLocked && onStartQuest(quest.id)}
                  >
                    {/* Node Circle */}
                    <div className={`
                      w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl
                      ${isLocked ? 'bg-slate-900 border-slate-700 text-slate-600 grayscale' : ''}
                      ${isAvailable ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse-slow' : ''}
                      ${isCompleted ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}
                    `}>
                      {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle size={28} /> : <Play size={24} className="ml-1" />}
                    </div>
                    
                    {/* Card Info Below Node */}
                    <div className={`
                      mt-3 p-3 rounded-xl border w-full text-center shadow-xl transition-all duration-300
                      ${isLocked ? 'bg-slate-900/80 border-slate-800 opacity-60' : 'bg-slate-800/90 border-slate-600 group-hover:border-emerald-500 backdrop-blur-md'}
                    `}>
                      <div className="text-[10px] font-mono font-bold text-emerald-400 mb-1 uppercase tracking-widest">{quest.lokasi}</div>
                      <h3 className={`text-sm font-bold line-clamp-2 ${isLocked ? 'text-slate-400' : 'text-slate-100'}`}>
                        {quest.judul_konflik}
                      </h3>
                      {isCompleted && (
                        <div className="mt-2 text-[10px] text-slate-400 italic">Lihat Review</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.quests.map((quest) => {
                  const isLocked = quest.status === 'locked';
                  const isCompleted = quest.status === 'completed';
                  const isAvailable = quest.status === 'available';

                  return (
                    <div 
                      key={quest.id}
                      className={`
                        relative rounded-xl border p-5 flex flex-col transition-all duration-300
                        ${isLocked ? 'bg-slate-900 border-slate-800 opacity-50 grayscale' : ''}
                        ${isAvailable ? 'bg-slate-800 border-slate-600 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1' : ''}
                        ${isCompleted ? 'bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}
                      `}
                    >
                      {/* Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded 
                          ${quest.kategori === 'Main Quest' ? 'bg-amber-900/50 text-amber-400 border border-amber-700' : 'bg-blue-900/50 text-blue-400 border border-blue-700'}
                        `}>
                          {quest.kategori}
                        </span>
                        {isLocked && <Lock size={16} className="text-slate-500" />}
                        {isCompleted && <CheckCircle size={18} className="text-emerald-500" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 mb-1 font-mono">{quest.lokasi}</div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight">{quest.judul_konflik}</h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">{quest.deskripsi}</p>
                      </div>

                      {/* Rewards / Cost */}
                      <div className="bg-slate-950/50 rounded-lg p-3 mb-4 border border-slate-800 flex justify-between items-center text-xs">
                        <div className="text-amber-400 font-bold">+ Rp {quest.reward_qris?.toLocaleString('id-ID') || 0}</div>
                        <div className="text-red-400 font-bold">- {quest.cost_energi || 0} Energi</div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => !isLocked && onStartQuest(quest.id)}
                        disabled={isLocked}
                        className={`
                          w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors
                          ${isLocked ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : ''}
                          ${isAvailable ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}
                          ${isCompleted ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900' : ''}
                        `}
                      >
                        {isLocked ? (
                          <>Terkunci</>
                        ) : isCompleted ? (
                          <>Lihat Hasil Evaluasi</>
                        ) : (
                          <><Play size={14} /> Mulai Misi</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
