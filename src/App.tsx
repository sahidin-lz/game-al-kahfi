import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { StoryLogView } from './components/StoryLogView';
import { ActionInput } from './components/ActionInput';
import { DilemmaArchive } from './components/DilemmaArchive';
import { Dashboard } from './components/Dashboard';
import { QuestBoard } from './components/QuestBoard';
import { DashboardGuru } from './components/DashboardGuru';
import { GameState, StoryLog, EvaluationResult } from './types';
import { audioEngine } from './lib/audio';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { scenarioBank } from './data/scenarioData';

import { ChatWidget } from './components/ChatWidget';

import { MiniGameTahfidz } from './components/MiniGameTahfidz';

import { LandingPage } from './components/LandingPage';

const INITIAL_STATE: GameState = {
  energi: 100,
  maxEnergi: 100,
  uang_qris: 150000,
  hifdz: 50,
  faham: 50,
  ukhuwah: 50,
  ketegangan_sosial: 40,
  locationContext: `[${scenarioBank[0].lokasi}] ${scenarioBank[0].deskripsi}`,
  status_kota: "Waspada",
  equipment: {
    alasKaki: null,
    pakaian: null
  },
  currentScenarioIndex: 0,
  quests: scenarioBank
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [logs, setLogs] = useState<StoryLog[]>([
    {
      id: '1',
      type: 'narrative',
      content: INITIAL_STATE.locationContext,
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSideQuestsOpen, setIsSideQuestsOpen] = useState(false);
  const [isDashboardGuruOpen, setIsDashboardGuruOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const [isTahfidzOpen, setIsTahfidzOpen] = useState(false);

  const handleEquip = (type: 'alasKaki' | 'pakaian', itemId: string) => {
    import('./data/items').then(({ INVENTORY_ITEMS }) => {
      const item = INVENTORY_ITEMS.find(i => i.id === itemId);
      if (item) {
        setGameState(prev => {
          const newState = { ...prev, equipment: { ...prev.equipment, [type]: itemId } };
          // Apply effects
          if (item.effect.maxEnergi) {
            newState.maxEnergi = (newState.maxEnergi || 100) + item.effect.maxEnergi;
            newState.energi = Math.min(newState.energi + item.effect.maxEnergi, newState.maxEnergi);
          }
          if (item.effect.ukhuwah) newState.ukhuwah = Math.min(100, newState.ukhuwah + item.effect.ukhuwah);
          if (item.effect.faham) newState.faham = Math.min(100, newState.faham + item.effect.faham);
          
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };

  const handleBuy = (itemId: string) => {
    import('./data/items').then(({ SHOP_ITEMS }) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item && gameState.uang_qris >= item.price) {
        setGameState(prev => {
          const newState = {
            ...prev,
            uang_qris: Math.max(0, prev.uang_qris - item.price),
            energi: Math.min(prev.maxEnergi || 100, prev.energi + (item.effect.energi || 0)),
            ukhuwah: Math.min(100, prev.ukhuwah + (item.effect.ukhuwah || 0))
          };
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };

  const handleCompleteVPS = () => {
    setGameState(prev => {
      const newState = {
        ...prev,
        faham: Math.min(100, prev.faham + 50),
        energi: Math.max(0, prev.energi - 20)
      };
      
      const newLog = {
        id: Date.now().toString(),
        type: 'narrative' as const,
        content: "Infrastruktur digital desa berhasil dibangun! Server CBT kini aktif."
      };
      const newLogs = [...logs, newLog];
      setLogs(newLogs);
      
      saveToFirebase(newState, newLogs);
      return newState;
    });
  };

  const handleCompleteDakwah = () => {
    setGameState(prev => {
      const newState = {
        ...prev,
        uang_qris: prev.uang_qris + 50000,
        ukhuwah: Math.min(100, prev.ukhuwah + 10)
      };
      saveToFirebase(newState, logs);
      return newState;
    });
  };

  const handleCompleteTahfidz = (bonusHifdz: number, costEnergi: number) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        hifdz: Math.min(100, prev.hifdz + bonusHifdz),
        energi: Math.max(0, prev.energi - costEnergi)
      };
      
      const newLog: StoryLog = {
        id: Date.now().toString(),
        type: 'narrative',
        content: `Berhasil menyelesaikan Murojaah (Susun Ayat). Mendapat bonus Hifdz +${bonusHifdz}.`
      };
      const newLogs = [...logs, newLog];
      setLogs(newLogs);
      
      saveToFirebase(newState, newLogs);
      return newState;
    });
  };

  const [saranIlahi, setSaranIlahi] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Logika RBAC (Role-Based Access Control)
        let role = 'STUDENT';
        if (currentUser.providerData.some(p => p.providerId === 'google.com')) {
          role = 'ADMIN';
        } else if (currentUser.email === 'sahidin30@gmail.com') {
          role = 'ADMIN';
        }
        
        const profile = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          role: role,
          lastActiveAt: serverTimestamp()
        };
        setUserProfile(profile);

        // Jika ADMIN, paksa buka Dashboard Guru dan tutup layar lain
        if (role === 'ADMIN') {
          setIsDashboardGuruOpen(true);
        }

        // Load save data
        try {
          const docRef = doc(db, 'saves', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.gameState) setGameState(data.gameState as GameState);
            if (data.logs) setLogs(data.logs as StoryLog[]);
          } else {
            // Create initial save
            await setDoc(docRef, {
              uid: currentUser.uid,
              createdAt: serverTimestamp(),
              gameState: INITIAL_STATE,
              logs: logs
            });
          }
          
          // Sinkronisasi data pengguna ke tabel "users"
          await setDoc(doc(db, 'users', currentUser.uid), profile, { merge: true });
        } catch (error) {
          console.error("Error loading save:", error);
        }
      } else {
        // Reset state on logout
        setUserProfile(null);
        setGameState(INITIAL_STATE);
        setLogs([{ id: '1', type: 'narrative', content: INITIAL_STATE.locationContext }]);
        setIsDashboardGuruOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'saran-ilahi') {
          // target is 'all' or specific student's name/email. Since we don't have perfect name matching, we check substring or 'all'
          const userName = user.displayName || user.email?.split('@')[0] || '';
          if (data.target === 'all' || userName.toLowerCase().includes(data.target.toLowerCase()) || data.target.toLowerCase().includes(userName.toLowerCase())) {
            setSaranIlahi(data.text);
          }
        }
      } catch(e) {}
    };
    
    return () => ws.close();
  }, [user]);

  const saveToFirebase = async (newState: GameState, newLogs: StoryLog[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'saves', user.uid), {
        uid: user.uid,
        gameState: newState,
        logs: newLogs
      }, { merge: true });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const handleActionSubmit = async (actionText: string, inputType: 'teks_esai' | 'suara_orasi') => {
    // Initialize audio on user interaction
    audioEngine.init();

    // Add user action to log
    const actionLog: StoryLog = {
      id: Date.now().toString() + '-action',
      type: 'player_action',
      content: actionText,
      inputType,
    };
    
    const newLogsWithAction = [...logs, actionLog];
    setLogs(newLogsWithAction);
    setLoading(true);

    try {
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: gameState,
          action: actionText,
          inputType,
        })
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respon dari Dosen Kehidupan');
      }

      const result: EvaluationResult = await response.json();

      // Broadcast game action to WebSocket for Guru Dashboard
      if (user) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'game-action',
            id: Date.now().toString(),
            waktu: new Date().toLocaleTimeString(),
            nama: user.email?.split('@')[0] || 'Siswa',
            aksi: `Mengirim aksi: "${actionText}"`,
            skor_ai: result.perubahan_status.ketegangan_sosial_kota < 0 ? '+90' : '-30',
            time: Date.now(),
            text: `Siswa "${user.email?.split('@')[0]}" mengirim keputusan: ${actionText}`
          }));
          setTimeout(() => ws.close(), 1000);
        };
      }

      // Play audio feedback based on outcome
      if (result.perubahan_status.ketegangan_sosial_kota > 0 || result.perubahan_status.ukhuwah < 0) {
        audioEngine.playNegative();
        if (result.perubahan_status.ketegangan_sosial_kota > 0) {
          setAnimationClass('animate-shake animate-flash-red');
          setTimeout(() => setAnimationClass(''), 600);
        }
      } else {
        audioEngine.playPositive();
        if (result.perubahan_status.ketegangan_sosial_kota < 0) {
          setAnimationClass('animate-flash-green');
          setTimeout(() => setAnimationClass(''), 600);
        }
      }

      // Update state
      let updatedQuests = [...gameState.quests];
      let rewardQris = 0;
      
      if (result.status_kota === 'Aman' || result.status_kota === 'Harmonis') {
        const currentQuest = updatedQuests[gameState.currentScenarioIndex];
        if (currentQuest) {
          updatedQuests[gameState.currentScenarioIndex] = { ...currentQuest, status: 'completed' };
          rewardQris = currentQuest.reward_qris || 0;
          
          if (currentQuest.kategori === 'Main Quest') {
            // Unlock next Main Quest
            const nextMainQuestIndex = updatedQuests.findIndex((q, i) => i > gameState.currentScenarioIndex && q.kategori === 'Main Quest');
            if (nextMainQuestIndex !== -1) {
              updatedQuests[nextMainQuestIndex] = { ...updatedQuests[nextMainQuestIndex], status: 'available' };
            }
          }
        }
      }

      const newState = {
        ...gameState,
        energi: Math.max(0, Math.min(100, gameState.energi + result.perubahan_status.energi)),
        uang_qris: Math.max(0, gameState.uang_qris + result.perubahan_status.uang_qris + rewardQris),
        hifdz: Math.max(0, Math.min(100, gameState.hifdz + result.perubahan_status.hifdz)),
        faham: Math.max(0, Math.min(100, gameState.faham + result.perubahan_status.faham)),
        ukhuwah: Math.max(0, Math.min(100, gameState.ukhuwah + result.perubahan_status.ukhuwah)),
        ketegangan_sosial: Math.max(0, Math.min(100, gameState.ketegangan_sosial + result.perubahan_status.ketegangan_sosial_kota)),
        locationContext: result.narasi_rpg.cerita_konsekuensi,
        status_kota: result.status_kota,
        quests: updatedQuests
      };
      
      setGameState(newState);

      // Add evaluation and narrative to log
      const evalLog: StoryLog = {
        id: Date.now().toString() + '-eval',
        type: 'evaluation',
        content: '',
        evaluation: result
      };

      const narrativeLog: StoryLog = {
        id: Date.now().toString() + '-narrative',
        type: 'narrative',
        content: result.narasi_rpg.cerita_konsekuensi,
      };

      const finalLogs = [...newLogsWithAction, evalLog, narrativeLog];
      setLogs(finalLogs);
      
      // Save to Firebase asynchronously
      saveToFirebase(newState, finalLogs);

    } catch (error) {
      console.error(error);
      const errorLog: StoryLog = {
        id: Date.now().toString() + '-error',
        type: 'narrative',
        content: "Terjadi kesalahan jaringan atau API. Silakan coba lagi.",
      };
      setLogs(prev => [...prev, errorLog]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextScenario = () => {
    // Find next available Main Quest
    const nextIndex = gameState.quests.findIndex((q, i) => i > gameState.currentScenarioIndex && q.kategori === 'Main Quest');
    
    if (nextIndex === -1 || nextIndex >= gameState.quests.length) {
      // Completed all main scenarios
      setGameState(prev => {
        const newState = { ...prev, status_kota: "Tamat" };
        const endLog: StoryLog = {
          id: Date.now().toString() + '-end',
          type: 'narrative',
          content: "Selamat! Kamu telah menyelesaikan semua perjalanan sosiologi utama. Masyarakat telah mencapai harmoni.",
        };
        const newLogs = [...logs, endLog];
        setLogs(newLogs);
        saveToFirebase(newState, newLogs);
        return newState;
      });
      return;
    }
    
    const nextScenario = gameState.quests[nextIndex];
    const newLocationContext = `[${nextScenario.lokasi}] ${nextScenario.deskripsi}`;
    
    // Fade in effect
    setAnimationClass('animate-in fade-in duration-1000');
    setTimeout(() => setAnimationClass(''), 1000);

    setGameState(prev => {
      const newState = {
        ...prev,
        currentScenarioIndex: nextIndex,
        locationContext: newLocationContext,
        status_kota: "Waspada" // Reset for next challenge
      };
      
      const newLog: StoryLog = {
        id: Date.now().toString() + '-narrative',
        type: 'narrative',
        content: `**LEVEL ${nextIndex + 1}: ${nextScenario.judul_konflik}**\n\n${newLocationContext}`,
      };
      
      const newLogs = [...logs, newLog];
      setLogs(newLogs);
      saveToFirebase(newState, newLogs);
      
      return newState;
    });
  };

  const handleBuyFood = () => {
    if (gameState.uang_qris >= 15000 && gameState.energi < 100) {
      audioEngine.playPositive();
      setGameState(prev => {
        const newState = {
          ...prev,
          uang_qris: prev.uang_qris - 15000,
          energi: Math.min(100, prev.energi + 20)
        };
        const actionLog: StoryLog = {
          id: Date.now().toString() + '-buyfood',
          type: 'narrative',
          content: 'Kamu membeli makanan untuk memulihkan energi (-Rp 15.000, +20 Energi).'
        };
        const newLogs = [...logs, actionLog];
        setLogs(newLogs);
        saveToFirebase(newState, newLogs);
        return newState;
      });
    }
  };

  const handleWriteArticle = () => {
    if (gameState.energi >= 10) {
      audioEngine.playPositive();
      const earned = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
      setGameState(prev => {
        const newState = {
          ...prev,
          energi: prev.energi - 10,
          uang_qris: prev.uang_qris + earned
        };
        const actionLog: StoryLog = {
          id: Date.now().toString() + '-writearticle',
          type: 'narrative',
          content: `Kamu meluangkan waktu menulis artikel opini di web sosiologimembumi.my.id. Artikelmu dibaca banyak orang! (-10 Energi, +Rp ${earned.toLocaleString('id-ID')}).`
        };
        const newLogs = [...logs, actionLog];
        setLogs(newLogs);
        saveToFirebase(newState, newLogs);
        return newState;
      });
    }
  };

  const handleStartQuest = (questId: number) => {
    const questIndex = gameState.quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    const quest = gameState.quests[questIndex];
    
    if (gameState.energi < (quest.cost_energi || 0)) {
      alert("Energi tidak cukup!");
      return;
    }

    setAnimationClass('animate-in fade-in duration-1000');
    setTimeout(() => setAnimationClass(''), 1000);

    setGameState(prev => {
      const newState = {
        ...prev,
        energi: prev.energi - (quest.cost_energi || 0),
        currentScenarioIndex: questIndex,
        status_kota: "Waspada",
        locationContext: `[${quest.lokasi}] ${quest.deskripsi}`
      };
      
      const newLog: StoryLog = {
        id: Date.now().toString() + '-narrative',
        type: 'narrative',
        content: `**MEMULAI MISI: ${quest.judul_konflik}**\n\n${newState.locationContext}`,
      };
      
      const newLogs = [...logs, newLog];
      setLogs(newLogs);
      saveToFirebase(newState, newLogs);
      
      return newState;
    });
    setIsSideQuestsOpen(false); // Close QuestBoard
  };

  const handleGenerateAIQuest = async () => {
    try {
      const response = await fetch('/api/gemini/generate-quest', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Gagal memuat misi baru');
      
      const newQuest = await response.json();
      
      setGameState(prev => {
        const newState = {
          ...prev,
          quests: [...prev.quests, newQuest]
        };
        saveToFirebase(newState, logs);
        return newState;
      });
    } catch (err) {
      console.error(err);
      alert('Gagal membuat misi baru. Coba lagi.');
    }
  };

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className={`flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans relative ${animationClass}`}>
      <StatusBar 
        state={gameState} 
        onToggleArchive={() => setIsArchiveOpen(!isArchiveOpen)} 
        onToggleDashboard={() => setIsDashboardOpen(!isDashboardOpen)}
        onToggleSideQuests={() => setIsSideQuestsOpen(!isSideQuestsOpen)}
        onToggleAdmin={() => setIsDashboardGuruOpen(!isDashboardGuruOpen)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleTahfidz={() => setIsTahfidzOpen(true)}
        user={user}
        userProfile={userProfile}
      />
      <StoryLogView logs={logs} loading={loading} />
      {gameState.status_kota === 'Aman' || gameState.status_kota === 'Harmonis' ? (
        <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom-8 flex flex-col items-center gap-4">
          <p className="text-amber-400 font-bold uppercase tracking-widest text-center text-sm md:text-base">
            Perjalanan dilanjutkan. Sambil transit, kelola logistikmu.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
            <button
              onClick={() => handleBuyFood()}
              disabled={gameState.uang_qris < 15000 || gameState.energi >= 100}
              className="flex-1 p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <div className="text-emerald-400 font-bold">Beli Makanan (Rp 15.000)</div>
              <div className="text-xs text-slate-400">+20 Energi</div>
            </button>
            <button
              onClick={() => handleWriteArticle()}
              disabled={gameState.energi < 10}
              className="flex-1 p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <div className="text-cyan-400 font-bold">Tulis Artikel</div>
              <div className="text-xs text-slate-400">-10 Energi, +Rp Acak</div>
            </button>
            <button
              onClick={() => setIsTahfidzOpen(true)}
              disabled={gameState.energi < 5}
              className="flex-1 p-4 bg-amber-900/50 hover:bg-amber-800/50 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-700/50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]"
            >
              <div className="text-amber-400 font-bold">Murojaah (Ayat)</div>
              <div className="text-xs text-amber-200/50">-5 Energi, +15 Hifdz</div>
            </button>
          </div>

          <button
            onClick={handleNextScenario}
            disabled={gameState.energi <= 20}
            className="w-full max-w-2xl py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all uppercase tracking-widest flex items-center justify-center gap-3 text-sm"
          >
            Lanjutkan Perjalanan (Rihlah)
          </button>
          {gameState.energi <= 20 && (
            <p className="text-red-400 text-xs text-center font-mono">Energi tidak cukup untuk melanjutkan perjalanan (Minimal &gt; 20).</p>
          )}
        </div>
      ) : gameState.status_kota === 'Tamat' ? (
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-center text-amber-400 font-bold uppercase tracking-widest text-center">
          Tamat - Semua Misi Selesai
        </div>
      ) : (
        <ActionInput onActionSubmit={handleActionSubmit} disabled={loading} locationContext={gameState.locationContext} />
      )}
      
      <DilemmaArchive 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
        logs={logs} 
      />

      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        gameState={gameState}
        onEquip={handleEquip}
        onBuy={handleBuy}
      />

      <QuestBoard
        isOpen={isSideQuestsOpen}
        onClose={() => setIsSideQuestsOpen(false)}
        gameState={gameState}
        onStartQuest={handleStartQuest}
        onGenerateAIQuest={handleGenerateAIQuest}
      />

      <DashboardGuru 
        isOpen={isDashboardGuruOpen} 
        onClose={() => setIsDashboardGuruOpen(false)} 
      />

      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      <MiniGameTahfidz 
        isOpen={isTahfidzOpen}
        onClose={() => setIsTahfidzOpen(false)}
        gameState={gameState}
        onComplete={handleCompleteTahfidz}
      />

      {saranIlahi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-amber-950 border-2 border-amber-500 rounded-2xl max-w-lg w-full p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-amber-400 mb-2 uppercase tracking-widest">Saran dari Dosen Kehidupan</h2>
            <div className="w-12 h-1 bg-amber-500/50 rounded mb-6"></div>
            <p className="text-lg text-amber-100 mb-8 leading-relaxed font-medium">"{saranIlahi}"</p>
            <button 
              onClick={() => setSaranIlahi(null)}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold rounded-xl uppercase tracking-widest transition-colors w-full md:w-auto"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
