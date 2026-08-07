export interface Tema {
  tema_id: string;
  mnemonico: string;
  descricao: string;
  portaria: string;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CursoStatus = 'Concluído' | 'Em Andamento' | 'Planejado';

export interface Curso {
  curso_id: string;
  tema_id: string;
  nome: string;
  descricao: string;
  instituicao: string;
  unidade: string;
  auditor: string;
  hr_planejadas: number;
  hr_realizadas: number;
  status: CursoStatus;
  data_cadastro?: string;
}

export interface Auditor {
  auditor_id: string;
  nome: string;
  matricula: string;
  cargo: string;
  unidade: string;
  superintendencia: string;
  avatar: string;
  hr_planejadas: number;
  hr_realizadas: number;
  meta_anual: number;
}

export type ViewMode = 'dashboard' | 'meus-cursos' | 'acompanhamento' | 'relatorios';
