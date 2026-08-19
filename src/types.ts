export type ServiceCategory = 'remolque' | 'rescate';

export type CompanyId =
  | 'allianz'
  | 'axa'
  | 'mapfre'
  | 'arag'
  | 'race'
  | 'asitur'
  | 'europ'
  | 'interpartner'
  | 'ima'
  | 'racc'
  | 'aide'
  | 'avinatan'
  | 'servireac'
  | 'gruas_torre_oro'
  | 'veinsur'
  | 'ada';

export interface VehicleRate {
  id: string;
  name: string;
  salida: number;
  kmPrice: number;
  kmPriceLargo?: number; // For >200km or >250km / >300km
  kmLargoThreshold?: number; // Default 200km
  urbano?: number;
  horaTrabajo?: number;
  horaAyudante?: number;
  desvolcaje?: number;
  minHorasRescate?: number;
  rescateMinimo?: number;
}

export interface RescueRate {
  id: string;
  name: string;
  salida: number;
  urbano?: number;
  kmPrice: number;
  kmPriceLargo?: number;
  kmLargoThreshold?: number; // Default 200km
  horaRescate: number;
  minHoras: number;
  horaAyudante?: number;
  desvolcaje?: number;
  rescateMinimo?: number;
}

export interface CompanyTariff {
  id: CompanyId;
  name: string;
  shortName: string;
  color: string;
  logoBadge: string;
  tagline: string;
  effectiveDate: string;
  defaultChargeRecargoPercent: number; // e.g. 20 or 25
  defaultNocturnoRecargoPercent: number; // e.g. 40 or 50
  cubreCarga: boolean;
  pagaDesbloqueo: boolean;
  defaultDesbloqueoPrice: number;
  defaultHoraEsperaPrice: number;
  defaultHoraTrabajoPrice: number;
  defaultHoraAyudantePrice: number;
  topeSinIva?: number;
  specialNotes?: string[];
  vehicleRates: VehicleRate[];
  rescueRates: RescueRate[];
}

export interface BudgetCalculationItem {
  concept: string;
  quantity?: number;
  unit?: string;
  unitPrice: number;
  total: number;
  isRecargo?: boolean;
}

export interface BudgetCalculationResult {
  items: BudgetCalculationItem[];
  subtotalBase: number;
  recargoCargaAmount: number;
  recargoNocturnoAmount: number;
  neto: number; // Base Imponible
  ivaRate: number; // e.g., 0.21
  ivaAmount: number;
  totalWithIva: number;
  exceedsTope: boolean;
  topeAmount?: number;
}

export interface SavedBudget {
  id: string;
  createdAt: string;
  type: ServiceCategory;
  companyId: CompanyId;
  companyName: string;
  vehicleName: string;
  plate: string;
  expediente?: string;
  origin?: string;
  destination?: string;
  contactPhone?: string;
  clientName?: string;
  kms: number;
  isUrbano: boolean;
  isCargado: boolean;
  isNocturno: boolean;
  desbloqueo: boolean;
  desbloqueoCustomPrice?: number;
  rescateMinimo?: boolean;
  rescateMinimoCustomPrice?: number;
  horasTrabajo: number;
  horasEspera: number;
  horasRescate?: number;
  horasAyudante?: number;
  desvolcaje?: boolean;
  desvolcajeCustomPrice?: number;
  suplementosExtra?: number;
  suplementoConcepto?: string;
  notes?: string;
  calculation: BudgetCalculationResult;
}

export interface CompanySettings {
  companyName: string;
  cifNif: string;
  phone: string;
  address: string;
  whatsappMessageHeader: string;
  defaultIvaPercent: number;
}
