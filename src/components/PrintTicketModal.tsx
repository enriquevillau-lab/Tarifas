import React from 'react';
import { X, Printer, Share2, Truck, ShieldAlert } from 'lucide-react';
import { SavedBudget, CompanySettings } from '../types';
import { formatCurrency } from '../utils/calculator';
import { openWhatsAppUrl } from '../utils/whatsapp';

interface PrintTicketModalProps {
  budget: SavedBudget | null;
  settings: CompanySettings;
  onClose: () => void;
}

export const PrintTicketModal: React.FC<PrintTicketModalProps> = ({
  budget,
  settings,
  onClose
}) => {
  if (!budget) return null;

  const isRescate = budget.type === 'rescate';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
        
        {/* Top bar controls (hidden in print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              {isRescate ? <ShieldAlert className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Ticket / Albarán de Presupuesto
              </h3>
              <p className="text-xs text-slate-500">Formato formal para taller, cliente o aseguradora</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={() => openWhatsAppUrl(budget, budget.contactPhone)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-ticket" className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          
          {/* Document Header */}
          <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {settings.companyName}
              </h2>
              <p className="text-slate-600 text-[11px] font-medium">
                CIF: {settings.cifNif} | Tel: {settings.phone}
              </p>
              <p className="text-slate-600 text-[11px] font-medium">{settings.address}</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-amber-300 font-extrabold text-[11px] rounded">
                PRESUPUESTO #{budget.id.slice(-6).toUpperCase()}
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Fecha: {new Date(budget.createdAt).toLocaleDateString('es-ES')} {new Date(budget.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Intervention Details */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Compañía / Tarifa:</p>
              <p className="font-extrabold text-slate-900 text-sm">{budget.companyName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Matrícula Vehículo:</p>
              <p className="font-mono font-black text-slate-900 text-sm bg-amber-100 inline-block px-2 py-0.5 rounded">
                {budget.plate || 'S/M'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Tipo de Vehículo / Tonelaje:</p>
              <p className="font-bold text-slate-800">{budget.vehicleName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Tipo de Servicio:</p>
              <p className="font-bold text-slate-800">
                {budget.isUrbano ? 'Servicio Urbano / Local' : `Carretera (${budget.kms} KM)`}
              </p>
            </div>
            {budget.expediente && (
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Nº Expediente / Siniestro:</p>
                <p className="font-bold text-slate-800">{budget.expediente}</p>
              </div>
            )}
            {(budget.origin || budget.destination) && (
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Trayecto:</p>
                <p className="font-medium text-slate-800">
                  {[budget.origin, budget.destination].filter(Boolean).join(' ➔ ')}
                </p>
              </div>
            )}
          </div>

          {/* Concepts Table */}
          <div className="py-3">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="pb-1.5">Concepto</th>
                  <th className="pb-1.5 text-right">Cant.</th>
                  <th className="pb-1.5 text-right">Precio Un.</th>
                  <th className="pb-1.5 text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {budget.calculation.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 font-medium text-slate-800">{item.concept}</td>
                    <td className="py-1.5 text-right font-mono text-slate-600">
                      {item.quantity ? `${item.quantity} ${item.unit || ''}` : '1'}
                    </td>
                    <td className="py-1.5 text-right font-mono text-slate-600">
                      {item.isRecargo ? '—' : formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-slate-900">
                      {item.isRecargo ? `+${formatCurrency(item.total)}` : formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="pt-3 border-t-2 border-slate-900 flex justify-end">
            <div className="w-64 space-y-1 text-right">
              <div className="flex justify-between text-slate-600">
                <span>Base Imponible (Neto):</span>
                <span className="font-mono font-bold">{formatCurrency(budget.calculation.neto)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA ({(budget.calculation.ivaRate * 100).toFixed(0)}%):</span>
                <span className="font-mono font-bold">{formatCurrency(budget.calculation.ivaAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-300 text-sm font-black text-slate-900">
                <span>TOTAL CON IVA:</span>
                <span className="font-mono text-base font-black text-amber-600">
                  {formatCurrency(budget.calculation.totalWithIva)}
                </span>
              </div>
            </div>
          </div>

          {budget.notes && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-[9px]">Observaciones:</p>
              <p className="text-slate-700 italic text-[11px] mt-0.5">{budget.notes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-300 text-[10px] text-center">
            <div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                Firma Conductor / Grúas Torre del Oro
              </p>
            </div>
            <div>
              <p className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                Firma y DNI Conforme Asegurado / Taller
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
