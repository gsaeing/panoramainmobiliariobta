import React, { useState } from 'react';
import { BogotaZone } from '../types';
import { formatCOP, formatPercent, getEstratoBadgeStyle } from '../utils/formatters';
import { Layers, MapPin, ExternalLink, Info, Sparkles } from 'lucide-react';

interface BogotaMapProps {
  zones: BogotaZone[];
  selectedZoneId: string | null;
  onSelectZone: (zone: BogotaZone) => void;
  onOpenSimulatorWithZone: (zone: BogotaZone) => void;
}

type MapLayer = 'price' | 'capRate' | 'appreciation';

export const BogotaMap: React.FC<BogotaMapProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  onOpenSimulatorWithZone,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('price');
  const [hoveredZone, setHoveredZone] = useState<BogotaZone | null>(null);

  // Compute color based on layer
  const getZoneNodeColor = (zone: BogotaZone) => {
    if (activeLayer === 'price') {
      // Sale m²: from ~5M (lower) to 13M (highest)
      if (zone.avgPriceM2Sale >= 10000000) return '#f59e0b'; // Amber-500
      if (zone.avgPriceM2Sale >= 7500000) return '#eab308'; // Yellow-500
      if (zone.avgPriceM2Sale >= 6000000) return '#38bdf8'; // Sky-400
      return '#34d399'; // Emerald-400
    }
    if (activeLayer === 'capRate') {
      // Cap rate: 5.9% to 8.9%
      if (zone.capRate >= 8.0) return '#10b981'; // Emerald-500
      if (zone.capRate >= 7.0) return '#06b6d4'; // Cyan-500
      return '#a855f7'; // Purple-500
    }
    // Appreciation
    if (zone.annualAppreciation >= 8.5) return '#f43f5e'; // Rose-500
    if (zone.annualAppreciation >= 7.5) return '#fb923c'; // Orange-400
    return '#60a5fa'; // Blue-400
  };

  const getMetricDisplay = (zone: BogotaZone) => {
    if (activeLayer === 'price') {
      return `${formatCOP(zone.avgPriceM2Sale, true)}/m²`;
    }
    if (activeLayer === 'capRate') {
      return `Cap Rate: ${formatPercent(zone.capRate)}`;
    }
    return `Plusvalía: ${formatPercent(zone.annualAppreciation)} a/a`;
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Mapa Territorial y Corredores Inmobiliarios de Bogotá</span>
          </h2>
          <p className="text-xs text-slate-400">
            Haga clic en cualquier nodo para inspeccionar métricas y rentabilidad por estrato.
          </p>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            id="layer-price"
            onClick={() => setActiveLayer('price')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'price'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Precio Venta / m²
          </button>
          <button
            id="layer-caprate"
            onClick={() => setActiveLayer('capRate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'capRate'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rentabilidad (Cap Rate)
          </button>
          <button
            id="layer-appreciation"
            onClick={() => setActiveLayer('appreciation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'appreciation'
                ? 'bg-rose-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Apreciación Anual
          </button>
        </div>
      </div>

      {/* Map Container & Interactive SVG Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative bg-slate-950/90 rounded-2xl border border-slate-800/90 p-4 sm:p-6 overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Top Info overlay */}
          <div className="relative z-10 flex items-center justify-between pointer-events-none">
            <div className="text-[11px] font-medium text-slate-400 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-sm">
              Oriente: Cerros de Monserrate & Guadalupe ⛰️
            </div>
            <div className="text-[11px] font-medium text-slate-400 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-sm">
              Norte: Chía / Cota ↑
            </div>
          </div>

          {/* Interactive SVG Diagrammatic Map */}
          <div className="relative w-full h-[380px] sm:h-[420px] my-2">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Mountain Ridge Gradient (Cerros Orientales) */}
                <linearGradient id="mountainsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.8" />
                </linearGradient>

                {/* Metro Line Glow */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Cerros Orientales Backdrop (East of Bogota) */}
              <path
                d="M 68 0 Q 75 25 70 50 T 72 100 L 100 100 L 100 0 Z"
                fill="url(#mountainsGrad)"
                stroke="#334155"
                strokeWidth="0.5"
                strokeDasharray="1 1"
              />
              <text x="82" y="50" fill="#475569" fontSize="2.8" fontWeight="600" textAnchor="middle" transform="rotate(90, 82, 50)">
                CERROS ORIENTALES
              </text>

              {/* Main Arterial Roadways (Autonorte, Cra 7, Calle 26, Calle 100, NQS) */}
              {/* Carrera 7 */}
              <path
                d="M 58 5 L 59 35 L 58 60 L 56 95"
                stroke="#1e293b"
                strokeWidth="1.2"
                fill="none"
              />
              <text x="59.5" y="10" fill="#475569" fontSize="2" fontWeight="500">Cra 7</text>

              {/* Autopista Norte / Caracas */}
              <path
                d="M 48 5 L 50 30 L 52 55 L 50 95"
                stroke="#334155"
                strokeWidth="1.4"
                fill="none"
              />
              <text x="44.5" y="10" fill="#64748b" fontSize="2" fontWeight="500">Autopista Norte</text>

              {/* Calle 26 / Av El Dorado (To Airport) */}
              <path
                d="M 15 50 L 56 50"
                stroke="#334155"
                strokeWidth="1.2"
                fill="none"
              />
              <text x="18" y="48" fill="#64748b" fontSize="2" fontWeight="500">Calle 26 • Aeropuerto</text>

              {/* Calle 100 / Calle 80 */}
              <path
                d="M 30 28 L 65 28"
                stroke="#1e293b"
                strokeWidth="1"
                fill="none"
              />
              <text x="66" y="28.5" fill="#475569" fontSize="1.8">Calle 100</text>

              {/* Metro Line 1 Route (Caracas corridor to Centro & Bosa) */}
              <path
                d="M 48 95 L 51 65 L 53 45 L 52 35"
                stroke="#10b981"
                strokeWidth="0.9"
                strokeDasharray="1.5 1.5"
                fill="none"
                filter="url(#glow)"
              />
              <text x="40" y="80" fill="#10b981" fontSize="1.8" fontWeight="600">Línea 1 Metro Bogotá</text>

              {/* Zone Nodes on Map */}
              {zones.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZone?.id === zone.id;
                const nodeColor = getZoneNodeColor(zone);

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => onSelectZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                  >
                    {/* Pulsing ring when selected */}
                    {isSelected && (
                      <circle
                        cx={zone.mapCoordinates.x}
                        cy={zone.mapCoordinates.y}
                        r="5.5"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="0.8"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={zone.mapCoordinates.x}
                      cy={zone.mapCoordinates.y}
                      r={isSelected || isHovered ? 4.2 : 3.2}
                      fill={nodeColor}
                      fillOpacity={isSelected || isHovered ? 0.95 : 0.75}
                      stroke={isSelected ? '#ffffff' : '#0b0f19'}
                      strokeWidth={isSelected ? 0.8 : 0.5}
                      className="transition-all"
                    />

                    {/* Zone Stratum Badge Marker */}
                    <text
                      cx={zone.mapCoordinates.x}
                      x={zone.mapCoordinates.x}
                      y={zone.mapCoordinates.y + 0.9}
                      textAnchor="middle"
                      fill="#0b0f19"
                      fontSize="2.4"
                      fontWeight="800"
                    >
                      E{zone.estrato}
                    </text>

                    {/* Zone Label Text */}
                    <text
                      x={zone.mapCoordinates.x}
                      y={zone.mapCoordinates.y - 4.5}
                      textAnchor="middle"
                      fill={isSelected ? '#fef08a' : '#cbd5e1'}
                      fontSize="2.4"
                      fontWeight={isSelected ? '800' : '600'}
                      className="pointer-events-none drop-shadow-sm"
                    >
                      {zone.name.split('&')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredZone && (
              <div
                className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs transition-opacity duration-150"
                style={{
                  left: `${Math.min(hoveredZone.mapCoordinates.x + 4, 65)}%`,
                  top: `${Math.max(hoveredZone.mapCoordinates.y - 12, 10)}%`,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{hoveredZone.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Estrato {hoveredZone.estrato}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{hoveredZone.locality} • {hoveredZone.sector}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Venta m²:</span>
                    <span className="text-slate-200 font-bold">{formatCOP(hoveredZone.avgPriceM2Sale, true)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cap Rate:</span>
                    <span className="text-emerald-400 font-bold">{formatPercent(hoveredZone.capRate)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-300">Escala de colores:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>Accesible / Alto ROI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Prime / Premium</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>E3-E6 indica estratificación urbana DANE</span>
            </div>
          </div>
        </div>

        {/* Zone Details Sidebar (Quick Inspector) */}
        <div className="bg-slate-900/70 rounded-2xl border border-slate-800/90 p-5 flex flex-col justify-between">
          {(() => {
            const currentZone = zones.find((z) => z.id === selectedZoneId) || hoveredZone || zones[0];
            const badge = getEstratoBadgeStyle(currentZone.estrato);

            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400">{currentZone.locality}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1.5">{currentZone.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cap Rate</span>
                    <span className="text-emerald-400 font-extrabold text-base">
                      {formatPercent(currentZone.capRate)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentZone.description}
                </p>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Venta m² Promedio</span>
                    <span className="text-sm font-bold text-amber-400">
                      {formatCOP(currentZone.avgPriceM2Sale)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Arriendo m² Mensual</span>
                    <span className="text-sm font-bold text-slate-200">
                      {formatCOP(currentZone.avgPriceM2Rent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Plusvalía Anual</span>
                    <span className="text-sm font-bold text-purple-400">
                      +{formatPercent(currentZone.annualAppreciation)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vacancia Media</span>
                    <span className="text-sm font-bold text-blue-400">
                      {currentZone.vacancyRateMonths} meses
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Puntos Clave:</span>
                  <ul className="space-y-1">
                    {currentZone.highlights.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Profile and Transport */}
                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <p>
                    <strong className="text-slate-300">Perfil inquilino:</strong> {currentZone.tenantProfile}
                  </p>
                  <p>
                    <strong className="text-slate-300">Movilidad:</strong> {currentZone.transportAccess}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    id="btn-simulate-current-zone"
                    onClick={() => onOpenSimulatorWithZone(currentZone)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    <span>Simular Inversión en {currentZone.name.split('&')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
