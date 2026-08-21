import React, { useEffect, useRef } from 'react';
import { StoryLog } from '../types';
import { GraduationCap, User, Compass, AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  logs: StoryLog[];
  loading: boolean;
}

export function StoryLogView({ logs, loading }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 grid-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {log.type === 'narrative' && (
              <div className="glass-panel p-6 rounded-lg relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
                <h2 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                  <Compass size={14} /> Laporan Kejadian (Narasi RPG)
                </h2>
                <div className="font-serif text-lg leading-relaxed italic text-slate-100">
                  {log.content}
                </div>
              </div>
            )}
            
            {log.type === 'player_action' && (
              <div className="glass-panel p-4 rounded-lg relative mb-6 ml-auto w-11/12 md:w-5/6">
                <div className="absolute top-0 right-0 w-1 bg-blue-500 h-full"></div>
                <h2 className="text-[10px] uppercase font-bold tracking-widest text-blue-500 mb-2 flex items-center justify-end gap-2">
                  {log.inputType === 'suara_orasi' ? '🎤 Orasi Suara' : '📝 Teks Esai'} <User size={14} />
                </h2>
                <div className="text-sm text-slate-300 italic text-right">
                  "{log.content}"
                </div>
              </div>
            )}
            
            {log.type === 'evaluation' && log.evaluation && (
              <div className="glass-panel p-6 rounded-lg relative overflow-hidden mb-6 border border-emerald-900/50">
                <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full"></div>
                {log.evaluation.indikasi_curang && (
                  <div className="mb-4 bg-red-950/50 border border-red-500/50 p-4 rounded flex items-start gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1">Sistem Anti-Curang Aktif</h3>
                      <p className="text-red-200/80 text-sm">Gaya bahasamu terdeteksi kaku seperti robot atau hasil copy-paste (Plagiasi). Semua skor hangus (0), ukhuwah turun drastis, dan ketegangan meroket!</p>
                    </div>
                  </div>
                )}
                
                {/* Bagian Atas: Narasi RPG Konsekuensi */}
                {log.evaluation.narasi_rpg?.cerita_konsekuensi && (
                  <div className="mb-6 bg-slate-900/50 p-4 rounded-lg border-l-4 border-amber-500">
                    <h2 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                      <Compass size={14} /> Konsekuensi Dunia (RPG)
                    </h2>
                    <p className="font-serif text-lg leading-relaxed italic text-slate-100">
                      "{log.evaluation.narasi_rpg.cerita_konsekuensi}"
                    </p>
                  </div>
                )}

                <h2 className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                  <GraduationCap size={14} /> Umpan Balik Guru (Evaluasi)
                </h2>
                
                {/* Bagian Tengah: Saran & Koreksi */}
                <div className="space-y-4 mb-6">
                  {log.evaluation.evaluasi?.saran_guru && (
                    <div className="bg-slate-900/40 p-4 rounded flex gap-3">
                      <span className="text-xl">💡</span>
                      <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-emerald-400">Saran Guru:</strong> {log.evaluation.evaluasi.saran_guru}</p>
                    </div>
                  )}
                  {log.evaluation.evaluasi?.analisis_sosiologi && (
                    <div className="bg-slate-900/40 p-4 rounded flex gap-3 border-l-2 border-blue-500">
                      <span className="text-xl">🤝</span>
                      <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-blue-400">Analisis Sosiologi:</strong> {log.evaluation.evaluasi.analisis_sosiologi}</p>
                    </div>
                  )}
                  {log.evaluation.evaluasi?.analisis_tadabur && (
                    <div className="bg-slate-900/40 p-4 rounded flex gap-3 border-l-2 border-amber-500">
                      <span className="text-xl">🕌</span>
                      <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-amber-400">Makna Tadabur:</strong> {log.evaluation.evaluasi.analisis_tadabur}</p>
                    </div>
                  )}
                  {log.evaluation.evaluasi?.koreksi_tahfidz && (
                    <div className="bg-slate-900/40 p-4 rounded flex gap-3">
                      <span className="text-xl">📖</span>
                      <p className="text-sm text-slate-300 leading-relaxed"><strong className="text-emerald-400">Koreksi Tahfidz:</strong> {log.evaluation.evaluasi.koreksi_tahfidz}</p>
                    </div>
                  )}
                </div>

                {/* Bagian Kartu Al-Qur'an */}
                {log.evaluation.evaluasi?.referensi_quran && (
                  <div className="mb-6 p-6 rounded-xl border-2 border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <h3 className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-4 text-center">
                      Referensi Dalil: {log.evaluation.evaluasi.referensi_quran.surat_ayat}
                    </h3>
                    <p className="text-2xl md:text-3xl font-serif text-right leading-loose text-emerald-100 mb-6 drop-shadow-md" dir="rtl">
                      {log.evaluation.evaluasi.referensi_quran.teks_arab}
                    </p>
                    <div className="w-16 h-px bg-emerald-500/30 mx-auto mb-4"></div>
                    <p className="text-sm text-center italic text-slate-400">
                      "{log.evaluation.evaluasi.referensi_quran.terjemahan}"
                    </p>
                  </div>
                )}

                {/* Bagian Bawah: Bar Skor */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-semibold">Sosiologi</span>
                        <span className={`text-lg font-bold mono ${getScoreColor(log.evaluation.evaluasi?.skor_sosiologi || 0)}`}>
                          {log.evaluation.evaluasi?.skor_sosiologi || 0}
                        </span>
                      </div>
                      <div className="stat-bar"><div className={`stat-fill ${getScoreBarColor(log.evaluation.evaluasi?.skor_sosiologi || 0)}`} style={{width: `${log.evaluation.evaluasi?.skor_sosiologi || 0}%`}}></div></div>
                    </div>
                    {log.evaluation.evaluasi?.skor_akhlak !== undefined && (
                      <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-semibold">Akhlak</span>
                          <span className={`text-lg font-bold mono ${getScoreColor(log.evaluation.evaluasi?.skor_akhlak || 0)}`}>
                            {log.evaluation.evaluasi?.skor_akhlak || 0}
                          </span>
                        </div>
                        <div className="stat-bar"><div className={`stat-fill ${getScoreBarColor(log.evaluation.evaluasi?.skor_akhlak || 0)}`} style={{width: `${log.evaluation.evaluasi?.skor_akhlak || 0}%`}}></div></div>
                      </div>
                    )}
                    {log.evaluation.evaluasi?.skor_tahfidz !== undefined && (
                      <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-semibold">Tahfidz</span>
                          <span className={`text-lg font-bold mono ${getScoreColor(log.evaluation.evaluasi?.skor_tahfidz || 0)}`}>
                            {log.evaluation.evaluasi?.skor_tahfidz || 0}
                          </span>
                        </div>
                        <div className="stat-bar"><div className={`stat-fill ${getScoreBarColor(log.evaluation.evaluasi?.skor_tahfidz || 0)}`} style={{width: `${log.evaluation.evaluasi?.skor_tahfidz || 0}%`}}></div></div>
                      </div>
                    )}
                    {log.evaluation.evaluasi?.skor_tadabur !== undefined && (
                      <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-semibold">Tadabur</span>
                          <span className={`text-lg font-bold mono ${getScoreColor(log.evaluation.evaluasi?.skor_tadabur || 0)}`}>
                            {log.evaluation.evaluasi?.skor_tadabur || 0}
                          </span>
                        </div>
                        <div className="stat-bar"><div className={`stat-fill ${getScoreBarColor(log.evaluation.evaluasi?.skor_tadabur || 0)}`} style={{width: `${log.evaluation.evaluasi?.skor_tadabur || 0}%`}}></div></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="glass-panel p-6 rounded-lg relative overflow-hidden opacity-70">
            <div className="absolute top-0 left-0 w-1 bg-amber-400 h-full animate-pulse"></div>
            <div className="flex space-x-2 items-center text-slate-400">
              <GraduationCap size={16} className="text-amber-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Memproses Evaluasi...</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-rose-500';
}

function getScoreBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}
