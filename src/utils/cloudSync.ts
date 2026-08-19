import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CompanyTariff, SavedBudget, CompanyId } from '../types';
import { COMPANY_TARIFFS } from '../data/tariffsData';
import { saveStoredCompanyTariffs, getStoredCompanyTariffs } from './storage';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  lastUpdatedBy: string | null;
  error: string | null;
}

const GLOBAL_TARIFFS_DOC = 'current';

/**
 * Uploads all company tariffs to Cloud Firestore so all connected devices receive it.
 */
export async function pushTariffsToCloud(
  tariffs: CompanyTariff[],
  operatorName: string = 'Terminal Operador'
): Promise<{ success: boolean; updatedAt: string; error?: string }> {
  try {
    const timestamp = new Date().toISOString();
    const payload = {
      id: GLOBAL_TARIFFS_DOC,
      tariffsJson: JSON.stringify(tariffs),
      updatedAt: timestamp,
      updatedBy: operatorName,
      serverTime: serverTimestamp()
    };

    // 1. Update global singleton doc
    const globalRef = doc(db, 'global_tariffs', GLOBAL_TARIFFS_DOC);
    await setDoc(globalRef, payload, { merge: true });

    // 2. Also update individual company records
    const promises = tariffs.map((t) => {
      const companyRef = doc(db, 'company_tariffs', t.id);
      return setDoc(
        companyRef,
        {
          id: t.id,
          name: t.name,
          tariffData: JSON.stringify(t),
          updatedAt: timestamp,
          updatedBy: operatorName
        },
        { merge: true }
      );
    });
    await Promise.all(promises);

    // Save locally
    saveStoredCompanyTariffs(tariffs);

    return { success: true, updatedAt: timestamp };
  } catch (error: any) {
    console.error('Error pushing tariffs to Firestore:', error);
    return {
      success: false,
      updatedAt: new Date().toISOString(),
      error: error?.message || 'Error al conectar con la nube'
    };
  }
}

/**
 * Fetches latest tariffs directly from Cloud Firestore.
 */
export async function pullTariffsFromCloud(): Promise<{
  tariffs: CompanyTariff[] | null;
  updatedAt: string | null;
  updatedBy: string | null;
}> {
  try {
    const globalRef = doc(db, 'global_tariffs', GLOBAL_TARIFFS_DOC);
    const snap = await getDoc(globalRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.tariffsJson) {
        const parsed = JSON.parse(data.tariffsJson) as CompanyTariff[];
        saveStoredCompanyTariffs(parsed);
        return {
          tariffs: parsed,
          updatedAt: data.updatedAt || null,
          updatedBy: data.updatedBy || null
        };
      }
    }
    return { tariffs: null, updatedAt: null, updatedBy: null };
  } catch (error) {
    console.error('Error pulling tariffs from Firestore:', error);
    return { tariffs: null, updatedAt: null, updatedBy: null };
  }
}

/**
 * Subscribes in real-time to cloud tariff changes across all devices.
 */
export function subscribeToTariffsSync(
  onUpdate: (tariffs: CompanyTariff[], metadata: { updatedAt: string; updatedBy: string }) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const globalRef = doc(db, 'global_tariffs', GLOBAL_TARIFFS_DOC);

  return onSnapshot(
    globalRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.tariffsJson) {
          try {
            const parsed = JSON.parse(data.tariffsJson) as CompanyTariff[];
            // Save locally
            saveStoredCompanyTariffs(parsed);
            onUpdate(parsed, {
              updatedAt: data.updatedAt || new Date().toISOString(),
              updatedBy: data.updatedBy || 'Terminal Remota'
            });
          } catch (e) {
            console.error('Error parsing cloud tariffs JSON:', e);
          }
        }
      }
    },
    (err) => {
      console.warn('Tariffs subscription notice/fallback:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Sync budget to cloud history
 */
export async function pushBudgetToCloud(budget: SavedBudget): Promise<boolean> {
  try {
    const budgetRef = doc(db, 'saved_budgets', budget.id);
    await setDoc(
      budgetRef,
      {
        id: budget.id,
        createdAt: budget.createdAt,
        type: budget.type,
        companyId: budget.companyId,
        companyName: budget.companyName,
        budgetData: JSON.stringify(budget)
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error syncing budget to cloud:', error);
    return false;
  }
}
