import React from 'react';
import { Building2, Sparkles, MapPin, Calculator, BarChart3, Scale, Layers, Compass, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAiAdvisor }) => {
  const navItems = [
    { id: 'mercado', label: 'Mercado & Zonas', icon: BarChart3 },
    { id: 'norte', label: 'Especialidad Norte', icon: Compass, isSpecial: true },
    { id: 'mapa', label: 'Mapa Interactivo', icon: MapPin },
    { id: 'propiedades', label: 'Oportunidades', icon: Layers },
    { id: 'simulador', label: 'Calculadora ROI', icon: Calculator },
    { id: 'comparador', label: 'Comparador', icon: Scale },
    { id: 'administracion', label: 'Administración', icon: KeyRound, isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand */}
          <div 
            onClick={() => setActiveTab('mercado')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-emerald-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/50 transition-all shadow-lg shadow-amber-500/5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-slate-100 font-['Cabinet_Grotesk',sans-serif]">
                  PANORAMA
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  BTA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Inteligencia Inmobiliaria • Bogotá D.C.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : item.isSpecial
                      ? 'text-amber-300 hover:text-white bg-amber-950/30 hover:bg-amber-900/40 border border-amber-600/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.isSpecial && !isActive ? 'text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.isSpecial && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Advisor Button */}
          <div className="flex items-center gap-3">
            <button
              id="btn-open-ai-advisor"
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-100 bg-gradient-to-r from-emerald-600/30 to-amber-600/30 hover:from-emerald-600/50 hover:to-amber-600/50 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Asesor IA Bogotá</span>
              <span className="sm:hidden">IA</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800/50 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
