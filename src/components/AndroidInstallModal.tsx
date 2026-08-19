import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Download,
  CheckCircle2,
  Share2,
  PlusSquare,
  ShieldCheck,
  Copy,
  Send,
  ExternalLink,
  Laptop,
  Cloud,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { CompanyTariff } from '../types';
import { pushTariffsToCloud } from '../utils/cloudSync';
import { getStoredCompanyTariffs } from '../utils/storage';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onDirectInstall?: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onDirectInstall
}) => {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncedNotice, setSyncedNotice] = useState(false);

  if (!isOpen) return null;

  // Best clean share URL
  const currentUrl = window.location.origin || window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncAndShare = async () => {
    setSyncing(true);
    try {
      const currentTariffs = getStoredCompanyTariffs();
      await pushTariffsToCloud(currentTariffs, 'Enlace Compartido');
      setSyncedNotice(true);
      setTimeout(() => setSyncedNotice(false), 3000);
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Grúas Torre del Oro - App de Tarifas Oficiales',
            text: 'Calculadora de tarifas oficiales de grúas, remolque y rescate con sincronización en tiempo real.',
            url: currentUrl
          });
        } catch {}
      } else {
        await handleCopyLink();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = `🚨 *Grúas Torre del Oro - App de Tarifas y Presupuestos Oficiales*\n\nAccede a la app actualizada con todas las tarifas en tiempo real (Asitur 92,70 €, Km, M.O., recargos oficiales):\n👉 ${currentUrl}\n\n💡 *Para instalar en tu móvil:* Abre el enlace en Google Chrome o Safari y selecciona "Añadir a pantalla de inicio" o "Instalar aplicación".`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Instalar / Descargar App
              </h3>
              <p className="text-xs text-slate-500">Para Móvil, Tablet Android o PC</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs text-slate-600">
          
          {/* Botón de instalación directa si está disponible */}
          {deferredPrompt && onDirectInstall && (
            <button
              onClick={onDirectInstall}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span>Instalar Directamente en este Dispositivo</span>
            </button>
          )}

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black text-xs text-emerald-900">
                100% Funcional como App Nativa (PWA / APK)
              </strong>
              <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                Funciona a pantalla completa sin barra de navegación, recuerda tus presupuestos guardados y permite enviar presupuestos al instante por WhatsApp.
              </p>
            </div>
          </div>

          {/* Cloud Sync Status Guarantee Banner */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <strong className="block font-black text-xs text-amber-950 flex items-center gap-1.5">
                <span>Tarifas 100% Actualizadas en la Nube</span>
                <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
                  En tiempo real
                </span>
              </strong>
              <p className="text-[11px] text-amber-900 leading-tight mt-0.5">
                Cualquier persona que abra o instale este enlace en su teléfono o tablet tendrá al instante todas las modificaciones de precios (precio/km, mano de obra, Asitur a 92,70 €, etc.) sin tener que volver a configurarlas.
              </p>
            </div>
          </div>

          {/* Compartir o Abrir en el Móvil */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900 block">
                📲 Compartir Enlace de Descarga Actualizado:
              </span>
              {syncedNotice && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ¡Sincronizado a la nube!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>

              <button
                onClick={handleSyncAndShare}
                disabled={syncing}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 disabled:opacity-50"
              >
                {syncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : copied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4 text-amber-400" />
                )}
                <span>{syncing ? 'Sincronizando...' : copied ? '¡Enlace Copiado!' : 'Copiar / Compartir'}</span>
              </button>
            </div>

            {/* Display clean URL */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600 overflow-hidden">
              <span className="truncate mr-2 select-all">{currentUrl}</span>
              <button
                onClick={handleCopyLink}
                className="p-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-sans font-bold text-[10px] rounded shrink-0 transition"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Pasos para instalar en 10 segundos en Android (Chrome):
          </h4>

          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-slate-900">Abre el enlace en Google Chrome</p>
                <p className="text-[11px] text-slate-500">
                  En tu móvil o tablet Android.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <PlusSquare className="w-3.5 h-3.5 text-amber-600" />
                  Pulsa en el menú (⋮) y elige "Instalar aplicación" o "Añadir a inicio"
                </p>
                <p className="text-[11px] text-slate-500">
                  Se creará el icono de <strong>Grúas Torre del Oro</strong> en tu pantalla principal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-slate-900">¡Úsala con un toque en cualquier momento!</p>
                <p className="text-[11px] text-slate-500">
                  Se abrirá a pantalla completa como cualquier app descargada de Play Store.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs rounded-xl transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
