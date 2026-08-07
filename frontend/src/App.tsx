import React, { useState } from 'react';
import { ViewMode, Curso, Auditor, Tema } from './types';
import { INITIAL_CURSOS, INITIAL_AUDITORES, INITIAL_TEMAS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { QuadroPrincipalView } from './components/dashboard/QuadroPrincipalView';
import { LancamentoCursosView } from './components/cursos/LancamentoCursosView';
import { AcompanhamentoSuperintendenciaView } from './components/superintendencia/AcompanhamentoSuperintendenciaView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Datasets State
  const [cursos, setCursos] = useState<Curso[]>(INITIAL_CURSOS);
  const [auditores, setAuditores] = useState<Auditor[]>(INITIAL_AUDITORES);
  const [temas] = useState<Tema[]>(INITIAL_TEMAS);

  // Active user / auditor context
  const currentAuditor = auditores[0]; // Ana Silva Costa

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Add new course handler
  const handleAddCurso = (novoCursoData: Omit<Curso, 'curso_id'>) => {
    const newId = `cur-${Date.now()}`;
    const novoCurso: Curso = {
      ...novoCursoData,
      curso_id: newId,
    };

    const updatedCursos = [novoCurso, ...cursos];
    setCursos(updatedCursos);

    // Update auditor hours
    setAuditores((prevAuditores) =>
      prevAuditores.map((a) => {
        if (a.nome === novoCurso.auditor) {
          return {
            ...a,
            hr_planejadas: a.hr_planejadas + novoCurso.hr_planejadas,
            hr_realizadas: a.hr_realizadas + novoCurso.hr_realizadas,
          };
        }
        return a;
      })
    );

    showToast(`Curso "${novoCurso.nome}" cadastrado com sucesso!`);
  };

  // Delete course handler
  const handleDeleteCurso = (cursoId: string) => {
    const cursoToDelete = cursos.find((c) => c.curso_id === cursoId);
    if (!cursoToDelete) return;

    setCursos((prev) => prev.filter((c) => c.curso_id !== cursoId));

    if (cursoToDelete) {
      setAuditores((prev) =>
        prev.map((a) => {
          if (a.nome === cursoToDelete.auditor) {
            return {
              ...a,
              hr_planejadas: Math.max(0, a.hr_planejadas - cursoToDelete.hr_planejadas),
              hr_realizadas: Math.max(0, a.hr_realizadas - cursoToDelete.hr_realizadas),
            };
          }
          return a;
        })
      );
    }

    showToast(`Curso removido com sucesso.`);
  };

  return (
    <div className="flex h-screen bg-background text-on-background overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-cge-navy text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-success-green">check_circle</span>
          <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenNovoRegistro={() => setCurrentView('meus-cursos')}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden relative">
        {/* Header */}
        <Header
          currentAuditor={currentAuditor}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {currentView === 'dashboard' && (
            <QuadroPrincipalView
              currentAuditor={currentAuditor}
              cursos={cursos}
              temas={temas}
              onOpenNovoRegistro={() => setCurrentView('meus-cursos')}
              onNavigateToCursos={() => setCurrentView('meus-cursos')}
            />
          )}

          {currentView === 'meus-cursos' && (
            <LancamentoCursosView
              currentAuditor={currentAuditor}
              cursos={cursos}
              temas={temas}
              onAddCurso={handleAddCurso}
              onDeleteCurso={handleDeleteCurso}
            />
          )}

          {currentView === 'acompanhamento' && (
            <AcompanhamentoSuperintendenciaView
              auditores={auditores}
              temas={temas}
              cursos={cursos}
            />
          )}

          {currentView === 'relatorios' && (
            <div className="max-w-container-max mx-auto space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-border-subtle card-shadow text-center">
                <span className="material-symbols-outlined text-cge-navy text-5xl mb-3">
                  description
                </span>
                <h2 className="text-2xl font-bold text-cge-navy">Relatórios de Capacitação UDI</h2>
                <p className="text-sm text-on-surface-variant max-w-lg mx-auto mt-2">
                  Emissão de relatórios sazonais e consolidados das capacitações da CGE-MT para fins de prestação de contas institucional.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => showToast('Relatório Anual 2024 gerado com sucesso!')}
                    className="bg-cge-navy text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Exportar Relatório PDF (Ano 2024)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
