import React, { useState } from 'react';
import { GameState } from '../types';
import { X, Package, ShoppingBag, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { INVENTORY_ITEMS, SHOP_ITEMS } from '../data/items';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onEquip: (type: 'alasKaki' | 'pakaian', itemId: string) => void;
  onBuy: (itemId: string) => void;
}

export function Dashboard({ isOpen, onClose, gameState, onEquip, onBuy }: Props) {
  const [activeTab, setActiveTab] = useState<'inventaris' | 'toko'>('inventaris');
  const [qrisStatus, setQrisStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [selectedShopItem, setSelectedShopItem] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleBuy = (itemId: string, price: number) => {
    if (gameState.uang_qris < price) {
      setQrisStatus('error');
      setTimeout(() => setQrisStatus('idle'), 2000);
      return;
    }
    
    setSelectedShopItem(itemId);
    setQrisStatus('scanning');
    
    // Simulate QRIS scan
    setTimeout(() => {
      setQrisStatus('success');
      onBuy(itemId);
      
      setTimeout(() => {
        setQrisStatus('idle');
        setSelectedShopItem(null);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">DASHBOARD SOSIOLOG MUDA</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Manajemen Karakter & Logistik</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => setActiveTab('inventaris')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'inventaris' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Package size={14} /> Inventaris
          </button>
          <button 
            onClick={() => setActiveTab('toko')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'toko' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-950/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ShoppingBag size={14} /> Toko Logistik
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900">
          
          {/* INVENTARIS TAB */}
          {activeTab === 'inventaris' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Equipment Status */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4 border-b border-slate-700 pb-2">Status Perlengkapan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Alas Kaki:</span>
                      <span className="text-sm font-semibold text-indigo-300">
                        {gameState.equipment.alasKaki ? INVENTORY_ITEMS.find(i => i.id === gameState.equipment.alasKaki)?.name : 'Kosong'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Pakaian:</span>
                      <span className="text-sm font-semibold text-indigo-300">
                        {gameState.equipment.pakaian ? INVENTORY_ITEMS.find(i => i.id === gameState.equipment.pakaian)?.name : 'Kosong'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {INVENTORY_ITEMS.map(item => {
                    const isEquipped = gameState.equipment[item.type as 'alasKaki'|'pakaian'] === item.id;
                    return (
                      <div key={item.id} className={`p-3 rounded-lg border flex justify-between items-center ${isEquipped ? 'bg-indigo-950/50 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                        <div>
                          <p className="text-sm font-bold text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                        </div>
                        <button 
                          onClick={() => onEquip(item.type as 'alasKaki'|'pakaian', item.id)}
                          disabled={isEquipped}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest ${isEquipped ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                        >
                          {isEquipped ? 'Dipakai' : 'Equip'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TOKO LOGISTIK TAB */}
          {activeTab === 'toko' && (
            <div className="space-y-6 max-w-lg mx-auto">
              
              {/* Wallet Card - Mobile Banking Style */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <QrCode size={64} />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-300/70 font-bold mb-1">Q-Pay Balance</p>
                <p className="text-3xl font-mono font-bold text-white">Rp {gameState.uang_qris.toLocaleString('id-ID')}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-950/50 px-2 py-1 rounded text-[10px] font-mono text-emerald-300">
                  <CheckCircle2 size={12} /> Terverifikasi
                </div>
              </div>

              {/* Shop Items */}
              <div className="space-y-3 relative">
                
                {/* QRIS Scanning Overlay */}
                {qrisStatus !== 'idle' && (
                  <div className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-slate-700">
                    {qrisStatus === 'scanning' && (
                      <>
                        <div className="w-16 h-16 relative mb-4">
                          <QrCode size={64} className="text-emerald-500 animate-pulse" />
                          <div className="absolute inset-0 bg-emerald-400/20 blur-xl animate-pulse rounded-full"></div>
                          {/* Scan line */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-[scan_1.5s_ease-in-out_infinite]" style={{ animationName: 'scan' }}></div>
                        </div>
                        <p className="text-sm font-bold text-emerald-400 animate-pulse">Memindai QRIS...</p>
                      </>
                    )}
                    {qrisStatus === 'success' && (
                      <>
                        <CheckCircle2 size={48} className="text-emerald-500 mb-4 animate-in zoom-in" />
                        <p className="text-sm font-bold text-white">Pembayaran Berhasil!</p>
                      </>
                    )}
                    {qrisStatus === 'error' && (
                      <>
                        <AlertCircle size={48} className="text-red-500 mb-4 animate-in zoom-in" />
                        <p className="text-sm font-bold text-white">Saldo Tidak Cukup!</p>
                      </>
                    )}
                  </div>
                )}

                <style>{`
                  @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                  }
                `}</style>

                {SHOP_ITEMS.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{item.name}</h4>
                      <p className="text-xs font-mono text-emerald-400 my-1">Rp {item.price.toLocaleString('id-ID')}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex items-end sm:items-center">
                      <button 
                        onClick={() => handleBuy(item.id, item.price)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        <QrCode size={14} /> Bayar QRIS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
