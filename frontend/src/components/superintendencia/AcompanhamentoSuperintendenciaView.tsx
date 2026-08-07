import React, { useState } from 'react';
import { Auditor, Tema, Curso } from '../../types';

interface AcompanhamentoSuperintendenciaViewProps {
  auditores: Auditor[];
  temas: Tema[];
  cursos: Curso[];
}

export const AcompanhamentoSuperintendenciaView: React.FC<AcompanhamentoSuperintendenciaViewProps> = ({
  auditores,
  temas,
  cursos,
}) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPortaria, setSelectedPortaria] = useState('p01');
  const [searchAuditor, setSearchAuditor] = useState('');

  // Compute theme rankings
  const themeHoursMap: Record<string, number> = {};
  cursos.forEach((c) => {
    themeHoursMap[c.tema_id] = (themeHoursMap[c.tema_id] || 0) + c.hr_realizadas;
  });

  const rankedTemas = temas
    .map((t) => ({
      ...t,
      horas: themeHoursMap[t.tema_id] || 0,
    }))
    .sort((a, b) => b.horas - a.horas);

  // Filter auditors
  const filteredAuditores = auditores.filter(
    (a) =>
      a.nome.toLowerCase().includes(searchAuditor.toLowerCase()) ||
      a.matricula.includes(searchAuditor) ||
      a.cargo.toLowerCase().includes(searchAuditor.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-container-max mx-auto">
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-1">
            Visão Gerencial
          </h1>
          <p className="font-body-lg text-sm text-on-surface-variant">
            Superintendência de Auditoria em Obras (SAO) • Acompanhamento da Chefia
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 card-shadow">
            <span className="material-symbols-outlined text-outline mr-2 text-lg">calendar_today</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-on-surface p-0 pr-4 cursor-pointer"
            >
              <option value="2024">Ano Base 2024</option>
              <option value="2023">Ano Base 2023</option>
            </select>
          </div>

          <div className="flex items-center bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 card-shadow">
            <span className="material-symbols-outlined text-outline mr-2 text-lg">gavel</span>
            <select
              value={selectedPortaria}
              onChange={(e) => setSelectedPortaria(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-on-surface p-0 pr-4 cursor-pointer"
            >
              <option value="p01">Portaria 01/2024</option>
              <option value="p02">Portaria 15/2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Unit Consolidated Progress Graph */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-border-subtle p-5 card-shadow flex flex-col h-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-cge-navy">bar_chart</span>
              Progresso da Unidade: Planejado vs Realizado (2024)
            </h2>
            <button className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-lg">more_vert</span>
            </button>
          </div>

          {/* Simulated Bar Chart */}
          <div className="flex-1 relative w-full h-full bg-surface-container-low rounded-lg border border-border-subtle flex items-end justify-around px-6 pb-10 pt-8">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 pb-10">
              <div className="w-full border-t border-border-subtle/50" />
              <div className="w-full border-t border-border-subtle/50" />
              <div className="w-full border-t border-border-subtle/50" />
              <div className="w-full border-t border-border-subtle/50" />
            </div>

            {/* Y-Axis Labels */}
            <div className="absolute left-2 top-4 bottom-10 flex flex-col justify-between text-[10px] text-outline font-semibold">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Bars */}
            {/* Q1 */}
            <div className="relative w-16 h-[80%] flex flex-col justify-end group cursor-pointer z-10">
              <div className="w-full bg-primary-fixed-dim/30 absolute bottom-0 h-full rounded-t border border-primary-fixed-dim/50 border-b-0" />
              <div className="w-full bg-primary rounded-t relative h-[75%] transition-all duration-300 group-hover:bg-primary-container" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-on-surface-variant">
                Q1
              </span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                Plan: 200h / Real: 150h
              </div>
            </div>

            {/* Q2 */}
            <div className="relative w-16 h-[80%] flex flex-col justify-end group cursor-pointer z-10">
              <div className="w-full bg-primary-fixed-dim/30 absolute bottom-0 h-full rounded-t border border-primary-fixed-dim/50 border-b-0" />
              <div className="w-full bg-primary rounded-t relative h-[85%] transition-all duration-300 group-hover:bg-primary-container" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-on-surface-variant">
                Q2
              </span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                Plan: 200h / Real: 170h
              </div>
            </div>

            {/* Q3 */}
            <div className="relative w-16 h-[80%] flex flex-col justify-end group cursor-pointer z-10">
              <div className="w-full bg-primary-fixed-dim/30 absolute bottom-0 h-full rounded-t border border-primary-fixed-dim/50 border-b-0" />
              <div className="w-full bg-secondary-container rounded-t relative h-[45%] transition-all duration-300 group-hover:bg-secondary" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-on-surface-variant">
                Q3
              </span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                Plan: 200h / Real: 90h
              </div>
            </div>

            {/* Q4 */}
            <div className="relative w-16 h-[80%] flex flex-col justify-end group cursor-pointer z-10">
              <div className="w-full bg-primary-fixed-dim/30 absolute bottom-0 h-full rounded-t border border-primary-fixed-dim/50 border-b-0" />
              <div className="w-full bg-surface-variant rounded-t relative h-[15%] transition-all duration-300" />
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-on-surface-variant">
                Q4
              </span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow">
                Em planejamento
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-3 pt-2 border-t border-border-subtle text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-fixed-dim/50 border border-primary-fixed-dim" />
              <span>Meta Planejada (Unidade)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Horas Realizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-container" />
              <span>Atenção (Abaixo da Média)</span>
            </div>
          </div>
        </div>

        {/* Ranking de Temas (cap_temas) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-border-subtle p-5 card-shadow flex flex-col h-96">
          <h2 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2 mb-4 shrink-0">
            <span className="material-symbols-outlined text-mt-gold">military_tech</span>
            Temas Mais Cursados
          </h2>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {rankedTemas.map((tema, index) => (
              <div
                key={tema.tema_id}
                className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-gray hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      index === 0
                        ? 'bg-primary-container text-white'
                        : index === 1
                        ? 'bg-mt-gold text-white'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-on-surface leading-snug">
                      {tema.descricao}
                    </h3>
                    <p className="text-[10px] text-outline">{tema.mnemonico}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-primary ml-2">{tema.horas}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auditor Progress Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle card-shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-gray">
          <h2 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">group</span>
            Progresso dos Auditores (Meta: 40h / ano)
          </h2>
          <div className="relative w-full sm:w-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
              search
            </span>
            <input
              type="text"
              value={searchAuditor}
              onChange={(e) => setSearchAuditor(e.target.value)}
              placeholder="Filtrar auditor por nome..."
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-surface border border-border-subtle rounded-md text-xs md:text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-gray/50 text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                <th className="p-3.5">Auditor</th>
                <th className="p-3.5">Cargo</th>
                <th className="p-3.5 w-60">Progresso Anual</th>
                <th className="p-3.5 text-center">Horas Realizadas</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs md:text-sm">
              {filteredAuditores.map((auditor) => {
                const isMetaCompleted = auditor.hr_realizadas >= auditor.meta_anual;
                const isDelayed = auditor.hr_realizadas < 15;

                return (
                  <tr key={auditor.auditor_id} className="hover:bg-surface-gray transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border-subtle">
                          <img src={auditor.avatar} alt={auditor.nome} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{auditor.nome}</p>
                          <p className="text-[11px] text-outline">Matrícula: {auditor.matricula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-on-surface-variant">{auditor.cargo}</td>
                    <td className="p-3.5">
                      <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden border border-border-subtle">
                        <div
                          className={`h-2.5 rounded-full ${
                            isMetaCompleted
                              ? 'bg-success-green'
                              : isDelayed
                              ? 'bg-warning-amber'
                              : 'bg-primary'
                          }`}
                          style={{
                            width: `${Math.min((auditor.hr_realizadas / auditor.meta_anual) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px]">
                        <span className="text-outline font-semibold">0h</span>
                        <span
                          className={`font-bold ${
                            isMetaCompleted ? 'text-success-green' : isDelayed ? 'text-warning-amber' : 'text-primary'
                          }`}
                        >
                          {isMetaCompleted ? 'Meta Atingida!' : `${auditor.hr_realizadas}h de 40h`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-cge-navy text-sm">
                      {auditor.hr_realizadas}h <span className="text-outline text-xs font-normal">/ 40h</span>
                    </td>
                    <td className="p-3.5 text-center">
                      {isMetaCompleted ? (
                        <span className="inline-flex items-center gap-1 bg-success-green/10 text-success-green border border-success-green/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Concluído
                        </span>
                      ) : isDelayed ? (
                        <span className="inline-flex items-center gap-1 bg-warning-amber/10 text-warning-amber border border-warning-amber/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          Atrasado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">sync</span>
                          Em Andamento
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => alert(`Detalhes do auditor: ${auditor.nome}`)}
                        className="text-primary hover:bg-surface-container-low p-1.5 rounded-md transition-colors"
                        title="Ver detalhamento"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
