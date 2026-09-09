import React from 'react';
import { PropertyListing } from '../types';
import { formatCOP, formatM2, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { X, Bed, Bath, Car, Sparkles, Calculator, Check, MapPin, Building2, ShieldCheck } from 'lucide-react';

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  onClose: () => void;
  onSimulate: (property: PropertyListing) => void;
  onAskAi: (property: PropertyListing) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onSimulate,
  onAskAi,
}) => {
  if (!property) return null;

  const badge = getEstratoBadgeStyle(property.estrato);
  const capRate = property.priceCop > 0 ? ((property.estimatedMonthlyRentCop * 12) / property.priceCop) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header with image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
              Estrato {property.estrato}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-100 border border-slate-700 backdrop-blur-md">
              {property.status} {property.deliveryYear ? `(${property.deliveryYear})` : ''}
            </span>
            {property.airbnbFriendly && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rentas Cortas Habilitadas</span>
              </span>
            )}
          </div>

          {/* Title & Price on bottom image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs text-amber-300 font-semibold">{property.zoneName} • {property.locality}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{property.title}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{property.addressApprox}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 block">Precio de Venta</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                {formatCOP(property.priceCop)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Key Specs Row */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Área Privada</span>
              <span className="text-base font-bold text-white">{formatM2(property.areaM2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Habitaciones</span>
              <span className="text-base font-bold text-white">{property.bedrooms}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Baños</span>
              <span className="text-base font-bold text-white">{property.bathrooms}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Parqueaderos</span>
              <span className="text-base font-bold text-white">{property.parkingSpots}</span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">
                Análisis Financiero de la Propiedad
              </h3>
              {property.estrato === 3 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Beneficio Tributario Estrato 3
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Precio por m²</span>
                <span className="font-bold text-slate-200">{formatCOP(property.pricePerM2)}/m²</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Canon mensual proyectado</span>
                <span className="font-bold text-emerald-400">{formatCOP(property.estimatedMonthlyRentCop)} /mes</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Cap Rate Bruto</span>
                <span className="font-bold text-emerald-400">{formatPercent(capRate)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Administración PH</span>
                <span className="font-bold text-slate-300">
                  {property.monthlyAdminCop === 0 ? 'Sin cuota ($0)' : `${formatCOP(property.monthlyAdminCop)} /mes`}
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Impuesto Predial Anual est.</span>
                <span className="font-bold text-slate-300">{formatCOP(Math.round(property.priceCop * 0.008))} /año</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gastos de Cierre Notariales est.</span>
                <span className="font-bold text-slate-300">{formatCOP(Math.round(property.priceCop * 0.028))}</span>
              </div>
            </div>

            {property.estrato === 3 && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2 mt-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-semibold block">Ventaja Inversionista en Estrato 3:</strong>
                  Este inmueble no paga el recargo del 20% de contribución de solidaridad en servicios públicos (Ley 142 de 1994). Adicionalmente, cuenta con una de las rotaciones de arriendo más veloces de Bogotá con menor costo de vacancia.
                </div>
              </div>
            )}
          </div>

          {/* Features and Amenities */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
              Amenidades y Características
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {property.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              onAskAi(property);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/60 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Consultar Viabilidad con IA</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSimulate(property);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <Calculator className="w-4 h-4" />
            <span>Simular Inversión con este Inmueble</span>
          </button>
        </div>
      </div>
    </div>
  );
};
