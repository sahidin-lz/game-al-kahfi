import React, { useState, useEffect, useRef } from 'react';
import { Users, Brain, Heart, AlertTriangle, ScrollText, Activity, ShieldAlert, X, Eye, Ear, Megaphone, Send } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection as firestoreCollection, query as firestoreQuery, where as firestoreWhere, onSnapshot as firestoreOnSnapshot } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// TUGAS 1: DATA STRUKTUR (Mockup Data)
const globalStats = {
  ketegangan_kota: 85,
  total_siswa: 36,
  rata_sosiologi: 78,
  rata_akhlak: 82
};

const liveFeed = [
  { id: 1, waktu: "10:42", nama: "Siti", aksi: "Menggunakan Voice AI (Mediasi Desa)", skor_ai: "+85" },
  { id: 2, waktu: "10:39", nama: "Budi", aksi: "Memilih opsi Provokasi Massa", skor_ai: "-40" },
  { id: 3, waktu: "10:35", nama: "Ahmad", aksi: "Publikasi Karya Tulis Ilmiah", skor_ai: "+90" },
  { id: 4, waktu: "10:30", nama: "Rizky", aksi: "Membeli Ayam Geprek Ekstra Pedas", skor_ai: "+0" },
  { id: 5, waktu: "10:28", nama: "Fajar", aksi: "Gagal Setup VPS CBT Desa", skor_ai: "-10" },
];

export function DashboardGuru({ isOpen, onClose }: Props) {
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [gameActions, setGameActions] = useState<any[]>([]);
  const [activeCalls, setActiveCalls] = useState<Record<string, any>>({});
  const [saranText, setSaranText] = useState("");
  const [saranTarget, setSaranTarget] = useState("all");
  const [studentList, setStudentList] = useState<any[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Record<string, RTCPeerConnection>>({});
  
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser || !isOpen) return;

    // Fetch students from Firestore
    const q = firestoreQuery(firestoreCollection(db, "users"), firestoreWhere("role", "==", "STUDENT"));
    const unsubscribe = firestoreOnSnapshot(q, (snapshot) => {
      const students: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        students.push({
          id: doc.id,
          nama: data.displayName || data.email?.split('@')[0] || "Anonim",
          sosiologi: Math.floor(Math.random() * 50) + 50, // mock stats for now
          akhlak: Math.floor(Math.random() * 50) + 50, // mock stats for now
          ukhuwah: Math.floor(Math.random() * 50) + 50, // mock stats for now
          status: "Aman",
          gaya_main: "Kolaborator"
        });
      });
      setStudentList(students);
    });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat') {
          setChatLogs(prev => [...prev, data.message].slice(-50));
        } else if (data.type === 'game-action') {
          setGameActions(prev => [data, ...prev].slice(0, 50));
        } else if (data.type === 'call-started') {
          setActiveCalls(prev => ({
            ...prev,
            [data.callerId]: data
          }));
        } else if (data.type === 'call-ended') {
          setActiveCalls(prev => {
            const copy = { ...prev };
            delete copy[data.callerId];
            return copy;
          });
        } else if (data.type === 'teacher-answer' && data.target === currentUser.uid) {
          const pc = pcsRef.current[data.senderId];
          if (pc) pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === 'ice-candidate-teacher' && data.target === currentUser.uid) {
          const pc = pcsRef.current[data.senderId];
          if (pc) pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {}
    };

    return () => {
      unsubscribe();
      ws.close();
    };
  }, [currentUser, isOpen]);

  const sendSaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saranText.trim() || !wsRef.current) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'saran-ilahi',
      text: saranText,
      target: saranTarget
    }));
    
    setSaranText("");
    alert("Saran Ilahi terkirim!");
  };

  const handleWiretap = async (call: any, intervene: boolean) => {
    if (!currentUser) return;
    try {
      await connectToStudent(call.callerId, intervene);
      await connectToStudent(call.receiverId, intervene);
      alert(intervene ? "Intervensi aktif! Suara Anda kini terdengar oleh siswa." : "Pemantauan diam-diam aktif! Anda mendengarkan percakapan mereka.");
    } catch (e) {
      console.error(e);
      alert("Gagal melakukan intervensi WebRTC");
    }
  };

  const connectToStudent = async (studentId: string, intervene: boolean) => {
    if (!currentUser || !wsRef.current) return;
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pcsRef.current[studentId] = pc;
    
    if (intervene) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
    }

    pc.ontrack = (e) => {
      const audio = new Audio();
      audio.autoplay = true;
      audio.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'ice-candidate', target: studentId, candidate: e.candidate, isTeacher: true }));
      }
    };

    const offer = await pc.createOffer({ offerToReceiveAudio: true });
    await pc.setLocalDescription(offer);
    
    wsRef.current.send(JSON.stringify({ 
      type: 'teacher-offer', 
      target: studentId, 
      teacherId: currentUser.uid, 
      offer 
    }));
  };

  if (!isOpen) return null;

  const isKotaBahaya = globalStats.ketegangan_kota >= 80;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-300 overflow-y-auto animate-in fade-in duration-300 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Header & Global Alert */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-cyan-500" />
              AL-KAHFI <span className="text-slate-500 font-light">| Pusat Kendali Guru</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-cyan-500/70 mt-1 font-bold">Cyber-Islamic Dashboard Mode</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors text-purple-100 font-bold uppercase tracking-widest text-xs">
              <Activity size={16} />
              Intervensi Suara
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* BAHAYA ALERT */}
        {isKotaBahaya && (
          <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-xl flex items-center gap-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="text-red-500 shrink-0" size={32} />
            <div>
              <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm">Peringatan Kritis</h3>
              <p className="text-red-200/80 text-sm">BAHAYA: KOTA HAMPIR RUSUH! (Ketegangan: {globalStats.ketegangan_kota}%). Intervensi Kelas Diperlukan segera!</p>
            </div>
          </div>
        )}

        {/* BAGIAN A: 4 Card Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={64} className="text-cyan-500" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 flex items-center gap-2">
              <Users size={12} className="text-cyan-400" /> Total Siswa Aktif
            </p>
            <p className="text-3xl font-bold text-white">{globalStats.total_siswa}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ScrollText size={64} className="text-blue-500" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 flex items-center gap-2">
              <ScrollText size={12} className="text-blue-400" /> Rata-Rata Sosiologi
            </p>
            <p className="text-3xl font-bold text-white">{globalStats.rata_sosiologi}<span className="text-sm text-slate-500 font-normal">/100</span></p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain size={64} className="text-emerald-500" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 flex items-center gap-2">
              <Brain size={12} className="text-emerald-400" /> Rata-Rata Akhlak
            </p>
            <p className="text-3xl font-bold text-white">{globalStats.rata_akhlak}<span className="text-sm text-slate-500 font-normal">/100</span></p>
          </div>

          <div className={`border p-5 rounded-xl shadow-lg relative overflow-hidden transition-colors ${isKotaBahaya ? 'bg-red-950/20 border-red-900' : 'bg-slate-900/50 border-slate-800'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={64} className={isKotaBahaya ? 'text-red-500' : 'text-amber-500'} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 flex items-center gap-2">
              <Activity size={12} className={isKotaBahaya ? 'text-red-400' : 'text-amber-400'} /> Indikator Ketegangan
            </p>
            <p className={`text-3xl font-bold ${isKotaBahaya ? 'text-red-400' : 'text-amber-400'}`}>{globalStats.ketegangan_kota}%</p>
          </div>
        </div>

        {/* TAB & GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Tabel Analitik & Saran Ilahi */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Form Saran Ilahi */}
            <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl shadow-lg p-5">
              <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase flex items-center gap-2 mb-4">
                <Megaphone size={16} /> Saran Ilahi (Direct Advice)
              </h2>
              <form onSubmit={sendSaran} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select 
                    value={saranTarget} 
                    onChange={e => setSaranTarget(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Semua Siswa</option>
                    {studentList.map(s => (
                      <option key={s.id} value={s.nama}>{s.nama}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={saranText}
                    onChange={e => setSaranText(e.target.value)}
                    placeholder="Tulis pesan atau peringatan ilahi..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 placeholder-slate-500"
                  />
                  <button 
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
                  >
                    <Send size={14} /> Kirim
                  </button>
                </div>
              </form>
            </div>

            {/* Panel Panggilan Suara */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Ear size={16} className="text-purple-400" /> Active Voice Calls
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {Object.values(activeCalls).length === 0 ? (
                  <p className="text-slate-500 text-sm text-center italic">Tidak ada panggilan suara aktif.</p>
                ) : (
                  Object.values(activeCalls).map((call: any, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-white font-semibold">
                          {call.callerEmail.split('@')[0]} <span className="text-slate-500 mx-2">📞</span> {call.receiverEmail.split('@')[0]}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleWiretap(call, false)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-cyan-400 transition-colors tooltip"
                          title="Dengar Diam-diam"
                        >
                          <Ear size={16} />
                        </button>
                        <button 
                          onClick={() => handleWiretap(call, true)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-amber-400 transition-colors tooltip"
                          title="Intervensi Suara"
                        >
                          <Megaphone size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Global Chat Monitor */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" /> Global Chat Monitor
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                {chatLogs.length === 0 ? (
                  <p className="text-slate-600 text-center italic mt-10">Belum ada obrolan.</p>
                ) : (
                  chatLogs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                      <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{" "}
                      <span className="text-blue-400 font-bold">{log.senderEmail.split('@')[0]}:</span>{" "}
                      <span className="text-slate-200">"{log.text}"</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Game Action Feed */}
          <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-[800px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <ScrollText size={16} className="text-emerald-400" /> Activity Tracker
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {gameActions.length === 0 && liveFeed.length > 0 && liveFeed.map((feed) => {
                const isNegative = feed.skor_ai.startsWith('-');
                return (
                  <div key={feed.id} className="relative pl-6 pb-4 border-l border-slate-800 last:border-0 last:pb-0">
                    <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${isNegative ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-slate-200">{feed.nama}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{feed.waktu}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{feed.aksi}</p>
                    <div className="mt-2 inline-flex">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isNegative ? 'bg-red-950/30 text-red-400 border border-red-900/50' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50'}`}>
                        Skor AI: {feed.skor_ai}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {gameActions.map((action, i) => (
                <div key={i} className="relative pl-6 pb-4 border-l border-slate-800 last:border-0 last:pb-0">
                  <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-cyan-500`}></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(action.time).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">{action.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
