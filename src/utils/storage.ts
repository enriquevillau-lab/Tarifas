import { SavedBudget, CompanySettings, CompanyTariff, CompanyId } from '../types';
import { DEFAULT_COMPANY_SETTINGS, COMPANY_TARIFFS } from '../data/tariffsData';

const BUDGETS_STORAGE_KEY = 'gruas_budgets_history_v1';
const SETTINGS_STORAGE_KEY = 'gruas_settings_v1';
const TARIFFS_STORAGE_KEY = 'gruas_custom_tariffs_v2';

export function getSavedBudgets(): SavedBudget[] {
  try {
    const data = localStorage.getItem(BUDGETS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedBudget[];
  } catch (error) {
    console.error('Error reading budgets from storage:', error);
    return [];
  }
}

export function saveBudgetToHistory(budget: SavedBudget): void {
  try {
    const list = getSavedBudgets();
    const existingIndex = list.findIndex((b) => b.id === budget.id);
    if (existingIndex >= 0) {
      list[existingIndex] = budget;
    } else {
      list.unshift(budget);
    }
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Error saving budget:', error);
  }
}

export function deleteBudgetFromHistory(id: string): SavedBudget[] {
  try {
    const list = getSavedBudgets().filter((b) => b.id !== id);
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (error) {
    console.error('Error deleting budget:', error);
    return [];
  }
}

export function clearBudgetHistory(): void {
  try {
    localStorage.removeItem(BUDGETS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing budget history:', error);
  }
}

export function getCompanySettings(): CompanySettings {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!data) return DEFAULT_COMPANY_SETTINGS;
    return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_COMPANY_SETTINGS;
  }
}

export function saveCompanySettings(settings: CompanySettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/* ==========================================================================
   CUSTOM TARIFFS MANAGEMENT
   ========================================================================== */

export function getStoredCompanyTariffs(): CompanyTariff[] {
  try {
    const data = localStorage.getItem(TARIFFS_STORAGE_KEY);
    if (!data) {
      return JSON.parse(JSON.stringify(COMPANY_TARIFFS));
    }
    const saved = JSON.parse(data) as Record<string, CompanyTariff>;
    
    // Map over base tariffs to ensure all companies exist and merge any custom changes
    return COMPANY_TARIFFS.map((base) => {
      if (saved[base.id]) {
        const savedTariff = saved[base.id];
        // Ensure new vehicle and rescue fields (like rescateMinimo and urbano) are populated
        const mergedVehicleRates = savedTariff.vehicleRates.map((vr) => {
          const baseVr = base.vehicleRates.find((b) => b.id === vr.id);
          return {
            ...vr,
            rescateMinimo: vr.rescateMinimo !== undefined ? vr.rescateMinimo : baseVr?.rescateMinimo,
            minHorasRescate: vr.minHorasRescate !== undefined ? vr.minHorasRescate : baseVr?.minHorasRescate,
            urbano: vr.urbano !== undefined ? vr.urbano : baseVr?.urbano
          };
        });

        const mergedRescueRates = savedTariff.rescueRates.map((rr) => {
          const baseRr = base.rescueRates.find((b) => b.id === rr.id);
          return {
            ...rr,
            rescateMinimo: rr.rescateMinimo !== undefined ? rr.rescateMinimo : baseRr?.rescateMinimo,
            urbano: rr.urbano !== undefined ? rr.urbano : baseRr?.urbano
          };
        });

        return {
          ...savedTariff,
          vehicleRates: mergedVehicleRates,
          rescueRates: mergedRescueRates
        };
      }
      return JSON.parse(JSON.stringify(base));
    });
  } catch (error) {
    console.error('Error reading custom tariffs:', error);
    return JSON.parse(JSON.stringify(COMPANY_TARIFFS));
  }
}

export function saveStoredCompanyTariffs(tariffs: CompanyTariff[]): void {
  try {
    const dict: Record<string, CompanyTariff> = {};
    tariffs.forEach((t) => {
      dict[t.id] = t;
    });
    localStorage.setItem(TARIFFS_STORAGE_KEY, JSON.stringify(dict));
  } catch (error) {
    console.error('Error saving custom tariffs:', error);
  }
}

export function updateSingleCompanyTariff(updatedTariff: CompanyTariff): CompanyTariff[] {
  try {
    const currentList = getStoredCompanyTariffs();
    const updatedList = currentList.map((t) => (t.id === updatedTariff.id ? updatedTariff : t));
    saveStoredCompanyTariffs(updatedList);
    return updatedList;
  } catch (error) {
    console.error('Error updating company tariff:', error);
    return getStoredCompanyTariffs();
  }
}

export function resetCompanyTariff(companyId: CompanyId): CompanyTariff[] {
  try {
    const defaultTariff = COMPANY_TARIFFS.find((c) => c.id === companyId);
    if (!defaultTariff) return getStoredCompanyTariffs();
    
    const currentList = getStoredCompanyTariffs();
    const updatedList = currentList.map((t) =>
      t.id === companyId ? JSON.parse(JSON.stringify(defaultTariff)) : t
    );
    saveStoredCompanyTariffs(updatedList);
    return updatedList;
  } catch (error) {
    console.error('Error resetting company tariff:', error);
    return getStoredCompanyTariffs();
  }
}

export function resetAllCompanyTariffs(): CompanyTariff[] {
  try {
    localStorage.removeItem(TARIFFS_STORAGE_KEY);
    return JSON.parse(JSON.stringify(COMPANY_TARIFFS));
  } catch (error) {
    console.error('Error resetting all tariffs:', error);
    return JSON.parse(JSON.stringify(COMPANY_TARIFFS));
  }
}

export function isCompanyTariffCustomized(companyId: CompanyId): boolean {
  try {
    const data = localStorage.getItem(TARIFFS_STORAGE_KEY);
    if (!data) return false;
    const saved = JSON.parse(data) as Record<string, CompanyTariff>;
    if (!saved[companyId]) return false;
    
    const defaultTariff = COMPANY_TARIFFS.find((c) => c.id === companyId);
    if (!defaultTariff) return false;

    return JSON.stringify(saved[companyId]) !== JSON.stringify(defaultTariff);
  } catch {
    return false;
  }
}

