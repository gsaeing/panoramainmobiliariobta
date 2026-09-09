import React, { useState } from 'react';
import { BogotaZone, PropertyListing } from './types';
import { BOGOTA_ZONES, SAMPLE_PROPERTIES } from './data/bogotaData';
import { Navbar } from './components/Navbar';
import { MarketOverview } from './components/MarketOverview';
import { BogotaMap } from './components/BogotaMap';
import { ZonesExplorer } from './components/ZonesExplorer';
import { PropertiesCatalog } from './components/PropertiesCatalog';
import { InvestmentSimulator } from './components/InvestmentSimulator';
import { ZoneComparator } from './components/ZoneComparator';
import { AiAdvisorDrawer } from './components/AiAdvisorDrawer';
import { ZoneDetailModal } from './components/ZoneDetailModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { NorthBogotaSpecialty } from './components/NorthBogotaSpecialty';
import { AdministracionBogotaSabana } from './components/AdministracionBogotaSabana';
import { Building2, Sparkles, MapPin, Calculator, ShieldCheck, Scale, ArrowUpRight, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('mercado');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('chico-virrey');
  const [zoneForModal, setZoneForModal] = useState<BogotaZone | null>(null);
  const [propertyForModal, setPropertyForModal] = useState<PropertyListing | null>(null);

  // AI Advisor state
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [aiZoneContext, setAiZoneContext] = useState<BogotaZone | null>(null);
  const [aiPropertyContext, setAiPropertyContext] = useState<PropertyListing | null>(null);

  // Compared zones
  const [comparedZoneIds, setComparedZoneIds] = useState<string[]>([
    'chico-virrey',
    'cedritos',
    'chapinero-alto',
  ]);

  // Simulator preload state
  const [simPreload, setSimPreload] = useState<{ price: number; rent: number; admin: number }>({
    price: 480000000,
    rent: 3200000,
    admin: 350000,
  });

  // Handlers
  const handleOpenSimulatorWithZone = (zone: BogotaZone) => {
    const estimatedPrice = zone.avgPriceM2Sale * 55; // 55m² standard unit
    const estimatedRent = zone.avgPriceM2Rent * 55;
    const estimatedAdmin = Math.round(estimatedRent * 0.12);

    setSimPreload({
      price: estimatedPrice,
      rent: estimatedRent,
      admin: estimatedAdmin,
    });
    setActiveTab('simulador');
  };

  const handleOpenSimulatorWithProperty = (prop: PropertyListing) => {
    setSimPreload({
      price: prop.priceCop,
      rent: prop.estimatedMonthlyRentCop,
      admin: prop.monthlyAdminCop,
    });
    setActiveTab('simulador');
  };

  const handleConsultAiWithSimulation = (summaryPrompt: string) => {
    setAiZoneContext(null);
    setAiPropertyContext(null);
    setAiInitialPrompt(summaryPrompt);
    setIsAiAdvisorOpen(true);
  };

  const handleAskAiAboutZone = (zone: BogotaZone) => {
    setAiZoneContext(zone);
    setAiPropertyContext(null);
    setAiInitialPrompt(
      `¿Cuál es el panorama de inversión, plusvalía proyectada y rentabilidad para la zona de ${zone.name} en ${zone.locality} (Estrato ${zone.estrato})?`
    );
    setIsAiAdvisorOpen(true);
  };

  const handleAskAiAboutProperty = (prop: PropertyListing) => {
    setAiPropertyContext(prop);
    setAiZoneContext(null);
    setAiInitialPrompt(
      `Quiero evaluar la viabilidad financiera de comprar el inmueble "${prop.title}" en ${prop.zoneName} por $${(prop.priceCop / 1000000).toFixed(0)}M COP. ¿Es buen negocio con un canon estimado de $${(prop.estimatedMonthlyRentCop / 1000000).toFixed(1)}M COP?`
    );
    setIsAiAdvisorOpen(true);
  };

  const handleAddToCompare = (zone: BogotaZone) => {
    if (comparedZoneIds.includes(zone.id)) {
      setComparedZoneIds(comparedZoneIds.filter((id) => id !== zone.id));
    } else {
      if (comparedZoneIds.length >= 4) {
        setComparedZoneIds([...comparedZoneIds.slice(1), zone.id]);
      } else {
        setComparedZoneIds([...comparedZoneIds, zone.id]);
      }
    }
  };

  const handleRemoveFromCompare = (zoneId: string) => {
    setComparedZoneIds(comparedZoneIds.filter((id) => id !== zoneId));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAdvisor={() => {
          setAiZoneContext(null);
          setAiPropertyContext(null);
          setAiInitialPrompt(undefined);
          setIsAiAdvisorOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Tab 1: Mercado & Zonas */}
        {activeTab === 'mercado' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MarketOverview
              onExploreZones={() => {
                const el = document.getElementById('zonas-explorer-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenSimulator={() => setActiveTab('simulador')}
              onOpenAiAdvisor={() => {
                setAiInitialPrompt(undefined);
                setIsAiAdvisorOpen(true);
              }}
              onNavigateToNorth={() => setActiveTab('norte')}
            />

            {/* Quick Interactive Map preview on main page */}
            <div className="pt-2">
              <BogotaMap
                zones={BOGOTA_ZONES}
                selectedZoneId={selectedZoneId}
                onSelectZone={(zone) => {
                  setSelectedZoneId(zone.id);
                  setZoneForModal(zone);
                }}
                onOpenSimulatorWithZone={handleOpenSimulatorWithZone}
              />
            </div>

            {/* Explorer Section */}
            <div id="zonas-explorer-section" className="pt-4">
              <ZonesExplorer
                zones={BOGOTA_ZONES}
                onSelectZone={(zone) => setZoneForModal(zone)}
                onOpenSimulatorWithZone={handleOpenSimulatorWithZone}
                onAddToCompare={handleAddToCompare}
                comparedZoneIds={comparedZoneIds}
              />
            </div>

            {/* Featured Properties preview */}
            <div className="pt-4">
              <PropertiesCatalog
                properties={SAMPLE_PROPERTIES}
                onSelectProperty={(prop) => setPropertyForModal(prop)}
                onSimulateProperty={handleOpenSimulatorWithProperty}
              />
            </div>
          </div>
        )}

        {/* Tab: Especialidad en el Norte de Bogotá */}
        {activeTab === 'norte' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <NorthBogotaSpecialty
              zones={BOGOTA_ZONES}
              properties={SAMPLE_PROPERTIES}
              onSelectZone={(zone) => {
                setSelectedZoneId(zone.id);
                setZoneForModal(zone);
              }}
              onSelectProperty={(prop) => setPropertyForModal(prop)}
              onSimulateProperty={handleOpenSimulatorWithProperty}
              onSimulateZone={handleOpenSimulatorWithZone}
              onConsultAi={(prompt) => {
                setAiInitialPrompt(prompt);
                setAiZoneContext(null);
                setAiPropertyContext(null);
                setIsAiAdvisorOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Mapa Interactivo full screen */}
        {activeTab === 'mapa' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <BogotaMap
              zones={BOGOTA_ZONES}
              selectedZoneId={selectedZoneId}
              onSelectZone={(zone) => {
                setSelectedZoneId(zone.id);
                setZoneForModal(zone);
              }}
              onOpenSimulatorWithZone={handleOpenSimulatorWithZone}
            />

            {/* Sub-grid of zones below map for quick reference */}
            <div className="pt-4">
              <ZonesExplorer
                zones={BOGOTA_ZONES}
                onSelectZone={(zone) => setZoneForModal(zone)}
                onOpenSimulatorWithZone={handleOpenSimulatorWithZone}
                onAddToCompare={handleAddToCompare}
                comparedZoneIds={comparedZoneIds}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Oportunidades & Proyectos */}
        {activeTab === 'propiedades' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <PropertiesCatalog
              properties={SAMPLE_PROPERTIES}
              onSelectProperty={(prop) => setPropertyForModal(prop)}
              onSimulateProperty={handleOpenSimulatorWithProperty}
            />
          </div>
        )}

        {/* Tab 4: Calculadora & Simulador ROI */}
        {activeTab === 'simulador' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <InvestmentSimulator
              initialPriceCop={simPreload.price}
              initialRentCop={simPreload.rent}
              initialAdminCop={simPreload.admin}
              onConsultAiWithSimulation={handleConsultAiWithSimulation}
            />
          </div>
        )}

        {/* Tab 5: Comparador de Zonas */}
        {activeTab === 'comparador' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ZoneComparator
              zones={BOGOTA_ZONES}
              comparedZoneIds={comparedZoneIds}
              onRemoveZone={handleRemoveFromCompare}
              onAddZone={handleAddToCompare}
              onSelectZone={(zone) => setZoneForModal(zone)}
              onOpenSimulatorWithZone={handleOpenSimulatorWithZone}
            />
          </div>
        )}

        {/* Tab 6: Administración Bogotá y Sabana (SEO) */}
        {activeTab === 'administracion' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <AdministracionBogotaSabana />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <ZoneDetailModal
        zone={zoneForModal}
        onClose={() => setZoneForModal(null)}
        onSimulate={handleOpenSimulatorWithZone}
        onAskAi={handleAskAiAboutZone}
        relatedProperties={
          zoneForModal
            ? SAMPLE_PROPERTIES.filter((p) => p.zoneId === zoneForModal.id)
            : []
        }
        onSelectProperty={(prop) => setPropertyForModal(prop)}
      />

      <PropertyDetailModal
        property={propertyForModal}
        onClose={() => setPropertyForModal(null)}
        onSimulate={handleOpenSimulatorWithProperty}
        onAskAi={handleAskAiAboutProperty}
      />

      <AiAdvisorDrawer
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        activeZoneContext={aiZoneContext}
        activePropertyContext={aiPropertyContext}
        initialPrompt={aiInitialPrompt}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-[#080c14] py-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">Panorama Inmobiliario Bogotá D.C.</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Inteligencia de Mercado Residencial & Comercial</span>
          </div>

          <p className="text-center md:text-right text-[11px] text-slate-500 max-w-xl">
            Modelos de referencia basados en datos estadísticos de DANE, Galería Inmobiliaria, Catastro Distrital y Lonja de Bogotá. Cálculos de crédito y leasing ajustados a fórmulas del sistema financiero colombiano.
          </p>
        </div>
        {/* Contacto y zonas para SEO local */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="text-center md:text-left">
            Administración de inmuebles en Bogotá y Sabana: Chicó, Usaquén, Chapinero, Cedritos, Suba, Chía, Cajicá, La Calera, Zipaquirá, Mosquera, Funza, Madrid, Soacha. WhatsApp 301 625 0244 · Lun–Vie 08:00–18:00.
          </p>
          <button onClick={() => setActiveTab('administracion')} className="text-amber-400 hover:text-amber-300 font-semibold whitespace-nowrap cursor-pointer">
            Poner mi inmueble en administración →
          </button>
        </div>
      </footer>
    </div>
  );
}
