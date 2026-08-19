import { SavedBudget } from '../types';
import { formatCurrency } from './calculator';

export function generateWhatsAppMessage(budget: SavedBudget): string {
  const isRescate = budget.type === 'rescate';
  const lines: string[] = [];

  lines.push('🚨 *PRESUPUESTO OFICIAL - ASISTENCIA Y RESCATE*');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`📋 *Tipo:* ${isRescate ? '🏗️ RESCATE / GRÚA PLUMA' : '🚛 ASISTENCIA / REMOLQUE'}`);
  lines.push(`🏢 *Compañía / Tarifa:* ${budget.companyName}`);
  
  if (budget.plate) {
    lines.push(`🚗 *Matrícula:* ${budget.plate.toUpperCase()}`);
  }
  
  lines.push(`🚛 *Vehículo / Tonelaje:* ${budget.vehicleName}`);
  
  if (budget.expediente) {
    lines.push(`📑 *Nº Expediente:* ${budget.expediente}`);
  }
  
  if (budget.origin || budget.destination) {
    const route = [budget.origin, budget.destination].filter(Boolean).join(' ➡️ ');
    lines.push(`📍 *Trayecto:* ${route}`);
  }

  lines.push('');
  lines.push('🧾 *DESGLOSE DE CONCEPTOS:*');
  lines.push('───────────────────────');

  budget.calculation.items.forEach((item) => {
    if (item.isRecargo) {
      lines.push(`▪️ ${item.concept}: *+${formatCurrency(item.total)}*`);
    } else if (item.quantity && item.unit) {
      lines.push(
        `▪️ ${item.concept} (${item.quantity} ${item.unit} x ${formatCurrency(item.unitPrice)}): *${formatCurrency(item.total)}*`
      );
    } else {
      lines.push(`▪️ ${item.concept}: *${formatCurrency(item.total)}*`);
    }
  });

  lines.push('───────────────────────');
  if (budget.calculation.recargoCargaAmount > 0 || budget.calculation.recargoNocturnoAmount > 0) {
    lines.push(`🔹 *Suma Neto Base:* ${formatCurrency(budget.calculation.subtotalBase)}`);
  }
  lines.push(`💶 *TOTAL NETO (Base Imp.):* *${formatCurrency(budget.calculation.neto)}*`);
  lines.push(
    `📊 *IVA (${(budget.calculation.ivaRate * 100).toFixed(0)}%):* *${formatCurrency(budget.calculation.ivaAmount)}*`
  );
  lines.push(`💰 *TOTAL CON IVA:* *${formatCurrency(budget.calculation.totalWithIva)}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━');

  if (budget.calculation.exceedsTope && budget.calculation.topeAmount) {
    lines.push(
      `⚠️ *Aviso Tope Compañía:* Supera el límite de ${formatCurrency(budget.calculation.topeAmount)} sin IVA.`
    );
  }

  if (budget.notes) {
    lines.push('');
    lines.push(`📝 *Observaciones:* ${budget.notes}`);
  }

  if (budget.clientName) {
    lines.push(`👤 *Contacto:* ${budget.clientName}`);
  }

  lines.push('');
  lines.push(`📅 *Fecha:* ${new Date(budget.createdAt).toLocaleString('es-ES')}`);
  lines.push('_Presupuesto generado con Grúas Torre del Oro_');

  return lines.join('\n');
}

export function openWhatsAppUrl(budget: SavedBudget, targetPhone?: string): void {
  const message = generateWhatsAppMessage(budget);
  const encodedText = encodeURIComponent(message);
  
  let cleanPhone = targetPhone ? targetPhone.replace(/\D/g, '') : '';
  if (cleanPhone && !cleanPhone.startsWith('34') && cleanPhone.length === 9) {
    cleanPhone = `34${cleanPhone}`;
  }

  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(url, '_blank');
}
