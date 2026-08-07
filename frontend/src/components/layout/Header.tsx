import React from 'react';
import { Auditor } from '../../types';

interface HeaderProps {
  currentAuditor: Auditor;
  onToggleMobileMenu: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAuditor,
  onToggleMobileMenu,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="bg-surface text-primary w-full top-0 sticky z-40 border-b border-border-subtle flex justify-between items-center h-16 px-4 md:px-8 shrink-0 shadow-sm">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4 md:gap-8">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-primary p-2 -ml-2 rounded-lg hover:bg-surface-container-low transition-colors"
          aria-label="Abrir menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <h2 className="font-headline-sm text-lg md:text-xl font-bold text-cge-navy tracking-tight">
          CGE-MT Capacita
        </h2>

        <nav className="hidden md:flex items-center gap-6 h-full">
          <a
            href="#"
            className="text-primary border-b-2 border-primary font-bold pb-1 text-xs md:text-sm transition-opacity hover:opacity-80"
          >
            Início
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary text-xs md:text-sm pb-1 transition-colors"
          >
            Auditoria
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary text-xs md:text-sm pb-1 transition-colors"
          >
            Ajuda
          </a>
        </nav>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar..."
            className="pl-9 pr-4 py-1.5 bg-surface-container-low border border-border-subtle rounded-full text-xs md:text-sm focus:outline-none focus:border-cge-navy focus:ring-1 focus:ring-cge-navy transition-colors w-48 md:w-64"
          />
        </div>

        {/* Notifications Button */}
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all relative">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* Help Button */}
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-all hidden sm:flex">
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 cursor-pointer pl-3 border-l border-border-subtle hover:bg-surface-container-low p-1 pr-2 md:pr-3 rounded-full transition-all">
          <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-border-subtle shrink-0">
            <img
              src={currentAuditor.avatar}
              alt={currentAuditor.nome}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:block text-left">
            <span className="font-label-md text-xs font-semibold text-primary block leading-tight">
              {currentAuditor.nome.split(' ')[0]}
            </span>
            <span className="text-[10px] text-outline block leading-tight">
              {currentAuditor.unidade}
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-sm hidden lg:block">
            arrow_drop_down
          </span>
        </div>
      </div>
    </header>
  );
};
