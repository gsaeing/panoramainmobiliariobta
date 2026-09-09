import React, { useState } from 'react';
import { BogotaZone } from '../types';
import { formatCOP, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { Building, TrendingUp, Percent, Filter, Compass, ArrowUpDown, ChevronRight, PlusCircle, Check } from 'lucide-react';

interface ZonesExplorerProps {
  zones: BogotaZone[];
  onSelectZone: (zone: BogotaZone) => void;
  onOpenSimulatorWithZone: (zone: BogotaZone) => void;
  onAddToCompare: (zone: BogotaZone) => void;
  comparedZoneIds: string[];
}

export const ZonesExplorer: React.FC<ZonesExplorerProps> = ({
  zones,
  onSelectZone,
  onOpenSimulatorWithZone,
  onAddToCompare,
  comparedZoneIds,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('todos');
  const [selectedEstrato, setSelectedEstrato] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'capRate' | 'priceAsc' | 'priceDesc' | 'appreciation'>('capRate');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter zones
  const filteredZones = zones.filter((zone) => {
    if (selectedSector !== 'todos' && zone.sector !== selectedSector) return false;
    if (selectedEstrato !== 'todos' && zone.estrato.toString() !== selectedEstrato) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = zone.name.toLowerCase().includes(q);
      const matchLocality = zone.locality.toLowerCase().includes(q);
      const matchCorridors = zone.keyCorridors.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchLocality && !matchCorridors) return false;
    }
    return true;
  });

  // Sort zones
  const sortedZones = [...filteredZones].sort((a, b) => {
    if (sortBy === 'capRate') return b.capRate - a.capRate;
    if (sortBy === 'appreciation') return b.annualAppreciation - a.annualAppreciation;
    if (sortBy === 'priceAsc') return a.avgPriceM2Sale - b.avgPriceM2Sale;
    if (sortBy === 'priceDesc') return b.avgPriceM2Sale - a.avgPriceM2Sale;
    return 0;
  });

  const sectors = ['todos', 'Norte', 'Centro-Oriente', 'Occidente', 'Noroccidente'];
  const estratos = ['todos', '3', '4', '5', '6'];

  return (
    <section className="space-y-5">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Explorador de Localidades y Corredores Inmobiliarios</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare precios m² de venta y arriendo, rentabilidad neta esperada y estratos en Bogotá.
            </p>
          </div>

          {/* Search input */}
          <div className="w-full md:w-72">
            <input
              id="search-zones-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar barrio, localidad o avenida..."
              className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Sector:</span>
            </span>
            {sectors.map((sector) => (
              <button
                key={sector}
                id={`filter-sector-${sector}`}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedSector === sector
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sector === 'todos' ? 'Todos los sectores' : sector}
              </button>
            ))}

            <span className="text-xs text-slate-400 ml-2">Estrato:</span>
            {estratos.map((estrato) => (
              <button
                key={estrato}
                id={`filter-estrato-${estrato}`}
                onClick={() => setSelectedEstrato(estrato)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedEstrato === estrato
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {estrato === 'todos' ? 'Todos' : `Estrato ${estrato}`}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Ordenar:</span>
            </span>
            <select
              id="select-sort-zones"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="capRate">Mayor Rentabilidad (Cap Rate)</option>
              <option value="appreciation">Mayor Plusvalía Anual</option>
              <option value="priceDesc">Precio m²: Mayor a menor</option>
              <option value="priceAsc">Precio m²: Menor a mayor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedZones.map((zone) => {
          const badge = getEstratoBadgeStyle(zone.estrato);
          const isCompared = comparedZoneIds.includes(zone.id);

          return (
            <div
              key={zone.id}
              id={`zone-card-${zone.id}`}
              className="bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 p-5 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{zone.locality} • {zone.sector}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {zone.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Cap Rate Bruto</span>
                    <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
                      {formatPercent(zone.capRate)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {zone.description}
                </p>

                {/* Key Metrics Box */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Venta m² Promedio</span>
                    <span className="font-bold text-amber-400 text-xs sm:text-sm">
                      {formatCOP(zone.avgPriceM2Sale)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Arriendo m² Estimado</span>
                    <span className="font-bold text-slate-200 text-xs sm:text-sm">
                      {formatCOP(zone.avgPriceM2Rent)} /mes
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Apreciación Anual</span>
                    <span className="font-bold text-purple-300 text-xs">
                      +{formatPercent(zone.annualAppreciation)} a/a
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Oferta Activa Censada</span>
                    <span className="font-bold text-blue-300 text-xs">
                      {zone.activeOfferUnits.toLocaleString('es-CO')} unid.
                    </span>
                  </div>
                </div>

                {/* Main Corridors */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {zone.keyCorridors.slice(0, 3).map((corridor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {corridor}
                    </span>
                  ))}
                  {zone.keyCorridors.length > 3 && (
                    <span className="px-1.5 py-0.5 text-slate-500">
                      +{zone.keyCorridors.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  id={`btn-inspect-zone-${zone.id}`}
                  onClick={() => onSelectZone(zone)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Ficha Zona</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-compare-${zone.id}`}
                    onClick={() => onAddToCompare(zone)}
                    className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                    title={isCompared ? 'En comparador' : 'Agregar al comparador'}
                  >
                    {isCompared ? <Check className="w-4 h-4 text-amber-400" /> : <PlusCircle className="w-4 h-4" />}
                  </button>

                  <button
                    id={`btn-simulate-zone-${zone.id}`}
                    onClick={() => onOpenSimulatorWithZone(zone)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Simular ROI
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
