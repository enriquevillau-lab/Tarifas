import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Edit3,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Truck,
  ShieldAlert,
  Percent,
  Euro,
  Clock,
  Unlock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { CompanyId, CompanyTariff, VehicleRate, RescueRate } from '../types';
import {
  getStoredCompanyTariffs,
  updateSingleCompanyTariff,
  resetCompanyTariff,
  resetAllCompanyTariffs,
  isCompanyTariffCustomized
} from '../utils/storage';
import { formatCurrency } from '../utils/calculator';
import confetti from 'canvas-confetti';

interface TariffEditorProps {
  onTariffsUpdated: () => void;
  onSelectTariffForQuote: (companyId: CompanyId, isRescue?: boolean) => void;
  initialCompanyId?: CompanyId;
}

export const TariffEditor: React.FC<TariffEditorProps> = ({
  onTariffsUpdated,
  onSelectTariffForQuote,
  initialCompanyId = 'allianz'
}) => {
  const [tariffsList, setTariffsList] = useState<CompanyTariff[]>(getStoredCompanyTariffs());
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>(initialCompanyId);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'vehicles' | 'rescues'>('vehicles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Working draft for current selected company
  const [currentTariff, setCurrentTariff] = useState<CompanyTariff>(() => {
    const list = getStoredCompanyTariffs();
    return JSON.parse(JSON.stringify(list.find((t) => t.id === initialCompanyId) || list[0]));
  });

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  // Sync currentTariff when selected company changes
  useEffect(() => {
    const found = tariffsList.find((t) => t.id === selectedCompanyId) || tariffsList[0];
    setCurrentTariff(JSON.parse(JSON.stringify(found)));
    setHasChanges(false);
  }, [selectedCompanyId, tariffsList]);

  const handleFieldChange = (field: keyof CompanyTariff, value: any) => {
    setCurrentTariff((prev) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleVehicleChange = (index: number, field: keyof VehicleRate, value: any) => {
    const updatedVehicles = [...currentTariff.vehicleRates];
    updatedVehicles[index] = {
      ...updatedVehicles[index],
      [field]: typeof value === 'number' ? Math.max(0, value) : value
    };
    setCurrentTariff((prev) => ({
      ...prev,
      vehicleRates: updatedVehicles
    }));
    setHasChanges(true);
  };

  const handleAddVehicle = () => {
    const newVehicle: VehicleRate = {
      id: `${currentTariff.id}-custom-veh-${Date.now()}`,
      name: 'Nuevo Vehículo / Rango Tonelaje',
      salida: 120.0,
      kmPrice: 1.5,
      kmPriceLargo: 1.4,
      kmLargoThreshold: 200,
      urbano: 130.0,
      horaTrabajo: currentTariff.defaultHoraTrabajoPrice || 48.0
    };
    setCurrentTariff((prev) => ({
      ...prev,
      vehicleRates: [...prev.vehicleRates, newVehicle]
    }));
    setHasChanges(true);
  };

  const handleDeleteVehicle = (index: number) => {
    if (currentTariff.vehicleRates.length <= 1) {
      alert('Debe haber al menos una categoría de vehículo configurada.');
      return;
    }
    const updatedVehicles = currentTariff.vehicleRates.filter((_, idx) => idx !== index);
    setCurrentTariff((prev) => ({
      ...prev,
      vehicleRates: updatedVehicles
    }));
    setHasChanges(true);
  };

  const handleRescueChange = (index: number, field: keyof RescueRate, value: any) => {
    const updatedRescues = [...currentTariff.rescueRates];
    updatedRescues[index] = {
      ...updatedRescues[index],
      [field]: typeof value === 'number' ? Math.max(0, value) : value
    };
    setCurrentTariff((prev) => ({
      ...prev,
      rescueRates: updatedRescues
    }));
    setHasChanges(true);
  };

  const handleAddRescue = () => {
    const newRescue: RescueRate = {
      id: `${currentTariff.id}-custom-res-${Date.now()}`,
      name: 'Nuevo Equipo de Rescate / Pluma',
      salida: 250.0,
      urbano: 250.0,
      kmPrice: 3.0,
      kmPriceLargo: 2.5,
      kmLargoThreshold: 200,
      horaRescate: 130.0,
      minHoras: 2,
      horaAyudante: currentTariff.defaultHoraAyudantePrice || 50.0,
      desvolcaje: 150.0
    };
    setCurrentTariff((prev) => ({
      ...prev,
      rescueRates: [...prev.rescueRates, newRescue]
    }));
    setHasChanges(true);
  };

  const handleDeleteRescue = (index: number) => {
    if (currentTariff.rescueRates.length <= 1) {
      alert('Debe haber al menos un tipo de rescate configurado.');
      return;
    }
    const updatedRescues = currentTariff.rescueRates.filter((_, idx) => idx !== index);
    setCurrentTariff((prev) => ({
      ...prev,
      rescueRates: updatedRescues
    }));
    setHasChanges(true);
  };

  const handleSaveCurrentTariff = () => {
    const updatedList = updateSingleCompanyTariff(currentTariff);
    setTariffsList(updatedList);
    setHasChanges(false);
    onTariffsUpdated();
    
    setSaveSuccessMessage(`¡Tarifas de ${currentTariff.shortName} guardadas correctamente!`);
    setTimeout(() => setSaveSuccessMessage(''), 3500);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.85 }
      });
    } catch {}
  };

  const handleResetCurrentTariff = () => {
    if (window.confirm(`¿Seguro que deseas restablecer los precios de ${currentTariff.name} a los valores oficiales por defecto?`)) {
      const updatedList = resetCompanyTariff(currentTariff.id);
      setTariffsList(updatedList);
      const found = updatedList.find((t) => t.id === currentTariff.id);
      if (found) setCurrentTariff(JSON.parse(JSON.stringify(found)));
      setHasChanges(false);
      onTariffsUpdated();
      setSaveSuccessMessage(`Tarifa de ${currentTariff.shortName} restablecida a valores oficiales.`);
      setTimeout(() => setSaveSuccessMessage(''), 3000);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('¿Seguro que deseas restablecer TODAS las tarifas de todas las compañías a los valores oficiales por defecto?')) {
      const resetList = resetAllCompanyTariffs();
      setTariffsList(resetList);
      const found = resetList.find((t) => t.id === selectedCompanyId) || resetList[0];
      setCurrentTariff(JSON.parse(JSON.stringify(found)));
      setHasChanges(false);
      onTariffsUpdated();
      setSaveSuccessMessage('Todas las tarifas se han restablecido a los valores oficiales.');
      setTimeout(() => setSaveSuccessMessage(''), 3500);
    }
  };

  const isCustomized = isCompanyTariffCustomized(currentTariff.id);

  // Filtered lists for quick search in the editor
  const filteredVehicles = currentTariff.vehicleRates.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRescues = currentTariff.rescueRates.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Edit3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                Editor y Modificador de Tarifas por Compañía
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Personaliza precios de salidas, kms, kms de largo recorrido, rescates, desbloqueos y mano de obra para cada aseguradora.
            </p>
          </div>

          <button
            onClick={handleResetAll}
            type="button"
            className="self-start sm:self-center px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-red-200 flex items-center gap-1.5 transition"
            title="Restablecer todas las compañías"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Todo a Valores Oficiales</span>
          </button>
        </div>

        {/* Company Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {tariffsList.map((t) => {
            const isSelected = selectedCompanyId === t.id;
            const hasCustom = isCompanyTariffCustomized(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedCompanyId(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{t.shortName}</span>
                {hasCustom && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Tarifa personalizada" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selected Company Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase">
                {currentTariff.logoBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">{currentTariff.name}</h3>
              {isCustomized ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Tarifa Personalizada
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Tarifa Oficial
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Edita los valores en los campos a continuación. Los cambios se aplicarán inmediatamente en la calculadora.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isCustomized && (
              <button
                type="button"
                onClick={handleResetCurrentTariff}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restablecer {currentTariff.shortName}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveCurrentTariff}
              className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg ${
                hasChanges
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasChanges ? 'Guardar Cambios*' : 'Guardado'}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation for the Company */}
        <div className="flex gap-2 border-t border-slate-800 pt-4 mt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('vehicles')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'vehicles'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Vehículos / Remolque ({currentTariff.vehicleRates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rescues')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'rescues'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Rescate / Pluma ({currentTariff.rescueRates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('general')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'general'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Recargos y Mano de Obra General</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUBTAB 1: VEHÍCULOS / REMOLQUE (Salida, Km, Km Largo Recorrido, Horas)
          ========================================================================= */}
      {activeSubTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                Precios de Asistencia y Remolque por Tonelaje ({currentTariff.shortName})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Modifica salidas, precio por km habitual, precio por km de largo recorrido y mano de obra por categoría.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddVehicle}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Categoría</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentTariff.vehicleRates.map((vehicle, idx) => (
              <div
                key={vehicle.id || idx}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-amber-400/60 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Nombre / Tonelaje MMA:
                    </label>
                    <input
                      type="text"
                      value={vehicle.name}
                      onChange={(e) => handleVehicleChange(idx, 'name', e.target.value)}
                      className="w-full font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-1.5"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTariffForQuote(currentTariff.id, false)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                      title="Probar en Calculadora de Remolque"
                    >
                      <span>Probar</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVehicle(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  {/* Salida */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Salida (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={vehicle.salida}
                        onChange={(e) => handleVehicleChange(idx, 'salida', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    </div>
                  </div>

                  {/* Km Normal */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Km Normal (€/km):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={vehicle.kmPrice}
                        onChange={(e) => handleVehicleChange(idx, 'kmPrice', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">€/km</span>
                    </div>
                  </div>

                  {/* Km Largo Recorrido */}
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                    <label className="block text-[10px] font-extrabold text-amber-900 uppercase mb-1">
                      Km Largo Rec. (€/km):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={vehicle.kmPriceLargo ?? vehicle.kmPrice}
                        onChange={(e) => handleVehicleChange(idx, 'kmPriceLargo', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-amber-950 bg-white border border-amber-300 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-amber-700 font-bold">€/km</span>
                    </div>
                  </div>

                  {/* Umbral Km Largo */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      A partir de (kms):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="10"
                        min="0"
                        value={vehicle.kmLargoThreshold ?? 200}
                        onChange={(e) => handleVehicleChange(idx, 'kmLargoThreshold', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-7"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">km</span>
                    </div>
                  </div>

                  {/* Urbano */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Urbano / Fijo (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={vehicle.urbano ?? vehicle.salida}
                        onChange={(e) => handleVehicleChange(idx, 'urbano', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    </div>
                  </div>

                  {/* Hora de Trabajo */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Mano Obra (€/h):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={vehicle.horaTrabajo ?? currentTariff.defaultHoraTrabajoPrice}
                        onChange={(e) => handleVehicleChange(idx, 'horaTrabajo', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">€/h</span>
                    </div>
                  </div>

                  {/* Rescate Mínimo */}
                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/70">
                    <label className="block text-[10px] font-extrabold text-blue-900 uppercase mb-1">
                      Rescate Mín (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={vehicle.rescateMinimo ?? (currentTariff.id === 'asitur' ? 92.70 : 0)}
                        onChange={(e) => handleVehicleChange(idx, 'rescateMinimo', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-blue-950 bg-white border border-blue-300 focus:border-blue-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-bold">€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: RESCATE / PLUMA (Salida Rescate, Km, Hora Rescate, Min Horas, Ayudante, Desvolcaje)
          ========================================================================= */}
      {activeSubTab === 'rescues' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Precios de Rescate Pesado y Grúa Pluma ({currentTariff.shortName})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Modifica salidas de rescate, precio por km, precio por hora de rescate, mínimo de horas, rescate mínimo y ayudante.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddRescue}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Equipo Rescate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentTariff.rescueRates.map((rescue, idx) => (
              <div
                key={rescue.id || idx}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-amber-400/60 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Nombre del Equipo / Grúa de Rescate:
                    </label>
                    <input
                      type="text"
                      value={rescue.name}
                      onChange={(e) => handleRescueChange(idx, 'name', e.target.value)}
                      className="w-full font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-1.5"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTariffForQuote(currentTariff.id, true)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                      title="Probar en Calculadora de Rescate"
                    >
                      <span>Probar Rescate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRescue(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar equipo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 text-xs">
                  {/* Salida Rescate */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Salida Rescate (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rescue.salida}
                        onChange={(e) => handleRescueChange(idx, 'salida', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    </div>
                  </div>

                  {/* Urbano Rescate */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Salida Urbano (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rescue.urbano ?? rescue.salida}
                        onChange={(e) => handleRescueChange(idx, 'urbano', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    </div>
                  </div>

                  {/* Km Rescate */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Km Rescate (€/km):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={rescue.kmPrice}
                        onChange={(e) => handleRescueChange(idx, 'kmPrice', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">€/km</span>
                    </div>
                  </div>

                  {/* Km Largo Recorrido Rescate */}
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                    <label className="block text-[10px] font-extrabold text-amber-900 uppercase mb-1">
                      Km Largo Resc. (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={rescue.kmPriceLargo ?? rescue.kmPrice}
                        onChange={(e) => handleRescueChange(idx, 'kmPriceLargo', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-amber-950 bg-white border border-amber-300 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-amber-700 font-bold">€/km</span>
                    </div>
                  </div>

                  {/* Hora de Rescate */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Hora Rescate (€/h):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rescue.horaRescate}
                        onChange={(e) => handleRescueChange(idx, 'horaRescate', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">€/h</span>
                    </div>
                  </div>

                  {/* Mínimo de Horas */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Mínimo Horas:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={rescue.minHoras}
                        onChange={(e) => handleRescueChange(idx, 'minHoras', parseInt(e.target.value) || 1)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">h</span>
                    </div>
                  </div>

                  {/* Rescate Mínimo (€) */}
                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/70">
                    <label className="block text-[10px] font-extrabold text-blue-900 uppercase mb-1">
                      Rescate Mín (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rescue.rescateMinimo ?? (currentTariff.id === 'asitur' ? 92.70 : rescue.minHoras * rescue.horaRescate)}
                        onChange={(e) => handleRescueChange(idx, 'rescateMinimo', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-blue-950 bg-white border border-blue-300 focus:border-blue-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-bold">€</span>
                    </div>
                  </div>

                  {/* Hora Ayudante */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Hora Ayudante (€/h):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={rescue.horaAyudante ?? currentTariff.defaultHoraAyudantePrice}
                        onChange={(e) => handleRescueChange(idx, 'horaAyudante', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">€/h</span>
                    </div>
                  </div>

                  {/* Desvolcaje */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                      Desvolcaje (€):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={rescue.desvolcaje ?? 0}
                        onChange={(e) => handleRescueChange(idx, 'desvolcaje', parseFloat(e.target.value) || 0)}
                        className="w-full font-mono font-bold text-slate-900 bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-2 py-1 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: RECARGOS Y PARÁMETROS GENERALES
          ========================================================================= */}
      {activeSubTab === 'general' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-500" />
              Recargos y Parámetros Oficiales ({currentTariff.name})
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Configuración de porcentajes de recargo, precios por defecto de mano de obra y desbloqueo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Recargo Carga */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Recargo Vehículo Cargado:</span>
                <span className="font-mono text-amber-600 font-bold text-sm">{currentTariff.defaultChargeRecargoPercent}%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={currentTariff.defaultChargeRecargoPercent}
                  onChange={(e) => handleFieldChange('defaultChargeRecargoPercent', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Se aplica sobre la suma del neto base del servicio.
              </p>
            </div>

            {/* Recargo Nocturnidad */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Recargo Nocturno / Festivo:</span>
                <span className="font-mono text-indigo-600 font-bold text-sm">{currentTariff.defaultNocturnoRecargoPercent}%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={currentTariff.defaultNocturnoRecargoPercent}
                  onChange={(e) => handleFieldChange('defaultNocturnoRecargoPercent', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Se aplica sobre la cuenta neta acumulada (con o sin carga).
              </p>
            </div>

            {/* Precio Desbloqueo */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Precio Desbloqueo por Defecto:</span>
                <span className="font-mono text-slate-900 font-bold text-sm">{formatCurrency(currentTariff.defaultDesbloqueoPrice)}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentTariff.defaultDesbloqueoPrice}
                  onChange={(e) => handleFieldChange('defaultDesbloqueoPrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Importe predeterminado cuando se marca la casilla de desbloqueo.
              </p>
            </div>

            {/* Precio Hora Espera */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Precio Hora de Espera:</span>
                <span className="font-mono text-slate-900 font-bold text-sm">{formatCurrency(currentTariff.defaultHoraEsperaPrice)}/h</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentTariff.defaultHoraEsperaPrice}
                  onChange={(e) => handleFieldChange('defaultHoraEsperaPrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€/h</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Tarifa por hora de espera en punto de origen o taller.
              </p>
            </div>

            {/* Precio Hora Mano de Obra General */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Precio Hora Mano de Obra Base:</span>
                <span className="font-mono text-slate-900 font-bold text-sm">{formatCurrency(currentTariff.defaultHoraTrabajoPrice)}/h</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentTariff.defaultHoraTrabajoPrice}
                  onChange={(e) => handleFieldChange('defaultHoraTrabajoPrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€/h</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Precio hora trabajo para reparaciones in situ y maniobras.
              </p>
            </div>

            {/* Precio Hora Ayudante */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 flex items-center justify-between">
                <span>Precio Hora Ayudante / Mecánico:</span>
                <span className="font-mono text-slate-900 font-bold text-sm">{formatCurrency(currentTariff.defaultHoraAyudantePrice)}/h</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentTariff.defaultHoraAyudantePrice}
                  onChange={(e) => handleFieldChange('defaultHoraAyudantePrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-mono font-bold bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€/h</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Tarifa aplicable cuando se requiere personal adicional.
              </p>
            </div>

            {/* Tope Máximo sin IVA */}
            <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-200 space-y-1.5">
              <label className="font-extrabold text-red-950 flex items-center justify-between">
                <span>Límite / Tope Cobertura (sin IVA):</span>
                <span className="font-mono text-red-700 font-bold text-sm">
                  {currentTariff.topeSinIva ? formatCurrency(currentTariff.topeSinIva) : 'Sin límite'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="10"
                  placeholder="0 para sin tope"
                  value={currentTariff.topeSinIva || ''}
                  onChange={(e) => handleFieldChange('topeSinIva', parseFloat(e.target.value) || undefined)}
                  className="w-full font-mono font-bold bg-white border border-red-200 focus:border-red-500 rounded-xl px-3 py-2 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              </div>
              <p className="text-[10px] text-red-800 leading-tight">
                Emite alerta cuando el presupuesto neto supera esta cantidad.
              </p>
            </div>

            {/* Fecha de Vigencia */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="font-extrabold text-slate-800 block">
                Fecha de Vigencia / Edición:
              </label>
              <input
                type="text"
                value={currentTariff.effectiveDate}
                onChange={(e) => handleFieldChange('effectiveDate', e.target.value)}
                className="w-full font-medium bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar (shows when changes are made) */}
      {hasChanges && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">
              Tienes cambios sin guardar en {currentTariff.shortName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveCurrentTariff}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
            >
              Guardar Ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
