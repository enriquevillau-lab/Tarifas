import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Truck,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Edit3,
  Sparkles
} from 'lucide-react';
import { COMPANY_TARIFFS } from '../data/tariffsData';
import { CompanyId, CompanyTariff } from '../types';
import { formatCurrency } from '../utils/calculator';
import { getStoredCompanyTariffs, isCompanyTariffCustomized } from '../utils/storage';

interface TariffBrowserProps {
  tariffs?: CompanyTariff[];
  onSelectTariffForQuote: (companyId: CompanyId, isRescue?: boolean) => void;
  onOpenTariffEditor?: (companyId: CompanyId) => void;
}

export const TariffBrowser: React.FC<TariffBrowserProps> = ({
  tariffs,
  onSelectTariffForQuote,
  onOpenTariffEditor
}) => {
  const availableTariffs = tariffs || getStoredCompanyTariffs();
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>('allianz');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const activeTariff = availableTariffs.find((c) => c.id === selectedCompanyId) || availableTariffs[0];
  const isCustomized = isCompanyTariffCustomized(activeTariff.id);

  const filteredVehicles = activeTariff.vehicleRates.filter((v) =>
    v.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredRescues = activeTariff.rescueRates.filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Tarifario de Compañías de Asistencia
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulta de tablas de precios oficiales y personalizadas de asistencia en carretera y rescate pesado
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTariffEditor && (
              <button
                type="button"
                onClick={() => onOpenTariffEditor(selectedCompanyId)}
                className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modificar Precios</span>
              </button>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar vehículo / tonelaje..."
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs font-semibold w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Company Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {availableTariffs.map((t) => {
            const isSelected = selectedCompanyId === t.id;
            const hasCustom = isCompanyTariffCustomized(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedCompanyId(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{t.shortName}</span>
                {hasCustom && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Tarifa modificada" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Company Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-900">{activeTariff.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {activeTariff.effectiveDate}
              </span>
              {isCustomized && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Personalizada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeTariff.tagline}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenTariffEditor && (
              <button
                onClick={() => onOpenTariffEditor(activeTariff.id)}
                className="py-2 px-3 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Editar {activeTariff.shortName}</span>
              </button>
            )}

            <button
              onClick={() => onSelectTariffForQuote(activeTariff.id, false)}
              className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Crear Asistencia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectTariffForQuote(activeTariff.id, true)}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Crear Rescate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick parameters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Desbloqueo</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {activeTariff.pagaDesbloqueo
                ? formatCurrency(activeTariff.defaultDesbloqueoPrice)
                : 'No cubierto (0 €)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Recargo Carga</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {activeTariff.cubreCarga ? `+${activeTariff.defaultChargeRecargoPercent}%` : 'No cubierto (0%)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Nocturno / Festivo</span>
            <span className="font-extrabold text-slate-900 text-sm">
              +{activeTariff.defaultNocturnoRecargoPercent}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hora de Espera</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {formatCurrency(activeTariff.defaultHoraEsperaPrice)} / h
            </span>
          </div>
        </div>

        {/* Notes */}
        {activeTariff.specialNotes && activeTariff.specialNotes.length > 0 && (
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-950 text-xs mb-4">
            <strong className="block font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              Condiciones Particulares y Observaciones:
            </strong>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-tight">
              {activeTariff.specialNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 1. Tabla de Remolque / Asistencia */}
        <div className="mt-4">
          <h4 className="text-sm font-extrabold text-slate-900 mb-2.5 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            Tarifas de Vehículos y Tonelajes (Asistencia y Remolque)
          </h4>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Tipo de Vehículo / Tonelaje</th>
                  <th className="py-2.5 px-3 text-right">Salida Base</th>
                  <th className="py-2.5 px-3 text-right">Precio / Km</th>
                  <th className="py-2.5 px-3 text-right">Urbano / Local</th>
                  <th className="py-2.5 px-3 text-right">Hora M.O</th>
                  <th className="py-2.5 px-3 text-right">Rescate Mín.</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredVehicles.map((vhc) => (
                  <tr key={vhc.id} className="hover:bg-amber-50/50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{vhc.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatCurrency(vhc.salida)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-bold">
                      {formatCurrency(vhc.kmPrice)}/km
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {vhc.urbano ? formatCurrency(vhc.urbano) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {vhc.horaTrabajo ? formatCurrency(vhc.horaTrabajo) : formatCurrency(activeTariff.defaultHoraTrabajoPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      {vhc.rescateMinimo ? formatCurrency(vhc.rescateMinimo) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectTariffForQuote(activeTariff.id, false)}
                        className="px-2 py-1 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 text-[10px] font-bold rounded-md transition"
                      >
                        Calcular
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Tabla de Rescate */}
        {activeTariff.rescueRates.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-extrabold text-slate-900 mb-2.5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Tarifas de Rescate y Grúas Pluma
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Equipo / Capacidad Pluma</th>
                    <th className="py-2.5 px-3 text-right">Salida Base</th>
                    <th className="py-2.5 px-3 text-right">Salida Urbano</th>
                    <th className="py-2.5 px-3 text-right">Precio / Km</th>
                    <th className="py-2.5 px-3 text-right">Hora Rescate</th>
                    <th className="py-2.5 px-3 text-center">Mín. Horas</th>
                    <th className="py-2.5 px-3 text-right">Rescate Mínimo</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRescues.map((resc) => (
                    <tr key={resc.id} className="hover:bg-red-50/40 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{resc.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {formatCurrency(resc.salida)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                        {resc.urbano ? formatCurrency(resc.urbano) : formatCurrency(resc.salida)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                        {formatCurrency(resc.kmPrice)}/km
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {formatCurrency(resc.horaRescate)}/h
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[10px]">
                          {resc.minHoras}h mín.
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                        {formatCurrency(resc.rescateMinimo ?? (resc.minHoras * resc.horaRescate))}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onSelectTariffForQuote(activeTariff.id, true)}
                          className="px-2 py-1 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 text-[10px] font-bold rounded-md transition"
                        >
                          Calcular
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
