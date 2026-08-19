import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RemolqueCalculator } from './components/RemolqueCalculator';
import { RescateCalculator } from './components/RescateCalculator';
import { HistoryView } from './components/HistoryView';
import { TariffBrowser } from './components/TariffBrowser';
import { TariffEditor } from './components/TariffEditor';
import { SettingsModal } from './components/SettingsModal';
import { PrintTicketModal } from './components/PrintTicketModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import {
  SavedBudget,
  CompanySettings,
  CompanyId,
  CompanyTariff
} from './types';
import {
  getSavedBudgets,
  deleteBudgetFromHistory,
  clearBudgetHistory,
  getCompanySettings,
  saveCompanySettings,
  getStoredCompanyTariffs,
  saveStoredCompanyTariffs
} from './utils/storage';
import {
  subscribeToTariffsSync,
  pullTariffsFromCloud,
  pushTariffsToCloud
} from './utils/cloudSync';
import { Truck, ShieldAlert, History, BookOpen, Edit3, Cloud, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'remolque' | 'rescate' | 'history' | 'tariffs' | 'edit-tariffs' | 'settings'>('remolque');
  const [targetCompanyId, setTargetCompanyId] = useState<CompanyId>('allianz');
  
  // Storage state
  const [savedBudgets, setSavedBudgets] = useState<SavedBudget[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(getCompanySettings());
  const [tariffs, setTariffs] = useState<CompanyTariff[]>(() => getStoredCompanyTariffs());
  
  // Modals
  const [printModalBudget, setPrintModalBudget] = useState<SavedBudget | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [cloudSyncBanner, setCloudSyncBanner] = useState<string | null>(null);

  // Subscribe to Real-Time Cloud Tariffs Sync across all connected terminals
  useEffect(() => {
    // 1. Initial pull from Cloud Firestore on start
    pullTariffsFromCloud().then((cloudData) => {
      if (cloudData.tariffs && cloudData.tariffs.length > 0) {
        setTariffs(cloudData.tariffs);
        saveStoredCompanyTariffs(cloudData.tariffs);
      } else {
        // First run: Seed current local tariffs to Cloud
        const currentLocal = getStoredCompanyTariffs();
        pushTariffsToCloud(currentLocal, 'Inicialización Servidor');
      }
    });

    // 2. Real-time Live Listener for any change made by other devices
    const unsubscribe = subscribeToTariffsSync((updatedTariffs, meta) => {
      setTariffs(updatedTariffs);
      saveStoredCompanyTariffs(updatedTariffs);
      setCloudSyncBanner(`⚡ Tarifas sincronizadas en la nube (${meta.updatedBy || 'Terminal Conectada'})`);
      setTimeout(() => setCloudSyncBanner(null), 4000);
    });

    return () => unsubscribe();
  }, []);

  // Capture beforeinstallprompt for native 1-click install
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDirectInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallModalOpen(false);
      }
    }
  };

  // Load budgets on start
  const refreshBudgets = useCallback(() => {
    setSavedBudgets(getSavedBudgets());
  }, []);

  useEffect(() => {
    refreshBudgets();
  }, [refreshBudgets]);

  // Handlers
  const handleDeleteBudget = (id: string) => {
    const updated = deleteBudgetFromHistory(id);
    setSavedBudgets(updated);
  };

  const handleClearAllBudgets = () => {
    clearBudgetHistory();
    setSavedBudgets([]);
  };

  const handleSaveSettings = (newSettings: CompanySettings) => {
    saveCompanySettings(newSettings);
    setSettings(newSettings);
  };

  const handleSelectTariffForQuote = (companyId: CompanyId, isRescue: boolean = false) => {
    setTargetCompanyId(companyId);
    setActiveTab(isRescue ? 'rescate' : 'remolque');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTariffEditor = (companyId?: CompanyId) => {
    if (companyId) {
      setTargetCompanyId(companyId);
    }
    setActiveTab('edit-tariffs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTariffsUpdated = () => {
    setTariffs(getStoredCompanyTariffs());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-20 sm:pb-8">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedBudgets.length}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Real-time Cloud Sync Toast Banner */}
      {cloudSyncBanner && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-amber-300 border border-amber-400/40 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Cloud className="w-4 h-4 text-amber-400" />
          <span>{cloudSyncBanner}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'remolque' && (
          <RemolqueCalculator
            key={`remolque-${targetCompanyId}-${tariffs.length}`}
            initialCompanyId={targetCompanyId}
            tariffs={tariffs}
            onBudgetSaved={refreshBudgets}
            onViewPrintModal={(b) => setPrintModalBudget(b)}
            onOpenTariffEditor={handleOpenTariffEditor}
          />
        )}

        {activeTab === 'rescate' && (
          <RescateCalculator
            key={`rescate-${targetCompanyId}-${tariffs.length}`}
            initialCompanyId={targetCompanyId}
            tariffs={tariffs}
            onBudgetSaved={refreshBudgets}
            onViewPrintModal={(b) => setPrintModalBudget(b)}
            onOpenTariffEditor={handleOpenTariffEditor}
          />
        )}

        {activeTab === 'edit-tariffs' && (
          <TariffEditor
            initialCompanyId={targetCompanyId}
            onTariffUpdated={handleTariffsUpdated}
            onBackToCalculator={(companyId, isRescue) => {
              if (companyId) setTargetCompanyId(companyId);
              setActiveTab(isRescue ? 'rescate' : 'remolque');
            }}
          />
        )}

        {activeTab === 'tariffs' && (
          <TariffBrowser
            tariffs={tariffs}
            onSelectTariffForQuote={handleSelectTariffForQuote}
            onOpenTariffEditor={handleOpenTariffEditor}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            budgets={savedBudgets}
            onDeleteBudget={handleDeleteBudget}
            onClearAll={handleClearAllBudgets}
            onViewPrintModal={(b) => setPrintModalBudget(b)}
            onSelectBudget={(b) => {
              setTargetCompanyId(b.companyId);
              setActiveTab(b.type);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* Mobile Floating Bottom Bar for Ultra Fast Switching on Android / Tablets */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2 z-40 sm:hidden flex justify-around items-center">
        <button
          onClick={() => setActiveTab('remolque')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'remolque'
              ? 'text-amber-400 bg-slate-800/80 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Remolque</span>
        </button>

        <button
          onClick={() => setActiveTab('rescate')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'rescate'
              ? 'text-amber-400 bg-slate-800/80 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Rescate</span>
        </button>

        <button
          onClick={() => setActiveTab('edit-tariffs')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'edit-tariffs'
              ? 'text-amber-400 bg-slate-800/80 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tarifas</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl relative transition ${
            activeTab === 'history'
              ? 'text-amber-400 bg-slate-800/80 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Historial</span>
          {savedBudgets.length > 0 && (
            <span className="absolute top-0.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">
              {savedBudgets.length}
            </span>
          )}
        </button>
      </div>

      {/* Modals */}
      <PrintTicketModal
        budget={printModalBudget}
        settings={settings}
        onClose={() => setPrintModalBudget(null)}
      />

      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onDirectInstall={handleDirectInstall}
      />
    </div>
  );
}
