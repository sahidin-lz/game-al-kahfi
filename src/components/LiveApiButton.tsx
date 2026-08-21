import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

// pcmToBase64 helper
function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer) as any));
}

// base64ToPcm helper
function base64ToPcm(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
}

export function LiveApiButton() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/live`);
      wsRef.current = ws;

      const inputCtx = new window.AudioContext({ sampleRate: 16000 });
      inputCtxRef.current = inputCtx;
      const outputCtx = new window.AudioContext({ sampleRate: 24000 });
      outputCtxRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onopen = () => {
        setIsConnecting(false);
        setIsActive(true);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          const pcmData = base64ToPcm(msg.audio);
          
          if (outputCtx.state === 'suspended') {
            outputCtx.resume();
          }

          const buffer = outputCtx.createBuffer(1, pcmData.length, outputCtx.sampleRate);
          buffer.getChannelData(0).set(pcmData);

          const sourceNode = outputCtx.createBufferSource();
          sourceNode.buffer = buffer;
          sourceNode.connect(outputCtx.destination);
          
          const currentTime = outputCtx.currentTime;
          if (nextStartTimeRef.current < currentTime) {
            nextStartTimeRef.current = currentTime + 0.05; // slight buffer
          }
          sourceNode.start(nextStartTimeRef.current);
          nextStartTimeRef.current += buffer.duration;
        }
        if (msg.interrupted) {
          // Reset schedule
          nextStartTimeRef.current = 0;
        }
      };

      ws.onclose = () => {
        stopSession();
      };

    } catch (err) {
      console.error("Failed to start Live API", err);
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      outputCtxRef.current.close();
      outputCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  if (isActive) {
    return (
      <button 
        onClick={stopSession}
        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
      >
        <Square size={14} fill="currentColor" />
        <span className="text-xs font-bold tracking-widest uppercase">Live (Stop)</span>
      </button>
    );
  }

  return (
    <button 
      onClick={startSession}
      disabled={isConnecting}
      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
    >
      {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
      <span className="text-xs font-bold tracking-widest uppercase">
        {isConnecting ? 'Menyambung...' : 'Tanya Langsung'}
      </span>
    </button>
  );
}