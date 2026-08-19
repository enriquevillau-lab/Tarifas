import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Share2,
  Copy,
  Printer,
  Calendar,
  Truck,
  ShieldAlert,
  FileDown,
  CheckCircle2,
  Car
} from 'lucide-react';
import { SavedBudget } from '../types';
import { formatCurrency } from '../utils/calculator';
import { openWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';

interface HistoryViewProps {
  budgets: SavedBudget[];
  onDeleteBudget: (id: string) => void;
  onClearAll: () => void;
  onViewPrintModal: (budget: SavedBudget) => void;
  onSelectBudget: (budget: SavedBudget) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  budgets,
  onDeleteBudget,
  onClearAll,
  onViewPrintModal,
  onSelectBudget
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'remolque' | 'rescate'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch =
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.plate && b.plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.expediente && b.expediente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.clientName && b.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' || b.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleCopy = async (b: SavedBudget) => {
    const text = generateWhatsAppMessage(b);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(b.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(budgets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `gruas_presupuestos_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              Historial de Presupuestos ({budgets.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Presupuestos guardados en memoria local de tu dispositivo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {budgets.length > 0 && (
              <>
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Exportar Copia</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas borrar todo el historial?')) {
                      onClearAll();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Vaciar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por matrícula, aseguradora, tonelaje, expediente..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-semibold"
            />
          </div>

          <div className="sm:col-span-4 flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Todos ({budgets.length})
            </button>
            <button
              onClick={() => setFilterType('remolque')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filterType === 'remolque' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🚛 Remolque
            </button>
            <button
              onClick={() => setFilterType('rescate')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                filterType === 'rescate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              🏗️ Rescate
            </button>
          </div>
        </div>
      </div>

      {/* List of budgets */}
      {filteredBudgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-500">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No hay presupuestos en el historial</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Calcula un presupuesto en la pestaña de Remolque o Rescate y pulsa en "Guardar" para tenerlo accesible aquí en cualquier momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBudgets.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                        b.type === 'rescate'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {b.type === 'rescate' ? '🏗️ RESCATE' : '🚛 ASISTENCIA'}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">{b.companyName}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(b.createdAt).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Main details */}
                <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-500" />
                      {b.plate ? (
                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                          {b.plate}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin matrícula</span>
                      )}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {b.isUrbano ? 'Serv. Urbano' : `${b.kms} KM`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium truncate">
                    {b.vehicleName}
                  </p>

                  {b.expediente && (
                    <p className="text-[11px] text-slate-500">
                      Expediente: <strong className="text-slate-700">{b.expediente}</strong>
                    </p>
                  )}

                  {(b.origin || b.destination) && (
                    <p className="text-[11px] text-slate-500 truncate">
                      📍 {[b.origin, b.destination].filter(Boolean).join(' ➔ ')}
                    </p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="flex items-baseline justify-between pt-1 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                      Base Imponible
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {formatCurrency(b.calculation.neto)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                      Total con IVA (21%)
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-amber-600">
                      {formatCurrency(b.calculation.totalWithIva)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openWhatsAppUrl(b, b.contactPhone)}
                  className="flex-1 py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(b)}
                  className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center justify-center transition"
                  title="Copiar texto"
                >
                  {copiedId === b.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onViewPrintModal(b)}
                  className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center justify-center transition"
                  title="Ver Ticket Formal / PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteBudget(b.id)}
                  className="py-2 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs flex items-center justify-center transition"
                  title="Eliminar de historial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
