import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { LogIn } from 'lucide-react';

interface Props {
  user: any;
}

export function AuthButton({ user }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  if (user) {
    return (
      <button 
        onClick={handleSignOut}
        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded transition-colors group"
      >
        <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-600">
          {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 hidden md:inline group-hover:text-red-400">
          Logout
        </span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
    >
      <LogIn size={14} className="text-white" />
      <span className="text-[10px] uppercase tracking-widest font-bold text-white hidden md:inline">
        Login
      </span>
    </button>
  );
}
