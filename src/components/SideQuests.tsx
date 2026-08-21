import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { X, Terminal, Globe, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onCompleteVPS: () => void;
  onCompleteDakwah: () => void;
}

const EXPECTED_COMMANDS = ['sudo apt update', 'npm install cbt-desa', 'npm start'];

export function SideQuests({ isOpen, onClose, gameState, onCompleteVPS, onCompleteDakwah }: Props) {
  const [activeTab, setActiveTab] = useState<'vps' | 'dakwah'>('vps');
  
  // VPS State
  const [cmdIndex, setCmdIndex] = useState(0);
  const [inputCmd, setInputCmd] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Ubuntu 22.04 LTS',
    'Connecting to server desa.go.id...',
    'Welcome! Please configure the CBT Server.'
  ]);
  const [vpsCompleted, setVpsCompleted] = useState(false);

  // Dakwah State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [showDakwahPopup, setShowDakwahPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when opened if needed, but keeping them allows persistence within session
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vpsCompleted) return;

    const cmd = inputCmd.trim();
    setTerminalLogs(prev => [...prev, `root@desa:~# ${cmd}`]);
    setInputCmd('');

    if (cmd === EXPECTED_COMMANDS[cmdIndex]) {
      setTerminalLogs(prev => [...prev, `Executing: ${cmd}...`, 'Done.']);
      const nextIndex = cmdIndex + 1;
      setCmdIndex(nextIndex);
      
      if (nextIndex >= EXPECTED_COMMANDS.length) {
        setTerminalLogs(prev => [...prev, '', 'SUCCESS: Server CBT Online!', 'Infrastruktur digital desa berhasil dibangun!']);
        setVpsCompleted(true);
        onCompleteVPS();
      }
    } else {
      setTerminalLogs(prev => [...prev, `Command not found or incorrect sequence.`]);
    }
  };

  const handlePublish = () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setPublishProgress(0);
    setShowDakwahPopup(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setPublishProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPublishing(false);
        setShowDakwahPopup(true);
        onCompleteDakwah();
      }
    }, 150); // 3 seconds total
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">MISI SAMPINGAN</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Tugas Ekstra Sosiolog</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => setActiveTab('vps')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'vps' ? 'text-green-400 border-b-2 border-green-500 bg-green-950/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Terminal size={14} /> Simulasi VPS & CBT
          </button>
          <button 
            onClick={() => setActiveTab('dakwah')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'dakwah' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Globe size={14} /> Portal Dakwah Digital
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900">
          
          {/* VPS & CBT TAB */}
          {activeTab === 'vps' && (
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-white mb-1">Misi: Konfigurasi Server CBT</h3>
                <p className="text-xs text-slate-400">Desa membutuhkan sistem Computer Based Test (CBT) untuk ujian sekolah lokal. Masuk ke VPS dan ketikkan perintah instalasi.</p>
                <div className="mt-3 text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900">
                  <strong>Reward:</strong> +50 Faham, -20 Energi
                </div>
              </div>

              <div className="bg-black text-green-500 font-mono p-4 rounded-lg border border-green-900 h-64 overflow-y-auto shadow-inner text-sm">
                {terminalLogs.map((log, i) => <div key={i}>{log}</div>)}
                {!vpsCompleted && (
                  <form onSubmit={handleCmdSubmit} className="flex mt-2 items-center">
                    <span className="mr-2 select-none">root@desa:~#</span>
                    <input 
                      type="text" 
                      value={inputCmd} 
                      onChange={e => setInputCmd(e.target.value)} 
                      className="bg-transparent outline-none flex-1 text-green-500 border-none focus:ring-0 p-0" 
                      autoFocus 
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </form>
                )}
                {vpsCompleted && (
                  <div className="text-yellow-400 mt-4 font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} /> Server CBT Siap Digunakan!
                  </div>
                )}
              </div>

              {!vpsCompleted && (
                <div className="text-xs text-slate-400 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="block mb-1 font-semibold">Petunjuk: Ketik perintah berikut secara berurutan:</span>
                  <code className="text-green-400 bg-black px-2 py-1 rounded block mt-2 border border-slate-700">
                    {EXPECTED_COMMANDS[cmdIndex]}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* DAKWAH DIGITAL TAB */}
          {activeTab === 'dakwah' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-bold text-white mb-1">Misi: Literasi Sosiologi Membumi</h3>
                <p className="text-xs text-slate-400">Publikasikan karya tulis ilmiah untuk memberikan pemahaman sosial yang damai kepada masyarakat luas via platform digital.</p>
                <div className="mt-3 text-xs text-blue-400 bg-blue-950/30 p-2 rounded border border-blue-900">
                  <strong>Reward:</strong> +Rp 50.000, +10 Ukhuwah
                </div>
              </div>

              {/* AdSense Style UI */}
              <div className="bg-slate-100 text-slate-800 p-5 rounded-xl shadow-lg border border-slate-300 relative overflow-hidden">
                <div className="flex justify-between items-center mb-5 border-b border-slate-300 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <TrendingUp size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">AdSense Dashboard</h3>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">sosiologimembumi.id</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-green-300">Active</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                      <DollarSign size={12} /> Saldo Q-Pay
                    </div>
                    <div className="text-lg font-bold text-slate-800">Rp {gameState.uang_qris.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Trafik Bulanan</div>
                    <div className="text-lg font-bold text-slate-800">{(gameState.uang_qris / 1000).toFixed(1)}K View</div>
                  </div>
                </div>

                <button 
                  onClick={handlePublish} 
                  disabled={isPublishing} 
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-widest text-xs"
                >
                  <Globe size={16} /> Publikasikan Karya Tulis Ilmiah
                </button>

                {isPublishing && (
                  <div className="mt-5 animate-in fade-in">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                      <span>Mengunggah ke server...</span>
                      <span>{publishProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-150 ease-linear relative" style={{width: `${publishProgress}%`}}>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Popup Notification */}
              {showDakwahPopup && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl text-sm border border-green-300 shadow-md animate-in slide-in-from-bottom-4 flex gap-3 items-start">
                  <CheckCircle2 className="shrink-0 text-green-600 mt-0.5" size={18} />
                  <div>
                    <strong className="block mb-1">Sukses Publikasi!</strong>
                    Karya Tulis Ilmiah berhasil diunggah ke sosiologimembumi. Trafik dan Adsense naik! (Reward: Rp 50.000, +10 Ukhuwah)
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
