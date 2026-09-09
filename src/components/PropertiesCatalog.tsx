import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { formatCOP, formatM2, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { Building2, Bed, Bath, Car, Calculator, Sparkles, Filter, CheckCircle2, ChevronRight, TrendingUp, ShieldCheck, Zap, RotateCcw } from 'lucide-react';

interface PropertiesCatalogProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onSimulateProperty: (property: PropertyListing) => void;
}

export const PropertiesCatalog: React.FC<PropertiesCatalogProps> = ({
  properties,
  onSelectProperty,
  onSimulateProperty,
}) => {
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [airbnbOnly, setAirbnbOnly] = useState<boolean>(false);
  const [selectedEstrato, setSelectedEstrato] = useState<string>('todos');

  // Filter
  const filtered = properties.filter((prop) => {
    if (selectedType !== 'todos' && prop.type !== selectedType) return false;
    if (selectedStatus !== 'todos' && prop.status !== selectedStatus) return false;
    if (selectedEstrato !== 'todos' && prop.estrato.toString() !== selectedEstrato) return false;
    if (airbnbOnly && !prop.airbnbFriendly) return false;
    return true;
  });

  const propertyTypes = ['todos', 'Studio / Suite', 'Apartamento', 'Casa', 'Penthouse'];
  const statuses = ['todos', 'Entrega Inmediata', 'Sobre Planos', 'Usado Remodelado', 'En Construcción'];
  const estratos = ['todos', '3', '4', '5', '6'];

  const estrato3Count = properties.filter((p) => p.estrato === 3).length;

  return (
    <section className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Oportunidades Inmobiliarias & Proyectos en Bogotá
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Catálogo de inmuebles residenciales de inversión con cálculo de canon proyectado, rentabilidad neta (Cap Rate) y beneficios tributarios por estrato.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="filter-estrato-3-quick"
              onClick={() => setSelectedEstrato(selectedEstrato === '3' ? 'todos' : '3')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                selectedEstrato === '3'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25'
                  : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/40 border-amber-600/50 hover:border-amber-400'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Ver Estrato 3 ({estrato3Count} unidades • Cap Rate 8.3% - 9.1%)</span>
              {selectedEstrato === '3' && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            <button
              id="filter-airbnb-toggle"
              onClick={() => setAirbnbOnly(!airbnbOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                airbnbOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-md shadow-rose-500/10'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Rentas Cortas (Airbnb)</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tipo:</span>
          </span>
          {propertyTypes.map((type) => (
            <button
              key={type}
              id={`filter-type-${type}`}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedType === type
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type === 'todos' ? 'Todos los tipos' : type}
            </button>
          ))}

          <span className="text-slate-400 ml-2">Estado:</span>
          {statuses.map((status) => (
            <button
              key={status}
              id={`filter-status-${status}`}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status === 'todos' ? 'Todos' : status}
            </button>
          ))}

          <span className="text-slate-400 ml-2">Estrato:</span>
          {estratos.map((estrato) => (
            <button
              key={estrato}
              id={`filter-property-estrato-${estrato}`}
              onClick={() => setSelectedEstrato(estrato)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedEstrato === estrato
                  ? estrato === '3'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {estrato === 'todos' ? 'Todos' : `Estrato ${estrato}`}
            </button>
          ))}

          {(selectedType !== 'todos' || selectedStatus !== 'todos' || selectedEstrato !== 'todos' || airbnbOnly) && (
            <button
              onClick={() => {
                setSelectedType('todos');
                setSelectedStatus('todos');
                setSelectedEstrato('todos');
                setAirbnbOnly(false);
              }}
              className="ml-auto text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 underline transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Estrato 3 Intelligence & Investment Rationale Banner */}
      {selectedEstrato === '3' && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-200 flex items-center gap-2">
                    <span>Tesis de Inversión: Inmuebles en Estrato 3 de Bogotá</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold">
                      Cap Rate 8.3% - 9.1%
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    El estrato con mayor equilibrio financiero: menor valor de entrada, demanda permanente y cero sobretasa en servicios.
                  </p>
                </div>
              </div>

              <div className="text-xs text-amber-300/90 font-medium bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-700/50 self-start sm:self-auto">
                {filtered.length} {filtered.length === 1 ? 'inmueble encontrado' : 'inmuebles encontrados'} en Estrato 3
              </div>
            </div>

            {/* 4 Pillars of Estrato 3 Investing in Bogota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sin Sobretasa de Servicios</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Bajo la Ley 142 de 1994, el estrato 3 no paga el recargo de solidaridad del 20% que grava a estratos 5 y 6, reduciendo los costos fijos.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cap Rate Récord</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Retorno promedio del 8.5% anual frente al 6.1% en estrato 6. Con un canon de $1.6M sobre $225M se optimiza el flujo de caja neto.
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vacancia &lt; 25 Días</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  El 35% de los hogares de Bogotá demanda estrato 3. Alta rotación con pólizas de arrendamiento aprobadas (Sura, Libertador).
                </p>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold mb-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Metro & Regiotram</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Kennedy (Línea 1 Metro), Suba (Línea 2) y Fontibón (Regiotram / Calle 13) concentran la mayor plusvalía proyectada de la década.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-200">No se encontraron inmuebles con estos filtros</h3>
            <p className="text-xs text-slate-400 mt-1">
              Pruebe ajustando el tipo de inmueble, estado o estrato seleccionado.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedType('todos');
              setSelectedStatus('todos');
              setSelectedEstrato('todos');
              setAirbnbOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((prop) => {
            const badge = getEstratoBadgeStyle(prop.estrato);
            const expectedCapRate = prop.priceCop > 0 ? ((prop.estimatedMonthlyRentCop * 12) / prop.priceCop) * 100 : 0;
            const isEstrato3 = prop.estrato === 3;

            return (
              <div
                key={prop.id}
                id={`property-card-${prop.id}`}
                className={`bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between group shadow-lg shadow-black/20 ${
                  isEstrato3
                    ? 'border-amber-500/30 hover:border-amber-400/80 hover:shadow-amber-500/10'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Overlays */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
                        Estrato {prop.estrato}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md">
                        {prop.status}
                      </span>
                      {isEstrato3 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 shadow-md">
                          Cap Rate {expectedCapRate.toFixed(1)}%
                        </span>
                      )}
                    </div>

                    {prop.airbnbFriendly && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/90 text-white shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Rentas Cortas OK</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Image Price Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Valor Inmueble</span>
                        <span className="text-xl font-black text-white tracking-tight drop-shadow-md">
                          {formatCOP(prop.priceCop)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          Cap Rate ~{formatPercent(expectedCapRate)}
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {formatCOP(prop.pricePerM2)}/m²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-semibold">{prop.zoneName}</span>
                        <span className="text-[11px] text-slate-400">{prop.locality}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 leading-snug">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{prop.addressApprox}</p>
                    </div>

                    {/* Property Specs Pill Row */}
                    <div className="grid grid-cols-4 gap-1.5 py-2 border-y border-slate-800 text-slate-300 text-xs">
                      <div className="flex flex-col items-center justify-center p-1 bg-slate-950/60 rounded-lg">
                        <span className="text-slate-400 text-[10px]">Área</span>
                        <span className="font-bold">{formatM2(prop.areaM2)}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1 bg-slate-950/60 rounded-lg">
                        <span className="text-slate-400 text-[10px] flex items-center gap-0.5"><Bed className="w-2.5 h-2.5" /> Hab</span>
                        <span className="font-bold">{prop.bedrooms}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1 bg-slate-950/60 rounded-lg">
                        <span className="text-slate-400 text-[10px] flex items-center gap-0.5"><Bath className="w-2.5 h-2.5" /> Baños</span>
                        <span className="font-bold">{prop.bathrooms}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1 bg-slate-950/60 rounded-lg">
                        <span className="text-slate-400 text-[10px] flex items-center gap-0.5"><Car className="w-2.5 h-2.5" /> Pq</span>
                        <span className="font-bold">{prop.parkingSpots}</span>
                      </div>
                    </div>

                    {/* Cash Flow Forecast Row */}
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Canon estimado arriendo:</span>
                        <span className="font-bold text-emerald-400">{formatCOP(prop.estimatedMonthlyRentCop)} /mes</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Administración:</span>
                        <span className="font-medium text-slate-300">
                          {prop.monthlyAdminCop === 0 ? 'Sin admin ($0)' : `${formatCOP(prop.monthlyAdminCop)} /mes`}
                        </span>
                      </div>
                    </div>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-1">
                      {prop.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    id={`btn-view-prop-${prop.id}`}
                    onClick={() => onSelectProperty(prop)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ficha Técnica</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-simulate-prop-${prop.id}`}
                    onClick={() => onSimulateProperty(prop)}
                    className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Simular ROI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
