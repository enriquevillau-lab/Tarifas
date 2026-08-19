import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Building, Phone, MapPin, Receipt, RotateCcw } from 'lucide-react';
import { CompanySettings } from '../types';
import { DEFAULT_COMPANY_SETTINGS } from '../data/tariffsData';

interface SettingsModalProps {
  settings: CompanySettings;
  onSaveSettings: (newSettings: CompanySettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setFormData(DEFAULT_COMPANY_SETTINGS);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500" />
              Configuración de la Empresa y Tickets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personaliza los datos de cabecera para los presupuestos y albaranes de impresión
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nombre Empresa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Nombre Comercial de la Empresa
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            {/* CIF / NIF */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-slate-400" />
                CIF / NIF
              </label>
              <input
                type="text"
                value={formData.cifNif}
                onChange={(e) => setFormData({ ...formData, cifNif: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Teléfono 24 Horas
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            {/* IVA por defecto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                IVA General Aplicable (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.defaultIvaPercent}
                onChange={(e) => setFormData({ ...formData, defaultIvaPercent: Number(e.target.value) || 21 })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

            {/* Dirección / Base */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Dirección Base de Grúas
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-md transition"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Guardar Configuración</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
