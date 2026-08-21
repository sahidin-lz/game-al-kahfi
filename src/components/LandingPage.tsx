import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Mail, GraduationCap, Shield } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function LandingPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message);
    }
  };

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const virtualEmail = `${username.toLowerCase().trim()}@alkahfi-rpg.com`;

      if (mode === 'register') {
        if (!name.trim()) throw new Error("Nama harus diisi");
        const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, virtualEmail, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Simplify Firebase error messages for users
      if (err.code === 'auth/email-already-in-use') setError('Username sudah digunakan.');
      else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') setError('Username atau password salah.');
      else if (err.code === 'auth/weak-password') setError('Password minimal 6 karakter.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] mb-6 text-2xl">
          AK
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] mb-2 uppercase text-center">
          AL-KAHFI RPG
        </h1>
        
        <p className="text-slate-400 text-sm mb-8 text-center">
          Sekolah Calon Pemimpin Berakhlak & Hafiz
        </p>

        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl">
          
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 mb-6">
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'login' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <LogIn size={16} /> Masuk Siswa
            </button>
            <button 
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'register' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <UserPlus size={16} /> Daftar Baru
            </button>
          </div>

          <form onSubmit={handleStudentAuth} className="space-y-4 mb-6">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {mode === 'register' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <GraduationCap size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Nama Lengkap Siswa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <UserPlus size={18} />
              </div>
              <input 
                type="text" 
                required
                placeholder="Username (misal: budi_123)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 mt-2
                ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : mode === 'login' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}
              `}
            >
              {loading ? 'Memproses...' : mode === 'login' ? 'Mulai Petualangan' : 'Buat Akun Siswa'}
            </button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-widest">Atau</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 rounded-lg font-bold text-slate-400 hover:text-amber-400 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            <Shield size={16} /> Login Khusus Admin / Guru
          </button>
        </div>
      </div>
    </div>
  );
}
