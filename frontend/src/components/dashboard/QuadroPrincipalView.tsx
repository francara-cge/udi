import React from 'react';
import { Curso, Auditor, Tema } from '../../types';

interface QuadroPrincipalViewProps {
  currentAuditor: Auditor;
  cursos: Curso[];
  temas: Tema[];
  onOpenNovoRegistro: () => void;
  onNavigateToCursos: () => void;
}

export const QuadroPrincipalView: React.FC<QuadroPrincipalViewProps> = ({
  currentAuditor,
  cursos,
  temas,
  onOpenNovoRegistro,
  onNavigateToCursos,
}) => {
  // Compute metrics for current auditor
  const auditorCursos = cursos.filter(
    (c) => c.auditor === currentAuditor.nome || c.unidade === currentAuditor.unidade
  );

  const horasRealizadas = auditorCursos.reduce((acc, c) => acc + c.hr_realizadas, 0);
  const horasPlanejadas = auditorCursos.reduce((acc, c) => acc + c.hr_planejadas, 0);
  const totalCursos = auditorCursos.length;
  const metaAnual = currentAuditor.meta_anual || 40;
  
  const percentMeta = Math.min(Math.round((horasRealizadas / metaAnual) * 100), 100);
  const horasRestantes = Math.max(metaAnual - horasRealizadas, 0);

  const horasEmAndamento = auditorCursos
    .filter((c) => c.status === 'Em Andamento')
    .reduce((acc, c) => acc + (c.hr_planejadas - c.hr_realizadas), 0);

  return (
    <div className="space-y-6 max-w-container-max mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-cge-navy mb-1">
            Visão Geral de Capacitação
          </h1>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant">
            Acompanhamento de metas e progresso anual de 2024 • Auditoria: <span className="font-semibold text-cge-navy">{currentAuditor.nome}</span>
          </p>
        </div>
        <button
          onClick={onOpenNovoRegistro}
          className="bg-mt-gold hover:bg-secondary-container text-on-secondary-container font-label-md text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:shadow transition-all font-bold"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          Cadastrar Novo Curso
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Metric Card (Progresso Anual) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-border-subtle card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-1">
                  Progresso Anual de Capacitação
                </h3>
                <p className="font-body-md text-xs text-outline">
                  Meta Institucional de {metaAnual}h anuais (Portaria CGE-MT)
                </p>
              </div>
              <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-label-md text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">trending_up</span>
                {percentMeta >= 80 ? 'Excelente' : percentMeta >= 50 ? 'Em dia' : 'Atenção'}
              </div>
            </div>

            <div className="flex items-end gap-4 mb-6">
              <div className="text-5xl md:text-6xl font-bold text-cge-navy tracking-tight leading-none">
                {horasRealizadas}h
              </div>
              <div className="pb-1">
                <p className="font-body-lg text-sm md:text-base text-on-surface-variant">
                  de <span className="font-bold">{metaAnual}h</span> almejadas
                </p>
                <p className="font-label-md text-xs font-bold text-success-green mt-1">
                  {percentMeta}% da meta atingida
                </p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-surface-container-highest rounded-full h-4 mb-3 overflow-hidden flex">
              <div
                className="bg-cge-navy h-full transition-all duration-500 rounded-l-full"
                style={{ width: `${Math.min((horasRealizadas / metaAnual) * 100, 100)}%` }}
                title={`Realizado: ${horasRealizadas}h`}
              />
              <div
                className="bg-secondary-container h-full transition-all duration-500"
                style={{ width: `${Math.min((horasEmAndamento / metaAnual) * 100, 100)}%` }}
                title={`Em andamento: ${horasEmAndamento}h`}
              />
            </div>

            <div className="flex flex-wrap justify-between text-xs text-outline gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cge-navy block" />
                Realizado ({horasRealizadas}h)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-container block" />
                Em andamento ({horasEmAndamento}h)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-surface-container-highest block" />
                Restante ({horasRestantes}h)
              </div>
            </div>
          </div>
        </div>

        {/* Mini Cards Column */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-border-subtle card-shadow flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">library_books</span>
              </div>
              <h4 className="font-body-md text-sm font-bold text-on-surface-variant">
                Total de Cursos
              </h4>
            </div>
            <div className="text-3xl font-bold text-cge-navy leading-none mt-1">
              {String(totalCursos).padStart(2, '0')}
            </div>
            <p className="font-label-md text-xs text-outline mt-2">Neste exercício de 2024</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-border-subtle card-shadow flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-xl">hourglass_empty</span>
              </div>
              <h4 className="font-body-md text-sm font-bold text-on-surface-variant">
                Horas Restantes
              </h4>
            </div>
            <div className="text-3xl font-bold text-mt-gold leading-none mt-1">
              {String(horasRestantes).padStart(2, '0')}h
            </div>
            <p className="font-label-md text-xs text-outline mt-2">Para cumprir a portaria</p>
          </div>
        </div>
      </div>

      {/* Recent Courses List Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle card-shadow overflow-hidden">
        <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cge-navy" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Meus Cursos Recentes
            </h3>
          </div>
          <button
            onClick={onNavigateToCursos}
            className="text-xs font-semibold text-cge-navy hover:underline flex items-center gap-1"
          >
            Ver todos ({auditorCursos.length})
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="divide-y divide-border-subtle">
          {auditorCursos.slice(0, 4).map((curso) => {
            const temaObj = temas.find((t) => t.tema_id === curso.tema_id);
            return (
              <div key={curso.curso_id} className="p-4 hover:bg-surface-gray transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-sm text-primary">{curso.nome}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {temaObj?.descricao || 'Tema Geral'} • <span className="text-outline">{curso.instituicao}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="text-outline">Horas: </span>
                    <span className="font-bold text-on-surface">{curso.hr_realizadas}h</span> / {curso.hr_planejadas}h
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      curso.status === 'Concluído'
                        ? 'bg-success-green/10 text-success-green border-success-green/20'
                        : curso.status === 'Em Andamento'
                        ? 'bg-warning-amber/10 text-warning-amber border-warning-amber/20'
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        curso.status === 'Concluído'
                          ? 'bg-success-green'
                          : curso.status === 'Em Andamento'
                          ? 'bg-warning-amber animate-pulse'
                          : 'bg-outline'
                      }`}
                    />
                    {curso.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
