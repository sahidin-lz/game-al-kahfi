import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Square, Loader2 } from 'lucide-react';

export function MusicGenerator({ context }: { context: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateMusic = async () => {
    setIsGenerating(true);
    let audioBase64 = '';
    let mimeType = 'audio/wav';

    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: context }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              if (data.audio) {
                audioBase64 += data.audio;
                if (data.mimeType) mimeType = data.mimeType;
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }

      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }

    } catch (error) {
      console.error("Music generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
      <Music size={16} className="text-purple-400" />
      <span className="text-xs text-slate-400 font-bold tracking-widest uppercase flex-1">BGM (Lyria)</span>
      
      <button 
        onClick={generateMusic}
        disabled={isGenerating}
        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : 'Buat Musik'}
      </button>
      
      <button 
        onClick={togglePlay}
        disabled={!audioRef.current?.src}
        className="p-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-50"
      >
        {isPlaying ? <Square size={12} className="text-slate-200" /> : <Play size={12} className="text-slate-200" />}
      </button>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} loop />
    </div>
  );
}