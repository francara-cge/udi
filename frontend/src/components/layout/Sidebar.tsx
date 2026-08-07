import React from 'react';
import { ViewMode } from '../../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenNovoRegistro: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenNovoRegistro,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'meus-cursos', label: 'Meus Cursos', icon: 'school' },
    { id: 'acompanhamento', label: 'Acompanhamento', icon: 'analytics' },
    { id: 'relatorios', label: 'Relatórios', icon: 'description' },
  ];

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <nav
        className={`bg-primary dark:bg-primary-container text-on-primary h-screen w-64 fixed left-0 top-0 shadow-md flex flex-col py-6 px-4 z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-container border-2 border-primary-fixed-dim flex items-center justify-center overflow-hidden shrink-0">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              badge
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-xl font-bold text-white tracking-wide">CGE-MT</h1>
            <p className="font-label-md text-xs text-primary-fixed-dim opacity-90">Controle de Capacitações</p>
          </div>
        </div>

        {/* CTA Button: Novo Registro */}
        <button
          onClick={() => {
            onOpenNovoRegistro();
            onCloseMobile();
          }}
          className="w-full bg-mt-gold hover:bg-secondary-container text-on-secondary-container font-label-md text-xs rounded-lg py-3 mb-6 transition-all flex items-center justify-center gap-2 font-bold shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            add
          </span>
          Novo Registro
        </button>

        {/* Main Navigation Links */}
        <div className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm scale-95 duration-150 ease-in-out'
                    : 'text-primary-fixed-dim hover:text-white hover:bg-primary-container/50'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${isActive ? 'fill' : ''}`}
                >
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mt-auto border-t border-primary-container/60 pt-4 space-y-1">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-primary-fixed-dim hover:text-white flex items-center gap-3 px-4 py-3 hover:bg-primary-container/50 transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="font-body-md text-body-md">Configurações</span>
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-primary-fixed-dim hover:text-white flex items-center gap-3 px-4 py-3 hover:bg-primary-container/50 transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-body-md text-body-md">Sair</span>
          </button>
        </div>
      </nav>
    </>
  );
};
