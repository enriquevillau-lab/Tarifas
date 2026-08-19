import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Share2,
  Copy,
  Save,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Unlock,
  Package,
  Moon,
  Info,
  MapPin,
  ChevronDown,
  Edit3,
  ShieldAlert
} from 'lucide-react';
import { COMPANY_TARIFFS } from '../data/tariffsData';
import {
  CompanyId,
  CompanyTariff,
  VehicleRate,
  SavedBudget,
  BudgetCalculationResult
} from '../types';
import { calculateRemolqueBudget, formatCurrency } from '../utils/calculator';
import { openWhatsAppUrl, generateWhatsAppMessage } from '../utils/whatsapp';
import { saveBudgetToHistory, getStoredCompanyTariffs } from '../utils/storage';
import { pushBudgetToCloud } from '../utils/cloudSync';
import confetti from 'canvas-confetti';

interface RemolqueCalculatorProps {
  initialCompanyId?: CompanyId;
  tariffs?: CompanyTariff[];
  onBudgetSaved: () => void;
  onViewPrintModal: (budget: SavedBudget) => void;
  onOpenTariffEditor?: (companyId: CompanyId) => void;
}

export const RemolqueCalculator: React.FC<RemolqueCalculatorProps> = ({
  initialCompanyId = 'allianz',
  tariffs,
  onBudgetSaved,
  onViewPrintModal,
  onOpenTariffEditor
}) => {
  const availableTariffs = tariffs || getStoredCompanyTariffs();

  // State
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>(initialCompanyId);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  
  // Service configuration
  const [isUrbano, setIsUrbano] = useState<boolean>(false);
  const [kms, setKms] = useState<number>(35);
  const [customKmPrice, setCustomKmPrice] = useState<number | undefined>(undefined);
  const [forceLargoRecorrido, setForceLargoRecorrido] = useState<boolean>(false);
  const [desbloqueo, setDesbloqueo] = useState<boolean>(false);
  const [customDesbloqueoPrice, setCustomDesbloqueoPrice] = useState<number | undefined>(undefined);
  const [rescateMinimo, setRescateMinimo] = useState<boolean>(false);
  const [cantidadRescateMinimo, setCantidadRescateMinimo] = useState<number>(0);
  const [customRescateMinimoPrice, setCustomRescateMinimoPrice] = useState<number | undefined>(undefined);
  
  const [horasTrabajo, setHorasTrabajo] = useState<number>(0);
  const [customHoraTrabajoPrice, setCustomHoraTrabajoPrice] = useState<number | undefined>(undefined);
  
  const [horasEspera, setHorasEspera] = useState<number>(0);
  const [customHoraEsperaPrice, setCustomHoraEsperaPrice] = useState<number | undefined>(undefined);
  
  const [isCargado, setIsCargado] = useState<boolean>(false);
  const [cargaPercent, setCargaPercent] = useState<number>(20);
  
  const [isNocturno, setIsNocturno] = useState<boolean>(false);
  const [nocturnoPercent, setNocturnoPercent] = useState<number>(50);
  
  const [suplementosExtra, setSuplementosExtra] = useState<number>(0);
  const [suplementoConcepto, setSuplementoConcepto] = useState<string>('');

  // Identifiers
  const [plate, setPlate] = useState<string>('');
  const [expediente, setExpediente] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [origin, setOrigin] = useState<string>('Sevilla');
  const [destination, setDestination] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Active Tariff
  const activeTariff = useMemo<CompanyTariff>(() => {
    return (
      availableTariffs.find((t) => t.id === selectedCompanyId) || availableTariffs[0]
    );
  }, [availableTariffs, selectedCompanyId]);

  // Active Vehicle Rate
  const activeVehicle = useMemo<VehicleRate>(() => {
    const found = activeTariff.vehicleRates.find((v) => v.id === selectedVehicleId);
    return found || activeTariff.vehicleRates[0];
  }, [activeTariff, selectedVehicleId]);

  // Sync state when company changes
  useEffect(() => {
    if (activeTariff.vehicleRates.length > 0) {
      const firstVehicle = activeTariff.vehicleRates[0];
      setSelectedVehicleId(firstVehicle.id);
      setCustomRescateMinimoPrice(firstVehicle.rescateMinimo || (activeTariff.id === 'asitur' ? 92.70 : undefined));
    }
    setCargaPercent(activeTariff.defaultChargeRecargoPercent);
    setNocturnoPercent(activeTariff.defaultNocturnoRecargoPercent);
    setCustomDesbloqueoPrice(activeTariff.defaultDesbloqueoPrice);
    setCustomHoraTrabajoPrice(activeTariff.defaultHoraTrabajoPrice);
    setCustomHoraEsperaPrice(activeTariff.defaultHoraEsperaPrice);
  }, [activeTariff]);

  useEffect(() => {
    if (activeVehicle) {
      if (activeVehicle.rescateMinimo !== undefined) {
        setCustomRescateMinimoPrice(activeVehicle.rescateMinimo);
      } else if (activeTariff.id === 'asitur') {
        setCustomRescateMinimoPrice(92.70);
      }
    }
  }, [activeVehicle, activeTariff]);

  // Live Calculation
  const calculation = useMemo<BudgetCalculationResult>(() => {
    if (!activeVehicle) {
      return {
        items: [],
        subtotalBase: 0,
        recargoCargaAmount: 0,
        recargoNocturnoAmount: 0,
        neto: 0,
        ivaRate: 0.21,
        ivaAmount: 0,
        totalWithIva: 0,
        exceedsTope: false
      };
    }

    return calculateRemolqueBudget({
      tariff: activeTariff,
      vehicleRate: activeVehicle,
      isUrbano,
      kms,
      customKmPrice,
      forceLargoRecorrido,
      desbloqueo,
      desbloqueoPrice: customDesbloqueoPrice,
      rescateMinimo,
      cantidadRescateMinimo,
      rescateMinimoPrice: customRescateMinimoPrice,
      horasTrabajo,
      horasTrabajoPrice: customHoraTrabajoPrice,
      horasEspera,
      horasEsperaPrice: customHoraEsperaPrice,
      isCargado,
      cargaPercent,
      isNocturno,
      nocturnoPercent,
      suplementosExtra,
      suplementoConcepto,
      ivaPercent: 21
    });
  }, [
    activeTariff,
    activeVehicle,
    isUrbano,
    kms,
    customKmPrice,
    forceLargoRecorrido,
    desbloqueo,
    customDesbloqueoPrice,
    rescateMinimo,
    cantidadRescateMinimo,
    customRescateMinimoPrice,
    horasTrabajo,
    customHoraTrabajoPrice,
    horasEspera,
    customHoraEsperaPrice,
    isCargado,
    cargaPercent,
    isNocturno,
    nocturnoPercent,
    suplementosExtra,
    suplementoConcepto
  ]);

  // Construct current budget object
  const currentBudgetObj: SavedBudget = useMemo(() => {
    return {
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: 'remolque',
      companyId: activeTariff.id,
      companyName: activeTariff.name,
      vehicleName: activeVehicle?.name || 'Vehículo',
      plate: plate.trim().toUpperCase(),
      expediente: expediente.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      contactPhone: contactPhone.trim(),
      clientName: clientName.trim(),
      kms,
      isUrbano,
      isCargado,
      isNocturno,
      desbloqueo,
      desbloqueoCustomPrice: customDesbloqueoPrice,
      rescateMinimo,
      rescateMinimoCustomPrice: customRescateMinimoPrice,
      horasTrabajo,
      horasEspera,
      suplementosExtra,
      suplementoConcepto,
      notes: notes.trim(),
      calculation
    };
  }, [
    activeTariff,
    activeVehicle,
    plate,
    expediente,
    origin,
    destination,
    contactPhone,
    clientName,
    kms,
    isUrbano,
    isCargado,
    isNocturno,
    desbloqueo,
    customDesbloqueoPrice,
    rescateMinimo,
    customRescateMinimoPrice,
    horasTrabajo,
    horasEspera,
    suplementosExtra,
    suplementoConcepto,
    notes,
    calculation
  ]);

  // Handlers
  const handleSaveBudget = () => {
    saveBudgetToHistory(currentBudgetObj);
    pushBudgetToCloud(currentBudgetObj);
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    onBudgetSaved();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyWhatsApp = async () => {
    const text = generateWhatsAppMessage(currentBudgetObj);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleShareWhatsApp = () => {
    openWhatsAppUrl(currentBudgetObj, contactPhone);
  };

  const handleResetForm = () => {
    setPlate('');
    setExpediente('');
    setDestination('');
    setNotes('');
    setKms(30);
    setDesbloqueo(false);
    setRescateMinimo(false);
    setCantidadRescateMinimo(0);
    setHorasTrabajo(0);
    setHorasEspera(0);
    setIsCargado(false);
    setIsNocturno(false);
    setIsUrbano(false);
    setSuplementosExtra(0);
    setSuplementoConcepto('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left / Top Form Area (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Selector de Compañía */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                1. Aseguradora / Compañía
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Tarifa: {activeTariff.effectiveDate}
                </span>
                {onOpenTariffEditor && (
                  <button
                    type="button"
                    onClick={() => onOpenTariffEditor(activeTariff.id)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition"
                    title="Editar precios de esta compañía"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Modificar Precios</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <select
                id="company-select-remolque"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value as CompanyId)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 font-bold text-sm sm:text-base rounded-xl px-3.5 py-3 pr-10 appearance-none transition cursor-pointer"
              >
                {availableTariffs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Badges / Quick select popular */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['allianz', 'axa', 'mapfre', 'race', 'asitur', 'gruas_torre_oro'].map((cId) => {
                const item = availableTariffs.find((c) => c.id === cId);
                if (!item) return null;
                const isSelected = selectedCompanyId === cId;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => setSelectedCompanyId(cId as CompanyId)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.shortName}
                  </button>
                );
              })}
            </div>

            {/* Special notes for company */}
            {activeTariff.specialNotes && activeTariff.specialNotes.length > 0 && (
              <div className="mt-3 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  {activeTariff.specialNotes.map((note, idx) => (
                    <p key={idx} className="leading-tight">{note}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Tipo de Vehículo / Tonelaje & Servicio */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              2. Vehículo / Tonelaje
            </label>

            <div className="relative mb-3">
              <select
                id="vehicle-select-remolque"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 font-bold text-sm sm:text-base rounded-xl px-3.5 py-3 pr-10 appearance-none transition cursor-pointer"
              >
                {activeTariff.vehicleRates.map((vhc) => (
                  <option key={vhc.id} value={vhc.id}>
                    {vhc.name} — (Salida: {formatCurrency(vhc.salida)} | Km: {formatCurrency(vhc.kmPrice)}/km{vhc.rescateMinimo ? ` | Rescate Mín: ${formatCurrency(vhc.rescateMinimo)}` : ''})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Service type toggle (Urbano vs Carretera) */}
            {activeVehicle?.urbano !== undefined && activeVehicle.urbano > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUrbano(false)}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    !isUrbano
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Carretera (Salida + Km)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsUrbano(true)}
                  className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    isUrbano
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Servicio Urbano ({formatCurrency(activeVehicle.urbano)})</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Kilometraje & Matrícula */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Matrícula */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Matrícula Vehículo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-blue-700 font-extrabold text-xs">🇪🇸</span>
                  </div>
                  <input
                    id="input-plate"
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="Ej: 1234-LMN / SE-1234-DP"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 font-black tracking-wider text-base uppercase transition"
                  />
                </div>
              </div>

              {/* Nº Expediente */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nº Expediente / Referencia
                </label>
                <input
                  id="input-expediente"
                  type="text"
                  value={expediente}
                  onChange={(e) => setExpediente(e.target.value)}
                  placeholder="Ej: EXP-948271"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-slate-800 font-bold text-sm transition"
                />
              </div>
            </div>

            {/* Kilómetros (Only active if not in fixed Urbano mode) */}
            {!isUrbano && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Kilómetros de recorrido
                    </label>
                    {activeVehicle?.kmPriceLargo && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Largo recorrido (&gt; {activeVehicle.kmLargoThreshold || 200} km): {formatCurrency(activeVehicle.kmPriceLargo)}/km
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {formatCurrency(
                      (kms >= (activeVehicle?.kmLargoThreshold || 200) || forceLargoRecorrido) && activeVehicle?.kmPriceLargo
                        ? activeVehicle.kmPriceLargo
                        : activeVehicle?.kmPrice || 0
                    )} / km
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="input-kms"
                    type="number"
                    min="0"
                    step="1"
                    value={kms}
                    onChange={(e) => setKms(Math.max(0, Number(e.target.value) || 0))}
                    className="w-32 px-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 font-black text-xl text-center transition"
                  />
                  <span className="text-sm font-bold text-slate-500">KM</span>

                  {/* Quick km buttons */}
                  <div className="flex flex-wrap gap-1.5 ml-auto">
                    {[10, 25, 50, 100, 200, 300].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKms((prev) => prev + k)}
                        className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      >
                        +{k}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setKms(0)}
                      className="px-2 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      0
                    </button>
                  </div>
                </div>

                {/* Long distance notification & manual toggle */}
                {activeVehicle?.kmPriceLargo && (
                  <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        kms >= (activeVehicle.kmLargoThreshold || 200) || forceLargoRecorrido ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></span>
                      <span className="text-slate-700">
                        {kms >= (activeVehicle.kmLargoThreshold || 200) ? (
                          <strong className="text-emerald-700 font-bold">
                            Tarifa Largo Recorrido aplicada automáticamente ({formatCurrency(activeVehicle.kmPriceLargo)}/km)
                          </strong>
                        ) : forceLargoRecorrido ? (
                          <strong className="text-emerald-700 font-bold">
                            Largo Recorrido forzado manualmente ({formatCurrency(activeVehicle.kmPriceLargo)}/km)
                          </strong>
                        ) : (
                          <span>Aplica tarifa estándar ({formatCurrency(activeVehicle.kmPrice)}/km) hasta {activeVehicle.kmLargoThreshold || 200} km</span>
                        )}
                      </span>
                    </div>

                    {kms < (activeVehicle.kmLargoThreshold || 200) && (
                      <label className="flex items-center gap-1.5 cursor-pointer ml-2 text-slate-600 font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={forceLargoRecorrido}
                          onChange={(e) => setForceLargoRecorrido(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Forzar Largo Recorrido</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Suplementos Clave: Desbloqueo, Horas de Trabajo, Espera, Carga, Nocturnidad */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              3. Desbloqueo, Rescate Mínimo, Tiempos y Recargos
            </label>

            {/* Desbloqueo Toggle */}
            <div
              onClick={() => setDesbloqueo(!desbloqueo)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                desbloqueo
                  ? 'bg-amber-50/70 border-amber-500 text-amber-950'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                    desbloqueo ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">Desbloqueo de Frenos / Transmisión</h4>
                  <p className="text-xs text-slate-500">
                    Tarifa estipulada:{' '}
                    {formatCurrency(customDesbloqueoPrice || activeTariff.defaultDesbloqueoPrice)}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={desbloqueo}
                onChange={() => {}}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer pointer-events-none"
              />
            </div>

            {/* Rescate Mínimo por Cantidad (Asitur 92,70 € o según vehículo) */}
            <div
              className={`p-3.5 rounded-xl border-2 transition ${
                cantidadRescateMinimo > 0
                  ? 'bg-blue-50/90 border-blue-500 shadow-sm'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      cantidadRescateMinimo > 0 ? 'bg-blue-600 text-white shadow' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        Rescate Mínimo (2 Horas Estipuladas)
                      </h4>
                      {activeTariff.id === 'asitur' && (
                        <span className="text-[10px] bg-blue-100 text-blue-900 font-black px-2 py-0.5 rounded-full border border-blue-300">
                          Asitur Oficial: 92,70 €
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Añade unidades de rescate mínimo al presupuesto (combinable con horas de M.O):
                    </p>
                  </div>
                </div>

                {/* Price per unit setting */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500">Precio / ud:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={customRescateMinimoPrice ?? activeVehicle?.rescateMinimo ?? 92.70}
                    onChange={(e) => setCustomRescateMinimoPrice(parseFloat(e.target.value) || 0)}
                    className="w-20 px-1.5 py-0.5 bg-slate-50 focus:bg-white border border-slate-300 focus:border-blue-500 rounded text-right font-black text-xs text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-700">€</span>
                </div>
              </div>

              {/* Stepper Quantity Control */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Cantidad de Rescates:</span>
                  {cantidadRescateMinimo > 0 && (
                    <span className="text-xs font-black text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                      Total: {formatCurrency(cantidadRescateMinimo * (customRescateMinimoPrice ?? activeVehicle?.rescateMinimo ?? 92.70))}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCantidadRescateMinimo(Math.max(0, cantidadRescateMinimo - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition shadow-2xs"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={cantidadRescateMinimo}
                    onChange={(e) => setCantidadRescateMinimo(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-12 h-8 text-center font-extrabold text-base bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setCantidadRescateMinimo(cantidadRescateMinimo + 1)}
                    className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black hover:bg-blue-500 flex items-center justify-center text-lg active:scale-95 transition shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Horas de Trabajo / Mano de obra & Tiempo de Espera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Horas Trabajo */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Horas de Trabajo / M.O
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {formatCurrency(customHoraTrabajoPrice || activeTariff.defaultHoraTrabajoPrice)}/h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setHorasTrabajo(Math.max(0, horasTrabajo - 0.5))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-lg text-slate-900">
                    {horasTrabajo} <span className="text-xs font-medium text-slate-500">horas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setHorasTrabajo(horasTrabajo + 0.5)}
                    className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black hover:bg-amber-400 flex items-center justify-center text-lg active:scale-95 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Horas de Espera */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Tiempo de Espera
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {formatCurrency(customHoraEsperaPrice || activeTariff.defaultHoraEsperaPrice)}/h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setHorasEspera(Math.max(0, horasEspera - 0.5))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-lg text-slate-900">
                    {horasEspera} <span className="text-xs font-medium text-slate-500">horas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setHorasEspera(horasEspera + 0.5)}
                    className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black hover:bg-amber-400 flex items-center justify-center text-lg active:scale-95 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Recargos: Carga % y Nocturnidad % */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Vehículo Cargado % */}
              <div
                onClick={() => setIsCargado(!isCargado)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                  isCargado
                    ? 'bg-amber-50/70 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-5 h-5 ${isCargado ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight">Vehículo Cargado</h4>
                    <p className="text-xs text-slate-500">
                      +{cargaPercent}% s/ suma neto base
                      {isCargado && calculation.recargoCargaAmount > 0 && (
                        <span className="font-bold text-amber-700 block">
                          (+{formatCurrency(calculation.recargoCargaAmount)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isCargado}
                  onChange={() => {}}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer pointer-events-none"
                />
              </div>

              {/* Nocturnidad / Festivo % */}
              <div
                onClick={() => setIsNocturno(!isNocturno)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                  isNocturno
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className={`w-5 h-5 ${isNocturno ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="font-extrabold text-sm leading-tight">Nocturno / Festivo</h4>
                    <p className="text-xs text-slate-500">
                      +{nocturnoPercent}% s/ total cuenta neto
                      {isNocturno && calculation.recargoNocturnoAmount > 0 && (
                        <span className="font-bold text-indigo-700 block">
                          (+{formatCurrency(calculation.recargoNocturnoAmount)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isNocturno}
                  onChange={() => {}}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer pointer-events-none"
                />
              </div>
            </div>

            {/* Suplementos Extras opcionales */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Concepto extra (Ej: Peajes, Custodia 2 días)"
                  value={suplementoConcepto}
                  onChange={(e) => setSuplementoConcepto(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg text-xs font-semibold"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="5"
                    placeholder="0,00"
                    value={suplementosExtra || ''}
                    onChange={(e) => setSuplementosExtra(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg text-xs font-bold text-right"
                  />
                  <span className="text-xs font-bold text-slate-500">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Datos Opcionales de Trayecto y Contacto */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <details className="group">
              <summary className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between cursor-pointer list-none">
                <span>4. Datos Adicionales (Origen / Destino / WhatsApp)</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Origen</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ej: Sevilla (Base)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Destino</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej: Huelva / Taller Oficial"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Teléfono Cliente / Destinatario</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ej: 612345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nombre Asegurado / Taller</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Transportes Huelva / Juan Pérez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Notas / Observaciones</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Servicio realizado con cabeza tractora y góndola especial. Vehículo averiado en arcén."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>
            </details>
          </div>

        </div>

        {/* Right Area: Presupuesto Ticket & Actions (5 cols on desktop, sticky) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 sticky top-20">
            
            {/* Header del Ticket */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Presupuesto Oficial
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white mt-1">
                  {activeTariff.shortName}
                </h3>
              </div>
              <div className="text-right">
                <span className="block text-xs font-mono font-bold text-slate-300">
                  {plate ? plate.toUpperCase() : 'SIN MATRÍCULA'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            {/* Detalle del Vehículo */}
            <div className="py-2.5 text-xs text-slate-300 border-b border-slate-800/80 flex items-center justify-between">
              <span className="font-medium text-slate-400 truncate max-w-[200px]">
                {activeVehicle?.name}
              </span>
              <span className="font-bold text-amber-400">
                {isUrbano ? 'Serv. Urbano' : `${kms} KM`}
              </span>
            </div>

            {/* Desglose de Conceptos */}
            <div className="py-3 space-y-2 text-xs border-b border-slate-800">
              {calculation.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`truncate max-w-[210px] ${item.isRecargo ? 'text-amber-300 font-semibold' : 'text-slate-300'}`}>
                    {item.concept}
                  </span>
                  <span className={`font-mono font-bold ${item.isRecargo ? 'text-amber-400' : 'text-white'}`}>
                    {item.isRecargo ? `+${formatCurrency(item.total)}` : formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales y Liquidación */}
            <div className="pt-3 space-y-1.5">
              {(calculation.recargoCargaAmount > 0 || calculation.recargoNocturnoAmount > 0) && (
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Suma Neto Base:</span>
                  <span className="font-mono font-medium text-slate-300">
                    {formatCurrency(calculation.subtotalBase)}
                  </span>
                </div>
              )}

              {calculation.recargoCargaAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span>+ Recargo Carga ({cargaPercent}%):</span>
                  <span className="font-mono font-bold">
                    +{formatCurrency(calculation.recargoCargaAmount)}
                  </span>
                </div>
              )}

              {calculation.recargoNocturnoAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-indigo-300">
                  <span>+ Nocturnidad ({nocturnoPercent}%):</span>
                  <span className="font-mono font-bold">
                    +{formatCurrency(calculation.recargoNocturnoAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                <span className="font-bold text-white">Total Neto (Base Imp.):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {formatCurrency(calculation.neto)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>IVA ({(calculation.ivaRate * 100).toFixed(0)}%):</span>
                <span className="font-mono font-bold text-slate-300">
                  {formatCurrency(calculation.ivaAmount)}
                </span>
              </div>

              {/* Total Destacado */}
              <div className="mt-3 p-3.5 bg-amber-500 rounded-xl text-slate-950 flex items-center justify-between shadow-lg shadow-amber-500/20">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
                    Total con IVA
                  </span>
                  <span className="text-xs font-bold opacity-80">
                    Neto: {formatCurrency(calculation.neto)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-2xl sm:text-3xl font-mono tracking-tight">
                    {formatCurrency(calculation.totalWithIva)}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviso de Límite / Tope si aplica */}
            {calculation.exceedsTope && calculation.topeAmount && (
              <div className="mt-3 p-2.5 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong className="font-bold">Aviso:</strong> Supera el tope habitual de cobertura de la compañía ({formatCurrency(calculation.topeAmount)} sin IVA).
                </p>
              </div>
            )}

            {/* Botones de Acción Inmediata (Compartir por WhatsApp, Guardar, Copiar, Imprimir) */}
            <div className="mt-5 space-y-2.5">
              
              {/* Botón Principal: Compartir WhatsApp */}
              <button
                id="btn-share-whatsapp"
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-black text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/40 transition cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
                <span>COMPARTIR POR WHATSAPP</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Guardar Presupuesto */}
                <button
                  id="btn-save-budget"
                  type="button"
                  onClick={handleSaveBudget}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                    savedSuccess
                      ? 'bg-emerald-700/80 text-white border-emerald-600'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>Guardar</span>
                    </>
                  )}
                </button>

                {/* Copiar Texto */}
                <button
                  id="btn-copy-budget"
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                    copied
                      ? 'bg-emerald-700/80 text-white border-emerald-600'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Imprimir / Ver Ticket */}
                <button
                  id="btn-print-budget"
                  type="button"
                  onClick={() => onViewPrintModal(currentBudgetObj)}
                  className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Ver Ticket / PDF</span>
                </button>

                {/* Limpiar Formulario */}
                <button
                  id="btn-reset-form"
                  type="button"
                  onClick={handleResetForm}
                  className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Limpiar</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
