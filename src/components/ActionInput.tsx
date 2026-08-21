import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Type, Loader2, Globe, MapPin } from 'lucide-react';
import { MusicGenerator } from './MusicGenerator';

interface Props {
  onActionSubmit: (action: string, type: 'teks_esai' | 'suara_orasi') => void;
  disabled: boolean;
  locationContext?: string;
}

export function ActionInput({ onActionSubmit, disabled, locationContext }: Props) {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<'teks_esai' | 'suara_orasi'>('teks_esai');
  const [isRecording, setIsRecording] = useState(false);
  const [groundingResult, setGroundingResult] = useState<string | null>(null);
  const [isGrounding, setIsGrounding] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'id-ID';

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setText(currentTranscript.trim());
        };

        recognitionRef.current.onerror = () => {
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onActionSubmit(text, inputType);
    setText('');
    setGroundingResult(null);
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Browser Anda tidak mendukung fitur Suara (Speech Recognition). Gunakan Teks.");
      return;
    }
    setText('');
    setInputType('suara_orasi');
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGrounding = async (type: 'search' | 'maps') => {
    if (!text.trim()) {
      alert("Tuliskan konteks riset di input teks terlebih dahulu sebelum mencari fakta!");
      return;
    }
    setIsGrounding(true);
    setGroundingResult("Mencari referensi...");
    try {
      const res = await fetch('/api/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, type })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGroundingResult(data.result);
    } catch (err: any) {
      setGroundingResult("Gagal mendapatkan referensi: " + err.message);
    } finally {
      setIsGrounding(false);
    }
  };

  return (
    <div className="bg-slate-900 p-4 border-t border-slate-800 relative z-10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto">
        
        <MusicGenerator context={locationContext || 'A tense situation in a local village'} />
        
        <div className="flex items-center space-x-4 mb-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setInputType('teks_esai')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border whitespace-nowrap ${inputType === 'teks_esai' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            <Type size={14} />
            <span>Teks Esai</span>
          </button>
          <button
            type="button"
            onClick={() => setInputType('suara_orasi')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors border whitespace-nowrap ${inputType === 'suara_orasi' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            <Mic size={14} />
            <span>Orasi</span>
          </button>
          
          <div className="w-px h-4 bg-slate-800 mx-2"></div>
          
          {/* Tombol Pencarian Budaya Nusantara */}
          <button
            type="button"
            onClick={() => {
              const query = text.trim() ? `Kearifan lokal budaya nusantara Indonesia terkait: ${text}` : "Contoh resolusi konflik dalam kebudayaan Nusantara Indonesia";
              handleGrounding('search');
              setText(query); // Auto-fill query
            }}
            disabled={disabled || isGrounding}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors border border-amber-500/50 text-amber-400 hover:bg-amber-950/50 disabled:opacity-50 whitespace-nowrap shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            🌋 <span>Info Nusantara (AI)</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleGrounding('maps')}
            disabled={disabled || isGrounding}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors border border-blue-500/50 text-blue-400 hover:bg-blue-950/50 disabled:opacity-50 whitespace-nowrap"
          >
            🗺️ <span>Cari Lokasi</span>
          </button>
        </div>
        
        {groundingResult && (
          <div className="mb-3 p-3 bg-slate-950 border border-slate-800 rounded-md">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-2">
              <Globe size={12} /> Hasil Riset & Grounding (Gemini 3.5 Flash)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-serif">{groundingResult}</p>
            <button onClick={() => setGroundingResult(null)} className="text-[10px] text-blue-400 mt-2 font-bold uppercase hover:underline">Tutup</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          {inputType === 'teks_esai' ? (
             <div className="flex items-end space-x-2">
               <textarea
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 disabled={disabled || isRecording}
                 placeholder="Tuliskan argumen atau tindakan Sosiologis Anda di sini..."
                 className="flex-1 rounded border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[80px] p-3 text-slate-200 disabled:opacity-50 resize-y"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSubmit(e);
                   }
                 }}
               />
               <button
                 type="submit"
                 disabled={disabled || !text.trim()}
                 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-4 py-3 h-[80px] rounded shadow-sm transition-colors uppercase text-xs font-bold tracking-widest"
               >
                 {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                 <span className="hidden md:inline">Kirim Tindakan</span>
               </button>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-lg border border-dashed border-slate-700">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                className={`p-6 rounded-full shadow-lg transition-all select-none ${isRecording ? 'bg-red-500 text-white animate-pulse scale-110 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700'}`}
              >
                <Mic size={32} />
              </button>
              <p className={`mt-4 text-xs font-bold tracking-widest uppercase transition-colors ${isRecording ? 'text-red-500' : 'text-slate-500'}`}>
                {isRecording ? "Mendengarkan orasi Anda... (Klik untuk berhenti)" : "Klik Untuk Mulai Orasi"}
              </p>
              {text && !isRecording && (
                <div className="mt-4 w-full bg-slate-900 p-4 rounded border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-slate-300 italic text-sm">"{text}"</span>
                  <button type="submit" onClick={handleSubmit} disabled={disabled} className="bg-emerald-600 flex items-center justify-center min-w-[160px] text-white px-4 py-3 rounded text-xs font-bold tracking-widest uppercase hover:bg-emerald-500 disabled:bg-slate-800">
                     {disabled ? <Loader2 size={16} className="animate-spin" /> : "Kirim Tindakan"}
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
