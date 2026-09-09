import React, { useState, useEffect } from 'react';
import { SimulationParams, LoanType } from '../types';
import { calculateMortgageSimulation, formatCOP, formatPercent } from '../utils/formatters';
import { Calculator, DollarSign, Percent, TrendingUp, AlertCircle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface InvestmentSimulatorProps {
  initialPriceCop?: number;
  initialRentCop?: number;
  initialAdminCop?: number;
  onConsultAiWithSimulation: (summary: string) => void;
}

export const InvestmentSimulator: React.FC<InvestmentSimulatorProps> = ({
  initialPriceCop = 480000000,
  initialRentCop = 3200000,
  initialAdminCop = 350000,
  onConsultAiWithSimulation,
}) => {
  const [propertyPriceCop, setPropertyPriceCop] = useState<number>(initialPriceCop);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [loanType, setLoanType] = useState<LoanType>('hipotecario');
  const [interestRateEA, setInterestRateEA] = useState<number>(11.8);
  const [termYears, setTermYears] = useState<number>(20);
  const [monthlyRentalIncomeCop, setMonthlyRentalIncomeCop] = useState<number>(initialRentCop);
  const [monthlyAdminCop, setMonthlyAdminCop] = useState<number>(initialAdminCop);
  const [annualPropertyTaxCop, setAnnualPropertyTaxCop] = useState<number>(Math.round(initialPriceCop * 0.008));
  const [vacancyRatePercent, setVacancyRatePercent] = useState<number>(5);

  // Sync if initial props change
  useEffect(() => {
    if (initialPriceCop) {
      setPropertyPriceCop(initialPriceCop);
      setAnnualPropertyTaxCop(Math.round(initialPriceCop * 0.008));
    }
    if (initialRentCop) setMonthlyRentalIncomeCop(initialRentCop);
    if (initialAdminCop) setMonthlyAdminCop(initialAdminCop);
  }, [initialPriceCop, initialRentCop, initialAdminCop]);

  const params: SimulationParams = {
    propertyPriceCop,
    downPaymentPercent,
    loanType,
    interestRateEA,
    termYears,
    monthlyRentalIncomeCop,
    monthlyAdminCop,
    annualPropertyTaxCop,
    vacancyRatePercent,
  };

  const results = calculateMortgageSimulation(params);

  // Cash on cash return: (netMonthlyCashFlow * 12) / totalInvestmentFirstYear
  const cashOnCash = results.totalInvestmentFirstYearCop > 0
    ? ((results.monthlyNetCashFlowCop * 12) / results.totalInvestmentFirstYearCop) * 100
    : 0;

  // Preset quick buttons
  const setPreset = (price: number, rent: number, admin: number) => {
    setPropertyPriceCop(price);
    setMonthlyRentalIncomeCop(rent);
    setMonthlyAdminCop(admin);
    setAnnualPropertyTaxCop(Math.round(price * 0.008));
  };

  const handleAskAiAboutThis = () => {
    const summary = `He simulado una inversión inmobiliaria en Bogotá por valor de ${formatCOP(propertyPriceCop)} con cuota inicial del ${downPaymentPercent}% (${formatCOP(results.downPaymentCop)}), financiamiento ${loanType} a ${termYears} años al ${interestRateEA}% E.A. La cuota bancaria estimada es de ${formatCOP(results.monthlyBankQuotaCop)} y el arriendo proyectado es de ${formatCOP(monthlyRentalIncomeCop)}. El flujo de caja neto mensual resulta en ${formatCOP(results.monthlyNetCashFlowCop)}, con un Cap Rate Bruto de ${formatPercent(results.grossCapRate)} y Cap Rate Neto de ${formatPercent(results.netCapRate)}. ¿Qué tan atractiva y viable es esta inversión en el mercado actual de Bogotá?`;
    onConsultAiWithSimulation(summary);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Simulador Financiero & Calculadora de Inversión Inmobiliaria</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Calcule cuota bancaria, gastos notariales, flujo de caja neto (Cash Flow) y rentabilidad neta bajo parámetros financieros de Colombia.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Plantillas:</span>
            <button
              onClick={() => setPreset(320000000, 2600000, 250000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            >
              $320M Studio
            </button>
            <button
              onClick={() => setPreset(500000000, 3400000, 360000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            >
              $500M Cedritos
            </button>
            <button
              onClick={() => setPreset(880000000, 5200000, 680000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            >
              $880M Santa Bárbara
            </button>
            <button
              onClick={() => setPreset(1400000000, 8500000, 950000)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            >
              $1.400M Rosales/Chicó
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            1. Parámetros de Compra y Financiamiento Bancario
          </h3>

          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">Valor de Compra del Inmueble (COP)</label>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                {formatCOP(propertyPriceCop)}
              </span>
            </div>
            <input
              id="input-property-price"
              type="range"
              min={150000000}
              max={3000000000}
              step={10000000}
              value={propertyPriceCop}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPropertyPriceCop(val);
                setAnnualPropertyTaxCop(Math.round(val * 0.008));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$150M (Apartaestudios)</span>
              <span>$1.500M</span>
              <span>$3.000M (Ultra Prime)</span>
            </div>
          </div>

          {/* Loan Type & Down Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                Modalidad de Financiamiento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoanType('hipotecario');
                    if (downPaymentPercent < 30) setDownPaymentPercent(30);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    loanType === 'hipotecario'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  Crédito Hipotecario
                  <span className="block text-[10px] font-normal opacity-80">Hasta 70% LTV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoanType('leasing')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    loanType === 'leasing'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  Leasing Habitacional
                  <span className="block text-[10px] font-normal opacity-80">Hasta 85% LTV</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-200">Cuota Inicial (%)</label>
                <span className="text-emerald-400 font-bold font-mono">
                  {downPaymentPercent}% ({formatCOP(results.downPaymentCop, true)})
                </span>
              </div>
              <input
                id="input-down-payment"
                type="range"
                min={loanType === 'leasing' ? 15 : 30}
                max={70}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{loanType === 'leasing' ? '15% mín' : '30% mín legal'}</span>
                <span>50%</span>
                <span>70%</span>
              </div>
            </div>
          </div>

          {/* Interest Rate & Term Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-200">Tasa de Interés Anual (E.A.)</label>
                <span className="text-amber-400 font-bold font-mono">{interestRateEA}% E.A.</span>
              </div>
              <input
                id="input-interest-rate"
                type="range"
                min={9.5}
                max={15.0}
                step={0.1}
                value={interestRateEA}
                onChange={(e) => setInterestRateEA(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Promedio actual bancos Colombia: ~11.5% - 12.5% E.A.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-200">Plazo del Crédito (Años)</label>
                <span className="text-slate-200 font-bold font-mono">{termYears} años ({termYears * 12} meses)</span>
              </div>
              <input
                id="input-term-years"
                type="range"
                min={5}
                max={30}
                step={5}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5 años</span>
                <span>15 años</span>
                <span>30 años</span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 pt-2">
            2. Ingresos por Arrendamiento y Costos Operativos Mensuales
          </h3>

          {/* Monthly Rent & Administration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-200">Canon Mensual de Arriendo</label>
                <span className="text-emerald-400 font-bold font-mono">{formatCOP(monthlyRentalIncomeCop)}</span>
              </div>
              <input
                id="input-monthly-rent"
                type="range"
                min={1200000}
                max={20000000}
                step={100000}
                value={monthlyRentalIncomeCop}
                onChange={(e) => setMonthlyRentalIncomeCop(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Renta estimada mensual para este rango
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-200">Administración PH Mensual</label>
                <span className="text-slate-200 font-bold font-mono">{formatCOP(monthlyAdminCop)}</span>
              </div>
              <input
                id="input-monthly-admin"
                type="range"
                min={100000}
                max={2500000}
                step={20000}
                value={monthlyAdminCop}
                onChange={(e) => setMonthlyAdminCop(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Cuota ordinaria de copropiedad
              </span>
            </div>
          </div>

          {/* Property Tax & Vacancy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Impuesto Predial Anual Estimado (Bogotá)</span>
              <span className="font-bold text-slate-200 text-sm mt-0.5 block">
                {formatCOP(annualPropertyTaxCop)} ({formatCOP(Math.round(annualPropertyTaxCop / 12))}/mes)
              </span>
              <span className="text-[10px] text-slate-500">Aprox 0.8% del avalúo comercial</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Factor de Vacancia / Mantenimiento</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-200 text-sm">{vacancyRatePercent}% anual</span>
                <span className="text-[10px] text-slate-400">~18 días/año</span>
              </div>
              <span className="text-[10px] text-slate-500">Reserva técnica para reparaciones</span>
            </div>
          </div>
        </div>

        {/* Right Financial Results Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Dictamen de Rentabilidad</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                results.monthlyNetCashFlowCop >= 0
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
              }`}>
                {results.monthlyNetCashFlowCop >= 0 ? 'Cash Flow Positivo' : 'Inversión por Valorización'}
              </span>
            </div>

            {/* Main Monthly Cash Flow Result */}
            <div className={`p-4 rounded-xl border ${
              results.monthlyNetCashFlowCop >= 0
                ? 'bg-emerald-950/20 border-emerald-800/50'
                : 'bg-slate-900/90 border-slate-700/80'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Flujo de Caja Neto Mensual (Arriendo - Cuota banco):
                  </span>
                  <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    results.monthlyNetCashFlowCop >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {formatCOP(results.monthlyNetCashFlowCop)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {results.monthlyNetCashFlowCop >= 0
                  ? 'El arriendo cubre el 100% de la cuota bancaria y deja un excedente mensual libre.'
                  : 'El inversionista aporta una diferencia mensual para amortizar el capital y capturar la plusvalía de Bogotá.'}
              </p>
            </div>

            {/* ROI Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Cap Rate Bruto Anual</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {formatPercent(results.grossCapRate)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Canon anual / Precio</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Cap Rate Neto Anual</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  {formatPercent(results.netCapRate)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Deduciendo gastos PH e impuestos</span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
              <div className="flex justify-between text-slate-300">
                <span>Monto financiado por banco:</span>
                <span className="font-bold text-white">{formatCOP(results.loanAmountCop)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cuota bancaria mensual estimada:</span>
                <span className="font-bold text-amber-400 font-mono">{formatCOP(results.monthlyBankQuotaCop)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Renta mensual neta (post gastos):</span>
                <span className="font-bold text-emerald-300 font-mono">{formatCOP(results.netMonthlyRentCop)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Gastos de cierre (Notaría & Registro):</span>
                <span className="font-bold text-slate-300">{formatCOP(results.closingCostsCop.totalClosingCop)}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1.5 font-bold">
                <span className="text-slate-100">Desembolso total inicial (Cuota + Cierre):</span>
                <span className="text-white font-mono">{formatCOP(results.totalInvestmentFirstYearCop)}</span>
              </div>
            </div>

            {/* Colombian Legal Note */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                En Colombia, los gastos notariales (~0.54%) se dividen por mitad entre comprador y vendedor. El impuesto de beneficencia y registro (~1.67%) lo asume el comprador.
              </span>
            </div>

            {/* AI Advisor CTA with simulation data */}
            <button
              id="btn-ask-ai-simulation"
              onClick={handleAskAiAboutThis}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Consultar Viabilidad con el Asesor IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
