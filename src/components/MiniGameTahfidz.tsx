import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, RefreshCcw, Trophy, X, Mic, Square } from 'lucide-react';
import { GameState, StoryLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onComplete: (bonusHifdz: number, costEnergi: number) => void;
}

const VERSES = [
  {
    id: 'hujurat-13',
    surah: 'Q.S. Al-Hujurat: 13',
    pieces: ['يَا أَيُّهَا النَّاسُ', 'إِنَّا خَلَقْنَاكُمْ', 'مِنْ ذَكَرٍ', 'وَأُنْثَىٰ', 'وَجَعَلْنَاكُمْ شُعُوبًا', 'وَقَبَائِلَ', 'لِتَعَارَفُوا'],
    translation: 'Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.'
  },
  {
    id: 'hujurat-10',
    surah: 'Q.S. Al-Hujurat: 10',
    pieces: ['إِنَّمَا الْمُؤْمِنُونَ', 'إِخْوَةٌ', 'فَأَصْلِحُوا', 'بَيْنَ أَخَوَيْكُمْ', 'وَاتَّقُوا اللَّهَ', 'لَعَلَّكُمْ تُرْحَمُونَ'],
    translation: 'Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu (yang berselisih) dan bertakwalah kepada Allah agar kamu mendapat rahmat.'
  },
  {
    id: 'maidah-8',
    surah: 'Q.S. Al-Ma\'idah: 8',
    pieces: ['اعْدِلُوا', 'هُوَ أَقْرَبُ', 'لِلتَّقْوَىٰ', 'وَاتَّقُوا اللَّهَ', 'إِنَّ اللَّهَ', 'خَبِيرٌ', 'بِمَا تَعْمَلُونَ'],
    translation: 'Berlaku adillah. Karena (adil) itu lebih dekat kepada takwa. Dan bertakwalah kepada Allah, sungguh, Allah Mahateliti terhadap apa yang kamu kerjakan.'
  }
];

const playSound = (type: 'success' | 'error') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export function MiniGameTahfidz({ isOpen, onClose, gameState, onComplete }: Props) {
  const [gameMode, setGameMode] = useState<'puzzle' | 'voice'>('puzzle');
  const [currentVerse, setCurrentVerse] = useState(VERSES[0]);
  const [availablePieces, setAvailablePieces] = useState<{ id: string, text: string }[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<{ id: string, text: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'checking' | 'correct' | 'wrong'>('idle');

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen]);

  const resetGame = () => {
    const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
    setCurrentVerse(randomVerse);
    
    // Create pieces with random IDs so they can have duplicates if needed (not usually but good practice)
    const pieces = randomVerse.pieces.map((text, i) => ({ id: `${i}-${Math.random()}`, text }));
    // Shuffle
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setAvailablePieces(pieces);
    setSelectedPieces([]);
    setStatus('idle');
    setVoiceFeedback(null);
  };

  const handleSelectPiece = (piece: { id: string, text: string }) => {
    if (status === 'correct') return;
    setAvailablePieces(prev => prev.filter(p => p.id !== piece.id));
    setSelectedPieces(prev => [...prev, piece]);
    setStatus('idle');
  };

  const handleRemovePiece = (piece: { id: string, text: string }) => {
    if (status === 'correct') return;
    setSelectedPieces(prev => prev.filter(p => p.id !== piece.id));
    setAvailablePieces(prev => [...prev, piece]);
    setStatus('idle');
  };

  const handleCheck = () => {
    if (selectedPieces.length !== currentVerse.pieces.length) {
      playSound('error');
      setStatus('wrong');
      return;
    }

    const currentTextArr = selectedPieces.map(p => p.text);
    const isMatch = currentTextArr.every((val, index) => val === currentVerse.pieces[index]);

    if (isMatch) {
      playSound('success');
      setStatus('correct');
      // Grant reward after a short delay
      setTimeout(() => {
        onComplete(15, 5); // +15 hifdz, -5 energi
        onClose();
      }, 2000);
    } else {
      playSound('error');
      setStatus('wrong');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsEvaluating(true);
        setStatus('checking');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(',')[1];
          if (!base64data) return;
          
          try {
            const response = await fetch('/api/tahfidz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioData: base64data,
                mimeType: 'audio/webm',
                targetVerse: currentVerse.surah
              })
            });
            const result = await response.json();
            setVoiceFeedback(result);
            if (result.isMatch || result.score >= 80) {
              playSound('success');
              setStatus('correct');
              setTimeout(() => {
                onComplete(20, 5); // +20 hifdz for voice, -5 energi
                onClose();
              }, 5000);
            } else {
              playSound('error');
              setStatus('wrong');
            }
          } catch (err) {
            console.error(err);
            playSound('error');
            setStatus('wrong');
          } finally {
            setIsEvaluating(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('idle');
      setVoiceFeedback(null);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Gagal mengakses mikrofon.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl w-full max-w-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-emerald-900 bg-emerald-950/30 flex justify-between items-center">
          <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={20} /> Murojaah Hafalan
          </h2>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setGameMode('puzzle')} 
              className={`px-3 py-1 text-xs uppercase tracking-widest font-bold rounded ${gameMode === 'puzzle' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Puzzle
            </button>
            <button 
              onClick={() => setGameMode('voice')} 
              className={`px-3 py-1 text-xs uppercase tracking-widest font-bold rounded ${gameMode === 'voice' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Suara
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors ml-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/30 mb-2">
              <Trophy size={14} /> Hadiah: +{gameMode === 'voice' ? '20' : '15'} Hifdz | Biaya: -5 Energi
            </div>
            {gameMode === 'puzzle' ? (
              <p className="text-slate-300 font-medium">Susun potongan kata berikut menjadi {currentVerse.surah} yang utuh secara berurutan.</p>
            ) : (
              <p className="text-slate-300 font-medium">Bacakan {currentVerse.surah} melalui mikrofon. AI akan mengevaluasi tajwid dan kefasihanmu.</p>
            )}
          </div>

          {gameMode === 'puzzle' ? (
            <>
              {/* Kotak Jawaban (Droppable Area conceptually) */}
              <div className="mb-8">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Ayat Pilihanmu (Baca dari Kanan ke Kiri):</div>
                <div 
                  className={`min-h-[120px] p-4 rounded-xl border-2 flex flex-row-reverse flex-wrap gap-3 items-start content-start transition-colors ${status === 'correct' ? 'border-emerald-500 bg-emerald-950/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]' : status === 'wrong' ? 'border-red-500 bg-red-950/20' : 'border-slate-700 bg-slate-900/50'}`}
                  dir="rtl"
                >
                  {selectedPieces.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 italic">
                      Klik potongan ayat di bawah untuk memindahkannya ke sini...
                    </div>
                  ) : (
                    selectedPieces.map((piece) => (
                      <button
                        key={piece.id}
                        onClick={() => handleRemovePiece(piece)}
                        className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-serif text-2xl rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105"
                      >
                        {piece.text}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Potongan Ayat Acak */}
              <div className="mb-8">
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Potongan Tersedia:</div>
                <div className="flex flex-wrap gap-3 items-center justify-center p-4 bg-slate-900 rounded-xl" dir="rtl">
                  {availablePieces.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => handleSelectPiece(piece)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-serif text-2xl rounded-lg shadow-sm cursor-pointer transition-transform hover:-translate-y-1"
                    >
                      {piece.text}
                    </button>
                  ))}
                  {availablePieces.length === 0 && (
                    <div className="text-slate-500 italic text-sm">Semua potongan telah digunakan.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-2xl font-serif text-emerald-300 mb-8 text-center" dir="rtl">
                {currentVerse.pieces.join(' ')}
              </div>
              <div className="text-slate-400 italic mb-12 text-center max-w-lg">
                "{currentVerse.translation}"
              </div>
              
              <button
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                onPointerLeave={stopRecording}
                disabled={isEvaluating || status === 'correct'}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-110' 
                    : isEvaluating 
                      ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="text-white" fill="currentColor" size={32} />
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></div>
                  </>
                ) : (
                  <Mic className="text-white" size={40} />
                )}
              </button>
              <div className="mt-4 text-xs font-bold tracking-widest uppercase text-slate-500">
                {isRecording ? 'Merekam... Lepas untuk Selesai' : isEvaluating ? 'Mengevaluasi Bacaan...' : 'Tahan untuk Merekam'}
              </div>
              
              {voiceFeedback && (
                <div className={`mt-8 p-4 rounded-xl border-2 w-full text-center ${status === 'correct' ? 'border-emerald-500 bg-emerald-950/30' : 'border-amber-500 bg-amber-950/30'}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-xl font-bold ${status === 'correct' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Skor: {voiceFeedback.score}/100
                    </span>
                    {status === 'correct' && <CheckCircle className="text-emerald-400" size={24} />}
                  </div>
                  <p className="text-slate-300 font-medium">{voiceFeedback.feedback}</p>
                  {voiceFeedback.transcription && (
                    <div className="mt-2 text-xs text-slate-500 italic">Terdeteksi: "{voiceFeedback.transcription}"</div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Status Message for Puzzle */}
          {gameMode === 'puzzle' && status === 'wrong' && (
            <div className="text-center text-red-400 bg-red-950/30 py-3 rounded-lg border border-red-900/50 mb-6 font-bold animate-pulse">
              Urutan masih kurang tepat. Coba lagi!
            </div>
          )}

          {gameMode === 'puzzle' && status === 'correct' && (
            <div className="text-center text-emerald-400 bg-emerald-950/30 py-3 rounded-lg border border-emerald-900/50 mb-6 font-bold flex flex-col items-center gap-2 animate-in zoom-in">
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle size={20} /> Masha Allah! Susunan ayat sempurna.
              </div>
              <p className="text-sm text-emerald-200/80 italic font-normal">"{currentVerse.translation}"</p>
            </div>
          )}

        </div>
        
        {gameMode === 'puzzle' && (
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between gap-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RefreshCcw size={18} /> Ulangi
            </button>
            <button
              onClick={handleCheck}
              disabled={selectedPieces.length !== currentVerse.pieces.length || status === 'correct'}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg transition-all"
            >
              Cek Jawaban
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
