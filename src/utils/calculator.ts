import {
  CompanyTariff,
  VehicleRate,
  RescueRate,
  BudgetCalculationResult,
  BudgetCalculationItem
} from '../types';

export interface CalculateRemolqueParams {
  tariff: CompanyTariff;
  vehicleRate: VehicleRate;
  isUrbano: boolean;
  kms: number;
  customKmPrice?: number;
  forceLargoRecorrido?: boolean;
  desbloqueo: boolean;
  desbloqueoPrice?: number;
  rescateMinimo?: boolean;
  cantidadRescateMinimo?: number;
  rescateMinimoPrice?: number;
  horasTrabajo: number;
  horasTrabajoPrice?: number;
  horasEspera: number;
  horasEsperaPrice?: number;
  isCargado: boolean;
  cargaPercent?: number;
  isNocturno: boolean;
  nocturnoPercent?: number;
  suplementosExtra?: number;
  suplementoConcepto?: string;
  ivaPercent?: number;
}

export function calculateRemolqueBudget(params: CalculateRemolqueParams): BudgetCalculationResult {
  const {
    tariff,
    vehicleRate,
    isUrbano,
    kms,
    customKmPrice,
    forceLargoRecorrido,
    desbloqueo,
    desbloqueoPrice,
    rescateMinimo = false,
    cantidadRescateMinimo,
    rescateMinimoPrice,
    horasTrabajo,
    horasTrabajoPrice,
    horasEspera,
    horasEsperaPrice,
    isCargado,
    cargaPercent = tariff.defaultChargeRecargoPercent,
    isNocturno,
    nocturnoPercent = tariff.defaultNocturnoRecargoPercent,
    suplementosExtra = 0,
    suplementoConcepto,
    ivaPercent = 21
  } = params;

  const items: BudgetCalculationItem[] = [];

  // 1. Salida / Servicio Local o Urbano
  let salidaPrice = vehicleRate.salida;
  if (isUrbano && vehicleRate.urbano !== undefined && vehicleRate.urbano > 0) {
    salidaPrice = vehicleRate.urbano;
    items.push({
      concept: 'Servicio Urbano / Local',
      unitPrice: salidaPrice,
      total: salidaPrice
    });
  } else {
    items.push({
      concept: 'Salida de Grúa',
      unitPrice: salidaPrice,
      total: salidaPrice
    });
  }

  // 2. Kilómetros
  if (!isUrbano && kms > 0) {
    const threshold = vehicleRate.kmLargoThreshold || 200;
    const isLargo =
      forceLargoRecorrido === true ||
      (forceLargoRecorrido !== false && kms >= threshold && !!vehicleRate.kmPriceLargo);

    let effectiveKmPrice = vehicleRate.kmPrice;
    if (customKmPrice !== undefined && customKmPrice > 0) {
      effectiveKmPrice = customKmPrice;
    } else if (isLargo && vehicleRate.kmPriceLargo) {
      effectiveKmPrice = vehicleRate.kmPriceLargo;
    }

    const totalKm = Number((kms * effectiveKmPrice).toFixed(2));
    const conceptLabel = isLargo && vehicleRate.kmPriceLargo
      ? `Kilómetros recorridos (Largo recorrido >${threshold} km: ${kms} km)`
      : `Kilómetros recorridos (${kms} km)`;

    items.push({
      concept: conceptLabel,
      quantity: kms,
      unit: 'km',
      unitPrice: effectiveKmPrice,
      total: totalKm
    });
  }

  // 3. Desbloqueo
  if (desbloqueo) {
    const finalDesbloqueoPrice =
      desbloqueoPrice !== undefined ? desbloqueoPrice : tariff.defaultDesbloqueoPrice;
    items.push({
      concept: 'Desbloqueo de frenos / transmisión',
      unitPrice: finalDesbloqueoPrice,
      total: finalDesbloqueoPrice
    });
  }

  // 3b. Rescate Mínimo (con cantidad y precio unitario)
  const countRescateMin = cantidadRescateMinimo !== undefined ? cantidadRescateMinimo : (rescateMinimo ? 1 : 0);
  if (countRescateMin > 0) {
    const finalRescateMinPrice =
      rescateMinimoPrice !== undefined
        ? rescateMinimoPrice
        : (vehicleRate.rescateMinimo || 92.70);
    const totalRescateMin = Number((countRescateMin * finalRescateMinPrice).toFixed(2));
    items.push({
      concept: `Rescate Mínimo${tariff.id === 'asitur' ? ' Asitur' : ''} (2h estipuladas)`,
      quantity: countRescateMin,
      unit: countRescateMin === 1 ? 'servicio' : 'servicios',
      unitPrice: finalRescateMinPrice,
      total: totalRescateMin
    });
  }

  // 4. Horas de trabajo / Mano de obra
  if (horasTrabajo > 0) {
    const ratePrice =
      horasTrabajoPrice !== undefined
        ? horasTrabajoPrice
        : (vehicleRate.horaTrabajo || tariff.defaultHoraTrabajoPrice);
    const totalHoras = Number((horasTrabajo * ratePrice).toFixed(2));
    items.push({
      concept: 'Horas de trabajo / Mano de obra',
      quantity: horasTrabajo,
      unit: 'h',
      unitPrice: ratePrice,
      total: totalHoras
    });
  }

  // 5. Tiempo de espera
  if (horasEspera > 0) {
    const rateEspera =
      horasEsperaPrice !== undefined ? horasEsperaPrice : tariff.defaultHoraEsperaPrice;
    const totalEspera = Number((horasEspera * rateEspera).toFixed(2));
    items.push({
      concept: 'Tiempo de espera',
      quantity: horasEspera,
      unit: 'h',
      unitPrice: rateEspera,
      total: totalEspera
    });
  }

  // 6. Suplementos extras
  if (suplementosExtra > 0) {
    items.push({
      concept: suplementoConcepto || 'Suplementos / Peajes / Custodia',
      unitPrice: suplementosExtra,
      total: suplementosExtra
    });
  }

  // Calculate Base Subtotal (suma de todos los conceptos de servicio neto)
  const subtotalBase = Number(
    items.reduce((acc, item) => acc + item.total, 0).toFixed(2)
  );

  // 7. Recargo Carga % (se aplica al total de la suma neto base)
  let recargoCargaAmount = 0;
  if (isCargado && cargaPercent > 0) {
    recargoCargaAmount = Number(((subtotalBase * cargaPercent) / 100).toFixed(2));
    items.push({
      concept: `Recargo vehículo cargado (+${cargaPercent}%)`,
      unitPrice: recargoCargaAmount,
      total: recargoCargaAmount,
      isRecargo: true
    });
  }

  // 8. Recargo Nocturno / Festivo % (se aplica al total neto acumulado: con o sin % de carga)
  const baseForNocturno = Number((subtotalBase + recargoCargaAmount).toFixed(2));
  let recargoNocturnoAmount = 0;
  if (isNocturno && nocturnoPercent > 0) {
    recargoNocturnoAmount = Number(((baseForNocturno * nocturnoPercent) / 100).toFixed(2));
    items.push({
      concept: `Recargo nocturno / festivo (+${nocturnoPercent}%)`,
      unitPrice: recargoNocturnoAmount,
      total: recargoNocturnoAmount,
      isRecargo: true
    });
  }

  // Total Neto (Base Imponible = Subtotal base + Recargo Carga + Recargo Nocturnidad)
  const neto = Number(
    (subtotalBase + recargoCargaAmount + recargoNocturnoAmount).toFixed(2)
  );

  // IVA
  const ivaRate = ivaPercent / 100;
  const ivaAmount = Number((neto * ivaRate).toFixed(2));
  const totalWithIva = Number((neto + ivaAmount).toFixed(2));

  const exceedsTope = tariff.topeSinIva ? neto > tariff.topeSinIva : false;

  return {
    items,
    subtotalBase,
    recargoCargaAmount,
    recargoNocturnoAmount,
    neto,
    ivaRate,
    ivaAmount,
    totalWithIva,
    exceedsTope,
    topeAmount: tariff.topeSinIva
  };
}

export interface CalculateRescateParams {
  tariff: CompanyTariff;
  rescueRate: RescueRate;
  isUrbano?: boolean;
  urbanoPrice?: number;
  kms: number;
  customKmPrice?: number;
  forceLargoRecorrido?: boolean;
  salidaPrice?: number;
  rescateMinimo?: boolean;
  cantidadRescateMinimo?: number;
  rescateMinimoPrice?: number;
  horasRescate: number;
  horasRescatePrice?: number;
  horasAyudante: number;
  horasAyudantePrice?: number;
  desvolcaje: boolean;
  desvolcajePrice?: number;
  isCargado: boolean;
  cargaPercent?: number;
  isNocturno: boolean;
  nocturnoPercent?: number;
  suplementosExtra?: number;
  suplementoConcepto?: string;
  ivaPercent?: number;
}

export function calculateRescateBudget(params: CalculateRescateParams): BudgetCalculationResult {
  const {
    tariff,
    rescueRate,
    isUrbano = false,
    urbanoPrice,
    kms,
    customKmPrice,
    forceLargoRecorrido,
    salidaPrice = rescueRate.salida,
    rescateMinimo = false,
    cantidadRescateMinimo,
    rescateMinimoPrice,
    horasRescate,
    horasRescatePrice = rescueRate.horaRescate,
    horasAyudante,
    horasAyudantePrice = rescueRate.horaAyudante || tariff.defaultHoraAyudantePrice,
    desvolcaje,
    desvolcajePrice,
    isCargado,
    cargaPercent = tariff.defaultChargeRecargoPercent,
    isNocturno,
    nocturnoPercent = tariff.defaultNocturnoRecargoPercent,
    suplementosExtra = 0,
    suplementoConcepto,
    ivaPercent = 21
  } = params;

  const items: BudgetCalculationItem[] = [];

  // 1. Salida Rescate / Servicio Urbano
  if (isUrbano) {
    const finalUrbanoPrice =
      urbanoPrice !== undefined
        ? urbanoPrice
        : (rescueRate.urbano !== undefined && rescueRate.urbano > 0 ? rescueRate.urbano : salidaPrice);
    items.push({
      concept: `Servicio Urbano / Salida Local de Rescate (${rescueRate.name})`,
      unitPrice: finalUrbanoPrice,
      total: finalUrbanoPrice
    });
  } else {
    items.push({
      concept: `Salida Grúa / Rescate (${rescueRate.name})`,
      unitPrice: salidaPrice,
      total: salidaPrice
    });
  }

  // 2. Kilómetros de rescate (sólo si no es servicio urbano)
  if (!isUrbano && kms > 0) {
    const threshold = rescueRate.kmLargoThreshold || 200;
    const isLargo =
      forceLargoRecorrido === true ||
      (forceLargoRecorrido !== false && kms >= threshold && !!rescueRate.kmPriceLargo);

    let effectiveKmPrice = rescueRate.kmPrice;
    if (customKmPrice !== undefined && customKmPrice > 0) {
      effectiveKmPrice = customKmPrice;
    } else if (isLargo && rescueRate.kmPriceLargo) {
      effectiveKmPrice = rescueRate.kmPriceLargo;
    }

    const totalKm = Number((kms * effectiveKmPrice).toFixed(2));
    const conceptLabel = isLargo && rescueRate.kmPriceLargo
      ? `Kilometraje Rescate (Largo recorrido >${threshold} km: ${kms} km)`
      : `Kilometraje Rescate (${kms} km)`;

    items.push({
      concept: conceptLabel,
      quantity: kms,
      unit: 'km',
      unitPrice: effectiveKmPrice,
      total: totalKm
    });
  }

  // 2b. Rescate Mínimo (con cantidad y precio unitario, ej. Asitur 92,70 €)
  const countRescateMin = cantidadRescateMinimo !== undefined ? cantidadRescateMinimo : (rescateMinimo ? 1 : 0);
  if (countRescateMin > 0) {
    const finalRescateMinPrice =
      rescateMinimoPrice !== undefined
        ? rescateMinimoPrice
        : (rescueRate.rescateMinimo || 92.70);
    const totalRescateMin = Number((countRescateMin * finalRescateMinPrice).toFixed(2));
    items.push({
      concept: `Rescate Mínimo${tariff.id === 'asitur' ? ' Asitur' : ''} (2h estipuladas)`,
      quantity: countRescateMin,
      unit: countRescateMin === 1 ? 'servicio' : 'servicios',
      unitPrice: finalRescateMinPrice,
      total: totalRescateMin
    });
  }

  // 3. Horas de rescate (con mínimo de horas)
  if (horasRescate > 0) {
    const totalHoras = Number((horasRescate * horasRescatePrice).toFixed(2));
    const minNote =
      rescueRate.minHoras > 1 ? ` (Mínimo estipulado: ${rescueRate.minHoras}h)` : '';
    items.push({
      concept: `Horas de trabajo de rescate${minNote}`,
      quantity: horasRescate,
      unit: 'h',
      unitPrice: horasRescatePrice,
      total: totalHoras
    });
  }

  // 4. Horas de ayudante
  if (horasAyudante > 0) {
    const totalAyudante = Number((horasAyudante * horasAyudantePrice).toFixed(2));
    items.push({
      concept: 'Horas de operario ayudante',
      quantity: horasAyudante,
      unit: 'h',
      unitPrice: horasAyudantePrice,
      total: totalAyudante
    });
  }

  // 5. Desvolcaje
  if (desvolcaje) {
    const finalDesvolcajePrice =
      desvolcajePrice !== undefined
        ? desvolcajePrice
        : (rescueRate.desvolcaje || 240.4);
    items.push({
      concept: 'Servicio / suplemento de desvolcaje',
      unitPrice: finalDesvolcajePrice,
      total: finalDesvolcajePrice
    });
  }

  // 6. Suplementos extras
  if (suplementosExtra > 0) {
    items.push({
      concept: suplementoConcepto || 'Suplementos / Peajes / Custodia',
      unitPrice: suplementosExtra,
      total: suplementosExtra
    });
  }

  // Subtotal base (suma de todos los conceptos de servicio neto)
  const subtotalBase = Number(
    items.reduce((acc, item) => acc + item.total, 0).toFixed(2)
  );

  // 7. Recargo Carga % (se aplica al total de la suma neto base)
  let recargoCargaAmount = 0;
  if (isCargado && cargaPercent > 0) {
    recargoCargaAmount = Number(((subtotalBase * cargaPercent) / 100).toFixed(2));
    items.push({
      concept: `Recargo vehículo cargado (+${cargaPercent}%)`,
      unitPrice: recargoCargaAmount,
      total: recargoCargaAmount,
      isRecargo: true
    });
  }

  // 8. Recargo Nocturno / Festivo % (se aplica al total neto acumulado: con o sin % de carga)
  const baseForNocturno = Number((subtotalBase + recargoCargaAmount).toFixed(2));
  let recargoNocturnoAmount = 0;
  if (isNocturno && nocturnoPercent > 0) {
    recargoNocturnoAmount = Number(((baseForNocturno * nocturnoPercent) / 100).toFixed(2));
    items.push({
      concept: `Recargo nocturno / festivo (+${nocturnoPercent}%)`,
      unitPrice: recargoNocturnoAmount,
      total: recargoNocturnoAmount,
      isRecargo: true
    });
  }

  // Total Neto (Base Imponible = Subtotal base + Recargo Carga + Recargo Nocturnidad)
  const neto = Number(
    (subtotalBase + recargoCargaAmount + recargoNocturnoAmount).toFixed(2)
  );

  // IVA
  const ivaRate = ivaPercent / 100;
  const ivaAmount = Number((neto * ivaRate).toFixed(2));
  const totalWithIva = Number((neto + ivaAmount).toFixed(2));

  const exceedsTope = tariff.topeSinIva ? neto > tariff.topeSinIva : false;

  return {
    items,
    subtotalBase,
    recargoCargaAmount,
    recargoNocturnoAmount,
    neto,
    ivaRate,
    ivaAmount,
    totalWithIva,
    exceedsTope,
    topeAmount: tariff.topeSinIva
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
