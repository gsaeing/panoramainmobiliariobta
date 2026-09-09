import React from 'react';
import { BOGOTA_MARKET_INDICATORS } from '../data/bogotaData';
import { TrendingUp, Percent, Clock, Building2, ArrowUpRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

interface MarketOverviewProps {
  onSelectMetric?: (metricId: string) => void;
  onExploreZones: () => void;
  onOpenSimulator: () => void;
  onOpenAiAdvisor: () => void;
  onNavigateToNorth?: () => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  onExploreZones,
  onOpenSimulator,
  onOpenAiAdvisor,
  onNavigateToNorth,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'Percent':
        return <Percent className="w-5 h-5 text-emerald-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Hero Banner with Executive Market Brief */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#121927] p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mercado Inmobiliario Bogotá • Reporte Trimestral Q3</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Panorama y Rentabilidad Inmobiliaria en <span className="text-amber-400">Bogotá D.C.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Monitor integral de precios por m², estratificación socioeconómica (3 a 6), tasas de retorno bruto (Cap Rate), plusvalía por infraestructura y modelos financieros de inversión en las principales localidades de la capital.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-explore-zones"
              onClick={onExploreZones}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Zonas</span>
            </button>

            {onNavigateToNorth && (
              <button
                id="btn-hero-north"
                onClick={onNavigateToNorth}
                className="px-4 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/50 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Especialidad Norte de Bogotá</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </button>
            )}

            <button
              id="btn-quick-simulator"
              onClick={onOpenSimulator}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Simulador ROI</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              id="btn-hero-ai"
              onClick={onOpenAiAdvisor}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Consultar Asesor IA</span>
            </button>
          </div>
        </div>

        {/* Real Estate Market Highlights Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tope Reajuste Arriendo (IPC)</span>
            <span className="text-slate-100 font-bold text-sm">Ley 820 de 2003</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tasa Crédito Hipotecario E.A.</span>
            <span className="text-emerald-400 font-bold text-sm">11.5% - 13.0%</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Impacto Línea 1 Metro</span>
            <span className="text-amber-400 font-bold text-sm">+12.8% plusvalía est.</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Mayor Retorno por Renta</span>
            <span className="text-purple-300 font-bold text-sm">Chapinero & Centro (8.8%)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BOGOTA_MARKET_INDICATORS.map((indicator) => (
          <div
            key={indicator.id}
            id={`indicator-${indicator.id}`}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700/60">
                {getIcon(indicator.iconName)}
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  indicator.isPositive
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                    : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                }`}
              >
                {indicator.change}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">{indicator.title}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-white tracking-tight">{indicator.value}</span>
                {indicator.unit && (
                  <span className="text-xs text-slate-400 font-medium">{indicator.unit}</span>
                )}
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 leading-normal border-t border-slate-800/60 pt-2.5">
              {indicator.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
