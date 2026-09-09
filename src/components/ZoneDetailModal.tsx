import React from 'react';
import { BogotaZone, PropertyListing } from '../types';
import { formatCOP, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { X, MapPin, TrendingUp, Percent, Clock, Bus, CheckCircle2, Calculator, Sparkles, Building2 } from 'lucide-react';

interface ZoneDetailModalProps {
  zone: BogotaZone | null;
  onClose: () => void;
  onSimulate: (zone: BogotaZone) => void;
  onAskAi: (zone: BogotaZone) => void;
  relatedProperties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
}

export const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({
  zone,
  onClose,
  onSimulate,
  onAskAi,
  relatedProperties,
  onSelectProperty,
}) => {
  if (!zone) return null;

  const badge = getEstratoBadgeStyle(zone.estrato);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
              </span>
              <span className="text-xs text-slate-400">{zone.locality} • Sector {zone.sector}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{zone.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {zone.description}
          </p>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Venta Promedio m²</span>
              <span className="text-base font-bold text-amber-400">{formatCOP(zone.avgPriceM2Sale)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Arriendo m² Estimado</span>
              <span className="text-base font-bold text-slate-200">{formatCOP(zone.avgPriceM2Rent)} /m²</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Cap Rate Bruto</span>
              <span className="text-base font-bold text-emerald-400">{formatPercent(zone.capRate)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Plusvalía Anual</span>
              <span className="text-base font-bold text-purple-400">+{formatPercent(zone.annualAppreciation)}</span>
            </div>
          </div>

          {/* Highlights & Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Atributos de Valorización</span>
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                {zone.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-emerald-400" />
                <span>Movilidad y Arrendatarios</span>
              </h4>
              <p className="text-slate-300">
                <strong className="text-slate-400">Inquilino:</strong> {zone.tenantProfile}
              </p>
              <p className="text-slate-300">
                <strong className="text-slate-400">Transporte:</strong> {zone.transportAccess}
              </p>
            </div>
          </div>

          {/* Corridors */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Corredores Viales Principales:</span>
            <div className="flex flex-wrap gap-1.5">
              {zone.keyCorridors.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 text-xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Related properties */}
          {relatedProperties.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Inmuebles representativos en esta zona</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => {
                      onClose();
                      onSelectProperty(prop);
                    }}
                    className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate">{prop.title}</h5>
                      <span className="text-xs text-amber-400 font-bold block">{formatCOP(prop.priceCop)}</span>
                      <span className="text-[10px] text-slate-400">{prop.areaM2} m² • {prop.bedrooms} hab</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              onAskAi(zone);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/60 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Consultar con IA sobre esta zona</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSimulate(zone);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <Calculator className="w-4 h-4" />
            <span>Simular Inversión en {zone.name.split('&')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
