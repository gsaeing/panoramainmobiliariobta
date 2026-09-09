import React, { useState } from 'react';
import { BogotaZone, PropertyListing } from '../types';
import { NORTH_CORRIDORS, NORTH_MEGAPROJECTS, NorthCorridor } from '../data/bogotaData';
import { formatCOP, formatM2, formatPercent } from '../utils/formatters';
import {
  Compass,
  Building2,
  TrendingUp,
  MapPin,
  Stethoscope,
  Sparkles,
  Train,
  TreePine,
  ShieldCheck,
  Calculator,
  ChevronRight,
  Layers,
  Award,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  Users,
  Car,
} from 'lucide-react';

interface NorthBogotaSpecialtyProps {
  zones: BogotaZone[];
  properties: PropertyListing[];
  onSelectZone: (zone: BogotaZone) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onSimulateProperty: (property: PropertyListing) => void;
  onSimulateZone: (zone: BogotaZone) => void;
  onConsultAi: (prompt: string) => void;
}

export const NorthBogotaSpecialty: React.FC<NorthBogotaSpecialtyProps> = ({
  zones,
  properties,
  onSelectZone,
  onSelectProperty,
  onSimulateProperty,
  onSimulateZone,
  onConsultAi,
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corredor-medico-corporativo');
  const [estratoFilter, setEstratoFilter] = useState<'todos' | '4' | '5' | '6'>('todos');

  // Filter North zones
  const northZones = zones.filter(
    (z) =>
      z.sector === 'Norte' ||
      z.id === 'chico-virrey' ||
      z.id === 'colina-campestre' ||
      z.locality === 'Usaquén'
  );

  // Filter North properties
  const northProperties = properties.filter((p) => {
    const isNorth =
      p.locality === 'Usaquén' ||
      p.zoneId === 'chico-virrey' ||
      p.zoneId === 'colina-campestre' ||
      p.zoneId === 'cantagallo-mazuren' ||
      p.zoneId === 'san-patricio-teleport' ||
      p.zoneId === 'san-jose-bavaria' ||
      p.zoneId === 'usaquen-colonial' ||
      p.zoneId === 'cedritos' ||
      p.zoneId === 'santa-barbara';

    if (!isNorth) return false;
    if (estratoFilter !== 'todos' && p.estrato.toString() !== estratoFilter) return false;
    return true;
  });

  const activeCorridor =
    NORTH_CORRIDORS.find((c) => c.id === selectedCorridorId) || NORTH_CORRIDORS[0];

  const corridorZones = zones.filter((z) => activeCorridor.zones.includes(z.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner Specialty */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1329] p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>CENTRO DE ESPECIALIDAD TERRITORIAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Especialidad en el{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Norte de Bogotá
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Análisis profundo de los corredores más solventes de Colombia: Usaquén, Suba Oriental y Chapinero Norte.
            Evaluamos la rentabilidad por m², el impacto del clúster médico de la Fundación Santa Fe, el megaproyecto
            Regiotram del Norte y la dinamización de compraventa en estratos 4, 5 y 6.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[11px] text-slate-400 block font-medium">Precio Medio m² Norte</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-white">$7.85M</span>
                <span className="text-[10px] text-emerald-400 font-bold">+7.6% a/a</span>
              </div>
              <span className="text-[10px] text-slate-500">Estratos 4, 5 y 6</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[11px] text-slate-400 block font-medium">Cap Rate Residencial</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400">6.6% - 7.8%</span>
              </div>
              <span className="text-[10px] text-slate-500">Hasta 9.8% en suites médicas</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[11px] text-slate-400 block font-medium">Vacancia Promedio</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-amber-300">1.6 meses</span>
              </div>
              <span className="text-[10px] text-slate-500">Alta absorción con póliza</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <span className="text-[11px] text-slate-400 block font-medium">Megaproyectos Activos</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-blue-400">4 Catalizadores</span>
              </div>
              <span className="text-[10px] text-slate-500">Regiotram, Torca, Autonorte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: The 5 Strategic Corridors of North Bogota */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Los 5 Micro-Corredores Estratégicos del Norte</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada corredor del norte responde a una vocación de inversión diferente: médica, familiar, diplomática o de infraestructura.
            </p>
          </div>
          <span className="text-xs text-amber-400/90 font-semibold bg-amber-950/40 px-3 py-1 rounded-full border border-amber-700/50 self-start sm:self-auto">
            Haga clic para ver análisis en detalle
          </span>
        </div>

        {/* Corridor Pill Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {NORTH_CORRIDORS.map((corridor) => {
            const isSelected = corridor.id === selectedCorridorId;
            return (
              <button
                key={corridor.id}
                id={`btn-corridor-${corridor.id}`}
                onClick={() => setSelectedCorridorId(corridor.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10 text-white'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        corridor.estratoPredominante === 6
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : corridor.estratoPredominante === 5
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      Estrato {corridor.estratoPredominante}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                  <h3 className="text-xs font-bold line-clamp-2">{corridor.name}</h3>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
                  <span>Cap Rate</span>
                  <span className="font-bold text-emerald-400">~{corridor.avgCapRate}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Corridor Deep Dive Card */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                  {activeCorridor.tagline}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{activeCorridor.name}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Precio m² Promedio:</span>
                <span className="font-extrabold text-white">{formatCOP(activeCorridor.avgPriceM2)}</span>
              </div>
              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px]">Rentabilidad Estimada:</span>
                <span className="font-extrabold text-emerald-400">{activeCorridor.avgCapRate}% anual</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeCorridor.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Perfil de Inversión Óptimo</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeCorridor.bestFor}</p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <Car className="w-4 h-4 text-blue-400" />
                <span>Vías & Corredores Conectores</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {activeCorridor.keyAvenues.map((av, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {av}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Catalizadores de Plusvalía</span>
              </div>
              <ul className="text-slate-300 text-[11px] space-y-1">
                {activeCorridor.catalysts.map((cat, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Zones in this corridor */}
          {corridorZones.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">
                Zonas censadas en este corredor:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {corridorZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{zone.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          Estrato {zone.estrato}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {formatCOP(zone.avgPriceM2Sale)}/m² • Cap Rate {zone.capRate}%
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectZone(zone)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        Ver Zona
                      </button>
                      <button
                        onClick={() => onSimulateZone(zone)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Module 2: Estratificación Comparada en el Norte (Estratos 4, 5 y 6) */}
      <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Matriz Comparativa de Estratos en el Norte de Bogotá</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comportamiento de precios, costos operativos y retorno entre los tres estratos residenciales dominantes en el norte.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-3 px-4 font-semibold">Estrato Residencial</th>
                <th className="py-3 px-4 font-semibold">Zonas Representativas</th>
                <th className="py-3 px-4 font-semibold">Precio Promedio m²</th>
                <th className="py-3 px-4 font-semibold">Cap Rate Estimado</th>
                <th className="py-3 px-4 font-semibold">Cuota Administración PH</th>
                <th className="py-3 px-4 font-semibold">Perfil del Inversionista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span>Estrato 4 (Liquidez)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">Cedritos, Cantagallo, Bella Suiza, Mazurén</td>
                <td className="py-3.5 px-4 font-bold text-amber-300">$5.4M - $6.5M COP</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">7.3% - 7.8% anual</td>
                <td className="py-3.5 px-4 text-slate-300">$240.000 - $350.000/mes</td>
                <td className="py-3.5 px-4 text-slate-400">Primeros compradores, renta continua, fácil reventa</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  <span>Estrato 5 (Consolidado)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">Santa Bárbara, San Patricio, Colina Campestre</td>
                <td className="py-3.5 px-4 font-bold text-amber-300">$7.8M - $8.9M COP</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">6.6% - 7.0% anual</td>
                <td className="py-3.5 px-4 text-slate-300">$450.000 - $680.000/mes</td>
                <td className="py-3.5 px-4 text-slate-400">Renta a médicos, ejecutivos financieros y familias</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                  <span>Estrato 6 (Patrimonial)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">Chicó, Virrey, Santa Ana, San José de Bavaria</td>
                <td className="py-3.5 px-4 font-bold text-amber-300">$9.6M - $12.5M COP</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">6.2% - 6.6% anual</td>
                <td className="py-3.5 px-4 text-slate-300">$850.000 - $1.600.000/mes</td>
                <td className="py-3.5 px-4 text-slate-400">Preservación de capital, renta en USD / multinacionales</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Module 3: Megaprojects & Drivers of Appreciation */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Train className="w-5 h-5 text-amber-400" />
              <span>Megaproyectos de Movilidad y Desarrollo en el Norte (2026-2030)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Los proyectos con impacto directo en la plusvalía del suelo urbano en Usaquén y Suba.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NORTH_MEGAPROJECTS.map((mega) => (
            <div
              key={mega.id}
              className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {mega.badge}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  {mega.estimatedImpact}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">{mega.title}</h3>
                <span className="text-xs text-amber-400 font-medium block mt-0.5">{mega.route}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{mega.description}</p>

              <div className="pt-2 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                <span>Zonas beneficiadas:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {mega.zonesBenefited.map((z, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-medium"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module 4: Properties in North Bogota */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Oportunidades Residenciales en el Norte de Bogotá</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unidades verificadas en Cedritos, Santa Bárbara, Chicó, Usaquén Colonial, Cantagallo y San José de Bavaria.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-400 mr-1">Filtrar:</span>
            {(['todos', '4', '5', '6'] as const).map((e) => (
              <button
                key={e}
                onClick={() => setEstratoFilter(e)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  estratoFilter === e
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {e === 'todos' ? 'Todos' : `Estrato ${e}`}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {northProperties.map((prop) => {
            const expectedCapRate =
              prop.priceCop > 0 ? ((prop.estimatedMonthlyRentCop * 12) / prop.priceCop) * 100 : 0;

            return (
              <div
                key={prop.id}
                className="bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/40 backdrop-blur-md">
                        Estrato {prop.estrato}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700">
                        {prop.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Valor Inmueble</span>
                        <span className="text-lg font-black text-white">{formatCOP(prop.priceCop)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          Cap Rate {formatPercent(expectedCapRate)}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium">
                          {formatCOP(prop.pricePerM2)}/m²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-semibold">{prop.zoneName}</span>
                        <span className="text-slate-400">{prop.locality}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                        {prop.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{prop.addressApprox}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-slate-800 text-center text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Área</span>
                        <span className="font-bold">{formatM2(prop.areaM2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Habitaciones</span>
                        <span className="font-bold">{prop.bedrooms} hab</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Parqueaderos</span>
                        <span className="font-bold">{prop.parkingSpots} pq</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Canon estimado:</span>
                        <span className="font-bold text-emerald-400">{formatCOP(prop.estimatedMonthlyRentCop)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[9px]">Administración PH:</span>
                        <span className="font-medium text-slate-300">{formatCOP(prop.monthlyAdminCop)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSimulateProperty(prop)}
                    className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Simular ROI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module 5: Consultoría IA Especializada en el Norte */}
      <section className="bg-gradient-to-r from-slate-900 via-[#0e172a] to-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Consultorio Estratégico IA: Inversión en el Norte de Bogotá
            </h3>
            <p className="text-xs text-slate-300">
              Plantee preguntas especializadas al motor de inteligencia con datos de Catastro y Galería Inmobiliaria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {[
            {
              label: 'Cedritos vs Santa Bárbara',
              prompt:
                '¿Cuál es la diferencia financiera y de perfil de arrendatario entre comprar un apartamento en Cedritos (Estrato 4) vs Santa Bárbara (Estrato 5) en Bogotá?',
            },
            {
              label: 'Impacto Regiotram del Norte en Cra 9',
              prompt:
                '¿Cómo impactará la construcción del Regiotram del Norte el valor por m² y la plusvalía de los apartamentos a lo largo de la Carrera 9 en Usaquén?',
            },
            {
              label: 'Rentas Médicas cerca a Fundación Santa Fe',
              prompt:
                '¿Qué rentabilidad y modelo de negocio ofrecen las suites médicas y apartaestudios en San Patricio y Santa Bárbara orientados a pacientes y médicos de la Fundación Santa Fe?',
            },
            {
              label: 'Preservación Patrimonial en Chicó y Virrey',
              prompt:
                '¿Es conveniente invertir en inmuebles de estrato 6 en Chicó y Virrey frente a la inflación y tasas de interés en Colombia?',
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => onConsultAi(item.prompt)}
              className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex items-center justify-between gap-2 cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 block">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.prompt}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
