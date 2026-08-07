import React, { useState } from 'react';
import { Curso, Tema, Auditor, CursoStatus } from '../../types';

interface LancamentoCursosViewProps {
  currentAuditor: Auditor;
  cursos: Curso[];
  temas: Tema[];
  onAddCurso: (novoCurso: Omit<Curso, 'curso_id'>) => void;
  onDeleteCurso: (cursoId: string) => void;
}

export const LancamentoCursosView: React.FC<LancamentoCursosViewProps> = ({
  currentAuditor,
  cursos,
  temas,
  onAddCurso,
  onDeleteCurso,
}) => {
  // Form State
  const [nome, setNome] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [temaId, setTemaId] = useState('');
  const [hrPlanejadas, setHrPlanejadas] = useState<number | ''>('');
  const [hrRealizadas, setHrRealizadas] = useState<number | ''>('');
  const [descricao, setDescricao] = useState('');

  // Table Filter/Search State
  const [searchFilter, setSearchFilter] = useState('');

  const handleClear = () => {
    setNome('');
    setInstituicao('');
    setTemaId('');
    setHrPlanejadas('');
    setHrRealizadas('');
    setDescricao('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !instituicao.trim() || !temaId || !hrPlanejadas) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const plan = Number(hrPlanejadas) || 0;
    const real = Number(hrRealizadas) || 0;

    let status: CursoStatus = 'Planejado';
    if (real >= plan && plan > 0) {
      status = 'Concluído';
    } else if (real > 0 && real < plan) {
      status = 'Em Andamento';
    }

    onAddCurso({
      nome,
      instituicao,
      tema_id: temaId,
      hr_planejadas: plan,
      hr_realizadas: real,
      descricao,
      unidade: currentAuditor.unidade,
      auditor: currentAuditor.nome,
      status,
      data_cadastro: new Date().toISOString().split('T')[0],
    });

    handleClear();
  };

  // Filter courses
  const filteredCursos = cursos.filter((c) => {
    const matchSearch =
      c.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.instituicao.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.auditor.toLowerCase().includes(searchFilter.toLowerCase());
    return matchSearch;
  });

  const totalRealizadas = cursos.reduce((acc, c) => acc + c.hr_realizadas, 0);

  return (
    <div className="space-y-6 max-w-container-max mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mb-1">
            Lançamento de Cursos
          </h2>
          <p className="font-body-lg text-sm text-on-surface-variant">
            Registre e acompanhe suas horas de capacitação contínua.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2.5 card-shadow flex items-center gap-3">
            <div className="bg-primary-fixed/20 p-2 rounded-md text-primary">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                schedule
              </span>
            </div>
            <div>
              <p className="font-label-md text-[11px] text-outline uppercase font-semibold">Meta Anual</p>
              <p className="font-headline-sm text-base font-bold text-on-surface">{currentAuditor.meta_anual}h</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-2.5 card-shadow flex items-center gap-3">
            <div className="bg-success-green/10 p-2 rounded-md text-success-green">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>
            <div>
              <p className="font-label-md text-[11px] text-outline uppercase font-semibold">Realizadas</p>
              <p className="font-headline-sm text-base font-bold text-on-surface">{totalRealizadas}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 card-shadow">
            <div className="flex items-center gap-2 mb-5 border-b border-border-subtle pb-3">
              <span className="material-symbols-outlined text-primary text-xl">edit_document</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">Novo Registro</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome do Curso */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="curso-nome">
                  Nome do Curso <span className="text-error">*</span>
                </label>
                <input
                  id="curso-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Auditoria Baseada em Riscos"
                  className="w-full bg-surface-gray border border-outline-variant rounded-md px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              {/* Instituição */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="instituicao">
                  Instituição <span className="text-error">*</span>
                </label>
                <input
                  id="instituicao"
                  type="text"
                  value={instituicao}
                  onChange={(e) => setInstituicao(e.target.value)}
                  placeholder="Ex: Escola de Governo MT"
                  className="w-full bg-surface-gray border border-outline-variant rounded-md px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
              </div>

              {/* Tema Prioritário */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="tema-prioritario">
                  Tema Prioritário <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    id="tema-prioritario"
                    value={temaId}
                    onChange={(e) => setTemaId(e.target.value)}
                    className="w-full bg-surface-gray border border-outline-variant rounded-md pl-3 pr-8 py-2 text-xs md:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Selecione um tema (cap_temas)
                    </option>
                    {temas.map((t) => (
                      <option key={t.tema_id} value={t.tema_id}>
                        {t.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Horas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="horas-plan">
                    Horas Planejadas <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="horas-plan"
                      type="number"
                      min="1"
                      value={hrPlanejadas}
                      onChange={(e) => setHrPlanejadas(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full bg-surface-gray border border-outline-variant rounded-md pl-3 pr-7 py-2 text-xs md:text-sm text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-xs">h</span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="horas-real">
                    Horas Realizadas
                  </label>
                  <div className="relative">
                    <input
                      id="horas-real"
                      type="number"
                      min="0"
                      value={hrRealizadas}
                      onChange={(e) => setHrRealizadas(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full bg-surface-gray border border-outline-variant rounded-md pl-3 pr-7 py-2 text-xs md:text-sm text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-xs">h</span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-1" htmlFor="descricao">
                  Descrição <span className="text-outline font-normal">(Opcional)</span>
                </label>
                <textarea
                  id="descricao"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Breve resumo sobre o conteúdo do curso..."
                  className="w-full bg-surface-gray border border-outline-variant rounded-md px-3 py-2 text-xs md:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex gap-2 justify-end border-t border-border-subtle mt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-primary border border-outline-variant rounded-md font-label-md text-xs hover:bg-surface-container-low transition-colors"
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-md font-label-md text-xs font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl border border-border-subtle card-shadow overflow-hidden flex flex-col h-full">
            {/* Header Actions */}
            <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface-bright">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cge-navy text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  library_books
                </span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">Cursos Cadastrados</h3>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filtrar cursos..."
                    className="w-full pl-9 pr-3 py-1.5 bg-surface-container border border-border-subtle rounded-md text-xs md:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-container overflow-x-auto flex-1 bg-surface-bright">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-border-subtle">
                    <th className="py-3 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      Nome do Curso
                    </th>
                    <th className="py-3 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      Tema / Instituição
                    </th>
                    <th className="py-3 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                      Horas (P/R)
                    </th>
                    <th className="py-3 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      Status
                    </th>
                    <th className="py-3 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-semibold text-center w-20">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs md:text-sm">
                  {filteredCursos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-outline">
                        Nenhum curso encontrado com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredCursos.map((curso) => {
                      const temaObj = temas.find((t) => t.tema_id === curso.tema_id);
                      return (
                        <tr key={curso.curso_id} className="hover:bg-surface-gray transition-colors group">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-primary">{curso.nome}</p>
                            {curso.descricao && (
                              <p className="text-xs text-on-surface-variant truncate max-w-xs mt-0.5">
                                {curso.descricao}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-on-surface font-medium">{temaObj?.descricao || 'Tema não especificado'}</p>
                            <p className="text-xs text-outline mt-0.5">{curso.instituicao}</p>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-outline">{curso.hr_planejadas}h</span> /{' '}
                            <span className="font-bold text-on-surface">{curso.hr_realizadas}h</span>
                          </td>
                          <td className="py-3.5 px-4">
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
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onDeleteCurso(curso.curso_id)}
                                className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-md transition-colors"
                                title="Excluir curso"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t border-border-subtle bg-surface-container-lowest flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">
                Mostrando {filteredCursos.length} de {cursos.length} registros
              </span>
              <div className="flex gap-1">
                <button disabled className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant text-outline cursor-not-allowed">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-primary bg-primary text-white font-bold">
                  1
                </button>
                <button disabled className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant text-outline cursor-not-allowed">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
