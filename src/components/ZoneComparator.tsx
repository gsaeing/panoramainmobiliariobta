import React, { useState } from 'react';
import { BogotaZone } from '../types';
import { formatCOP, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { Scale, Plus, X, ArrowRight, CheckCircle2, TrendingUp, Compass } from 'lucide-react';

interface ZoneComparatorProps {
  zones: BogotaZone[];
  comparedZoneIds: string[];
  onRemoveZone: (zoneId: string) => void;
  onAddZone: (zone: BogotaZone) => void;
  onSelectZone: (zone: BogotaZone) => void;
  onOpenSimulatorWithZone: (zone: BogotaZone) => void;
}

export const ZoneComparator: React.FC<ZoneComparatorProps> = ({
  zones,
  comparedZoneIds,
  onRemoveZone,
  onAddZone,
  onSelectZone,
  onOpenSimulatorWithZone,
}) => {
  const [selectedZoneToAdd, setSelectedZoneToAdd] = useState<string>('');

  // Get active compared zones
  const activeZones = zones.filter((z) => comparedZoneIds.includes(z.id));
  const availableToAdd = zones.filter((z) => !comparedZoneIds.includes(z.id));

  const handleAdd = () => {
    if (!selectedZoneToAdd) return;
    const zone = zones.find((z) => z.id === selectedZoneToAdd);
    if (zone) {
      onAddZone(zone);
      setSelectedZoneToAdd('');
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Comparador Multizona de Bogotá</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Contraste métricas de valorización, precios por m², estratos y rentabilidad neta entre hasta 3 sectores de la ciudad.
            </p>
          </div>

          {/* Add Zone Selector */}
          {activeZones.length < 4 && availableToAdd.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                id="select-add-zone-compare"
                value={selectedZoneToAdd}
                onChange={(e) => setSelectedZoneToAdd(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="">+ Agregar zona a la tabla...</option>
                {availableToAdd.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} (E{z.estrato} - {z.locality})
                  </option>
                ))}
              </select>
              <button
                id="btn-confirm-add-zone"
                onClick={handleAdd}
                disabled={!selectedZoneToAdd}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>

      {activeZones.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No hay zonas seleccionadas para comparar</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Seleccione zonas desde el explorador o use el menú superior para contrastar barrios de Bogotá.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            {zones.slice(0, 3).map((z) => (
              <button
                key={z.id}
                onClick={() => onAddZone(z)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                + {z.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Comparison Table / Cards */
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-[700px]">
            {activeZones.map((zone) => {
              const badge = getEstratoBadgeStyle(zone.estrato);

              return (
                <div
                  key={zone.id}
                  id={`compare-column-${zone.id}`}
                  className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Zone Head with Close Button */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{zone.name}</h3>
                        <span className="text-xs text-slate-400">{zone.locality} • Sector {zone.sector}</span>
                      </div>

                      <button
                        onClick={() => onRemoveZone(zone.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Quitar de la comparativa"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metric 1: Cap Rate */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Rentabilidad Bruta (Cap Rate)</span>
                        <span className="font-extrabold text-emerald-400 text-sm">
                          {formatPercent(zone.capRate)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min((zone.capRate / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Metric 2: Price m² Sale */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Precio Venta / m²</span>
                        <span className="font-bold text-amber-400 text-sm">
                          {formatCOP(zone.avgPriceM2Sale)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.min((zone.avgPriceM2Sale / 15000000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Metric 3: Price m² Rent */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Arriendo / m² mes</span>
                        <span className="font-bold text-slate-200">
                          {formatCOP(zone.avgPriceM2Rent)}
                        </span>
                      </div>
                    </div>

                    {/* Metric 4: Appreciation & Vacancy */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Plusvalía Anual</span>
                        <span className="font-bold text-purple-400">+{formatPercent(zone.annualAppreciation)}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Tiempo Vacancia</span>
                        <span className="font-bold text-blue-400">{zone.vacancyRateMonths} meses</span>
                      </div>
                    </div>

                    {/* Qualitative Insights */}
                    <div className="space-y-2 text-xs pt-1 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">Perfil del arrendatario:</span>
                        <p className="text-slate-300 text-xs mt-0.5">{zone.tenantProfile}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">Ejes y Movilidad:</span>
                        <p className="text-slate-300 text-xs mt-0.5">{zone.transportAccess}</p>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400 font-semibold text-[11px]">Vocación principal:</span>
                      {zone.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onSelectZone(zone)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-all"
                    >
                      Ver Ficha
                    </button>
                    <button
                      onClick={() => onOpenSimulatorWithZone(zone)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold text-center transition-all shadow-md shadow-amber-500/10"
                    >
                      Simular Inversión
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
