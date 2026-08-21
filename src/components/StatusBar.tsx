import React from 'react';
import { GameState } from '../types';
import { Heart, Wallet, BookOpen, Brain, Users, AlertTriangle, Archive, Target, ShieldAlert, Globe, Book } from 'lucide-react';
import { AuthButton } from './AuthButton';
import { LiveApiButton } from './LiveApiButton';

interface Props {
  state: GameState;
  onToggleArchive: () => void;
  onToggleDashboard: () => void;
  onToggleSideQuests: () => void;
  onToggleAdmin: () => void;
  onToggleChat: () => void;
  onToggleTahfidz: () => void;
  user: any;
  userProfile?: any;
}

export function StatusBar({ state, onToggleArchive, onToggleDashboard, onToggleSideQuests, onToggleAdmin, onToggleChat, onToggleTahfidz, user, userProfile }: Props) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]">
      <div className="h-16 flex items-center justify-between px-4 md:px-8 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]">AK</div>
          <h1 className="text-sm md:text-xl font-bold tracking-tight text-white uppercase">AL-KAHFI <span className="text-emerald-500 hidden md:inline">// SOSIOLOGI MEMBUMI</span></h1>
        </div>
        <div className="flex gap-2 md:gap-4 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <LiveApiButton />

          <button 
            onClick={onToggleChat}
            className="flex items-center gap-2 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Globe size={14} className="text-purple-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-purple-100 hidden lg:inline">Jaringan</span>
          </button>

          <button 
            onClick={onToggleTahfidz}
            className="flex items-center gap-2 bg-amber-900/50 hover:bg-amber-800 border border-amber-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Book size={14} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-100 hidden lg:inline">Murojaah</span>
          </button>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 hidden md:inline">Status Kota</span>
            <span className={`text-xs md:text-sm font-semibold ${getStatusColor(state.status_kota)} hidden md:inline`}>{state.status_kota}</span>
          </div>
          
          {userProfile?.role === 'ADMIN' && (
            <button 
              onClick={onToggleAdmin}
              className="flex items-center gap-2 bg-pink-900/50 hover:bg-pink-800 border border-pink-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
            >
              <ShieldAlert size={14} className="text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-pink-100 hidden lg:inline">Admin</span>
            </button>
          )}

          <button 
            onClick={onToggleSideQuests}
            className="flex items-center gap-2 bg-amber-900/50 hover:bg-amber-800 border border-amber-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Target size={14} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-100 hidden lg:inline">Misi</span>
          </button>

          <button 
            onClick={onToggleDashboard}
            className="flex items-center gap-2 bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Users size={14} className="text-indigo-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-100 hidden lg:inline">Dashboard</span>
          </button>

          <button 
            onClick={onToggleArchive}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
          >
            <Archive size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 hidden lg:inline">Arsip</span>
          </button>

          <AuthButton user={user} />
        </div>
      </div>
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-4">
          <StatBadge 
            icon={<Heart className="text-yellow-400" size={16} />} 
            label="Energi" 
            value={`${state.energi}/${state.maxEnergi || 100}`} 
            progress={Math.min(100, (state.energi / (state.maxEnergi || 100)) * 100)}
            colorClass="bg-yellow-500"
            textClass="text-yellow-400"
          />
          <StatBadge 
            icon={<Wallet className="text-emerald-400" size={16} />} 
            label="Saldo (QRIS)" 
            value={`Rp${state.uang_qris.toLocaleString('id-ID')}`}
            textClass="text-emerald-400"
          />
          <StatBadge 
            icon={<BookOpen className="text-slate-200" size={16} />} 
            label="Hifdz (Akhlak)" 
            value={`${state.hifdz}/100`} 
            progress={state.hifdz}
            colorClass="bg-slate-200"
            textClass="text-slate-200"
          />
          <StatBadge 
            icon={<Brain className="text-blue-400" size={16} />} 
            label="Faham (Sos)" 
            value={`${state.faham}/100`} 
            progress={state.faham}
            colorClass="bg-blue-500"
            textClass="text-blue-400"
          />
          <StatBadge 
            icon={<Users className="text-cyan-400" size={16} />} 
            label="Ukhuwah" 
            value={`${state.ukhuwah}/100`} 
            progress={state.ukhuwah}
            colorClass="bg-cyan-500"
            textClass="text-cyan-400"
          />
          <StatBadge 
            icon={<AlertTriangle className={state.ketegangan_sosial > 80 ? 'text-red-500 animate-pulse' : 'text-red-400'} size={16} />} 
            label="Ketegangan" 
            value={`${state.ketegangan_sosial}%`} 
            progress={state.ketegangan_sosial}
            colorClass={state.ketegangan_sosial > 80 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-500'}
            textClass={state.ketegangan_sosial > 80 ? 'text-red-500 animate-pulse' : 'text-red-400'}
          />
        </div>
      </div>
    </header>
  );
}

function StatBadge({ icon, label, value, progress, colorClass, textClass }: { icon: React.ReactNode, label: string, value: string | number, progress?: number, colorClass?: string, textClass?: string }) {
  return (
    <div className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
        {icon}
      </div>
      <span className={`font-mono text-lg font-bold ${textClass || 'text-slate-200'}`}>{value}</span>
      {typeof progress === 'number' && (
        <div className="stat-bar mt-2">
          <div className={`stat-fill ${colorClass}`} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}></div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'harmonis': return 'text-emerald-400';
    case 'waspada': return 'text-amber-400';
    case 'krisis laten': return 'text-orange-500';
    case 'konflik manifes (game over)': return 'text-red-500 animate-pulse';
    default: return 'text-slate-300';
  }
}
