import { SimulationParams, SimulationResult } from '../types';

/**
 * Format a number as Colombian Pesos (COP)
 */
export function formatCOP(value: number, abbreviate: boolean = false): string {
  if (isNaN(value)) return '$0 COP';

  if (abbreviate) {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2).replace('.', ',')} mil millones`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(0)}M COP`;
    }
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format m² value
 */
export function formatM2(value: number): string {
  return `${value.toLocaleString('es-CO')} m²`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Return color scheme for Colombian Estrato (3 to 6)
 */
export function getEstratoBadgeStyle(estrato: number): { bg: string; text: string; border: string; label: string } {
  switch (estrato) {
    case 6:
      return {
        bg: 'bg-purple-950/40',
        text: 'text-purple-300',
        border: 'border-purple-800/60',
        label: 'Estrato 6 (Alto / Prime)',
      };
    case 5:
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-800/60',
        label: 'Estrato 5 (Medio-Alto)',
      };
    case 4:
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-300',
        border: 'border-blue-800/60',
        label: 'Estrato 4 (Medio)',
      };
    case 3:
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-800/60',
        label: 'Estrato 3 (Medio-Bajo)',
      };
    default:
      return {
        bg: 'bg-slate-800',
        text: 'text-slate-300',
        border: 'border-slate-700',
        label: `Estrato ${estrato}`,
      };
  }
}

/**
 * Calculate Colombian Real Estate Mortgage / Leasing Financials
 */
export function calculateMortgageSimulation(params: SimulationParams): SimulationResult {
  const {
    propertyPriceCop,
    downPaymentPercent,
    interestRateEA,
    termYears,
    monthlyRentalIncomeCop,
    monthlyAdminCop,
    annualPropertyTaxCop,
    vacancyRatePercent,
  } = params;

  const downPaymentCop = propertyPriceCop * (downPaymentPercent / 100);
  const loanAmountCop = propertyPriceCop - downPaymentCop;

  // Convert Effective Annual (E.A.) to Nominal Monthly Rate: i_m = (1 + EA)^(1/12) - 1
  const annualDecimal = interestRateEA / 100;
  const monthlyRate = Math.pow(1 + annualDecimal, 1 / 12) - 1;
  const totalMonths = termYears * 12;

  let monthlyBankQuotaCop = 0;
  if (loanAmountCop > 0 && monthlyRate > 0) {
    monthlyBankQuotaCop =
      (loanAmountCop * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // Closing costs in Colombia:
  // Notaría: ~0.54% total (comprador asume ~0.27%)
  // Registro e impuesto de beneficencia: ~1.67% total
  // Gastos de hipoteca o leasing (estudio de títulos, avalúo, derechos): ~0.8%
  const notaryCop = propertyPriceCop * 0.003;
  const registryCop = propertyPriceCop * 0.0167;
  const beneficenciaCop = propertyPriceCop * 0.008;
  const totalClosingCop = notaryCop + registryCop + beneficenciaCop;

  // Rental income calculations
  const vacancyDeduction = monthlyRentalIncomeCop * (vacancyRatePercent / 100);
  const monthlyPropertyTax = annualPropertyTaxCop / 12;

  // Monthly operating expenses for landlord
  const totalMonthlyExpensesCop = monthlyAdminCop + monthlyPropertyTax + vacancyDeduction;
  const netMonthlyRentCop = monthlyRentalIncomeCop - totalMonthlyExpensesCop;

  // Cash flow after paying the bank loan quota
  const monthlyNetCashFlowCop = netMonthlyRentCop - monthlyBankQuotaCop;

  // Cap Rates (Cap Rate Bruto = (Renta bruta anual) / Valor Inmueble)
  const grossCapRate = propertyPriceCop > 0 ? ((monthlyRentalIncomeCop * 12) / propertyPriceCop) * 100 : 0;
  const netCapRate = propertyPriceCop > 0 ? ((netMonthlyRentCop * 12) / propertyPriceCop) * 100 : 0;

  const totalInvestmentFirstYearCop = downPaymentCop + totalClosingCop;

  return {
    downPaymentCop,
    loanAmountCop,
    monthlyBankQuotaCop,
    closingCostsCop: {
      notaryCop,
      registryCop,
      beneficenciaCop,
      totalClosingCop,
    },
    totalMonthlyExpensesCop,
    netMonthlyRentCop,
    monthlyNetCashFlowCop,
    grossCapRate,
    netCapRate,
    totalInvestmentFirstYearCop,
  };
}
