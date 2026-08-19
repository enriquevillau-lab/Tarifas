import React from 'react';
import { Truck, ShieldAlert, History, BookOpen, Settings, Smartphone, Edit3 } from 'lucide-react';
import { ServiceCategory } from '../types';

interface HeaderProps {
  activeTab: 'remolque' | 'rescate' | 'history' | 'tariffs' | 'edit-tariffs' | 'settings';
  setActiveTab: (tab: 'remolque' | 'rescate' | 'history' | 'tariffs' | 'edit-tariffs' | 'settings') => void;
  savedCount: number;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenInstallModal
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30 border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-xl">
            <Truck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight text-white">
                GRÚAS <span className="text-amber-400">TORRE DEL ORO</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-none mt-0.5">
              Calculadora de Tarifas y Presupuestos Oficiales
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="install-app-btn"
            onClick={onOpenInstallModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition"
            title="Instalar en Móvil o Tablet"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Instalar App</span>
          </button>

          <button
            id="settings-tab-btn"
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Ajustes de Empresa"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 no-scrollbar">
          <button
            id="tab-remolque-btn"
            onClick={() => setActiveTab('remolque')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'remolque'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚛 Remolque / Asistencia</span>
          </button>

          <button
            id="tab-rescate-btn"
            onClick={() => setActiveTab('rescate')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'rescate'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>🏗️ Rescate / Pluma</span>
          </button>

          <button
            id="tab-edit-tariffs-btn"
            onClick={() => setActiveTab('edit-tariffs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'edit-tariffs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-amber-300 bg-slate-800/90 hover:bg-slate-800 border border-amber-400/30'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>✏️ Modificar Tarifas</span>
          </button>

          <button
            id="tab-tariffs-btn"
            onClick={() => setActiveTab('tariffs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'tariffs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tarifario</span>
          </button>

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
            {savedCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'history'
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
