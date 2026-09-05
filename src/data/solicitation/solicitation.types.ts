/** Wire / domain types for solicitations (`/solicitacoes`). */

import type { ClientSolicitationCardData } from '@/components/client-solicitation-card';

export type ModalidadeSolicitacaoApi =
  | 'CONSULTORIA'
  | 'PROCESSO'
  | 'MEDIACAO';

export type UrgenciaSolicitacaoApi =
  | 'EMERGENCIA'
  | 'URGENTE'
  | 'MEDIO'
  | 'TENHO_TEMPO';

export type FormaCobrancaSolicitacaoApi =
  | 'VALOR_FIXO'
  | 'HORA'
  | 'EXITO'
  | 'NEGOCIAR';

export type NivelLocalidadeApi =
  | 'MESMA_CIDADE'
  | 'MESMO_ESTADO'
  | 'FORA_ESTADO';

export type DisponibilidadeApi = 'DISPONIVEL' | 'INDISPONIVEL';

/** Workflow status from the API (`StatusSolicitacaoEnum`). */
export type StatusSolicitacaoApi =
  | 'AGUARDANDO_MATCHING'
  | 'MATCH_REALIZADO'
  | 'CANCELADA';

/** Wire body for `POST /solicitacoes`. */
export type CreateSolicitationWireRequest = {
  titulo: string;
  modalidade: ModalidadeSolicitacaoApi;
  especialidadeCodigo: string;
  subespecialidadeCodigo?: string;
  uf: string;
  cidade: string;
  urgencia: UrgenciaSolicitacaoApi;
  descricao: string;
  formaCobranca?: FormaCobrancaSolicitacaoApi;
  experienciaMinimaMeses?: number;
};

/** Wire response for create / get-by-id / cancel. */
export type SolicitacaoDetalheWire = {
  id: string;
  status: StatusSolicitacaoApi;
  titulo: string;
  modalidade: ModalidadeSolicitacaoApi;
  especialidadeCodigo: string;
  subespecialidadeCodigo: string | null;
  uf: string;
  cidade: string;
  urgencia: UrgenciaSolicitacaoApi;
  descricao: string;
  formaCobranca: FormaCobrancaSolicitacaoApi | null;
  experienciaMinimaMeses: number | null;
  totalMatches: number;
  criadoEm: string;
};

/** Same shape as create response — kept for callers of create. */
export type CreateSolicitationWireResponse = SolicitacaoDetalheWire;

export type SolicitacaoListagemItemWire = {
  id: string;
  status: StatusSolicitacaoApi;
  urgencia: UrgenciaSolicitacaoApi;
  titulo: string;
  descricao: string;
  dataAbertura: string;
  especialidadeCodigo: string;
  especialidade: string;
  totalMatches: number;
  /** Accepted connections count (`ACEITA`). Used for "aceitaram" footer. */
  totalConexoesAceitas?: number;
};

export type SolicitacaoListagemWire = {
  items: SolicitacaoListagemItemWire[];
  contagemPorStatus: Partial<Record<StatusSolicitacaoApi, number>>;
};

export type SolicitacaoMatchPontuacaoWire = {
  modalidade: number;
  localidade: number;
  especialidade: number;
  subespecialidade: number;
  experiencia: number;
  formaCobranca: number;
};

export type CatalogoItemWire = {
  codigo: string;
  nome: string;
};

export type SolicitacaoMatchWire = {
  advogadoId: string;
  nome: string;
  fotoUrl: string | null;
  posicao: number;
  compatibilidade: number;
  nivelLocalidade: NivelLocalidadeApi;
  disponibilidade?: DisponibilidadeApi | null;
  mediaAvaliacoes: number | null;
  totalAvaliacoes: number | null;
  bairro?: string | null;
  cidade?: string | null;
  modalidadeAtuacao?: CatalogoItemWire | null;
  pontuacao: SolicitacaoMatchPontuacaoWire;
};

export type CreateSolicitationParams = {
  title: string;
  practice: string;
  specialty: string;
  state: string;
  city: string;
  urgency: string;
  problem: string;
  subspecialty?: string;
  billingMethod?: string;
  minimumExperienceMonths?: string;
};

export type CreateSolicitationResult = {
  id: string;
  status: string;
  title: string;
  totalMatches: number;
  createdAt: string;
};

export type ListSolicitationsParams = {
  limit?: number;
  offset?: number;
  /** API workflow status filter (`?status=`). */
  status?: StatusSolicitacaoApi;
  /** Server-side search on title/description (`?busca=`). */
  busca?: string;
};

export type SolicitationStatusCounts = Record<StatusSolicitacaoApi, number>;

export type ListSolicitationsResult = {
  items: ClientSolicitationCardData[];
  totalElements: number;
  countsByStatus: SolicitationStatusCounts;
};

export type SolicitationDetailResult = {
  id: string;
  title: string;
  description: string;
  urgency: UrgenciaSolicitacaoApi;
  modality: ModalidadeSolicitacaoApi;
  specialtyCode: string;
  subspecialtyCode: string | null;
  state: string;
  city: string;
  billingMethod: FormaCobrancaSolicitacaoApi | null;
  minimumExperienceMonths: number | null;
  totalMatches: number;
  createdAt: string;
  status: StatusSolicitacaoApi;
};

export type SolicitationMatchResult = {
  lawyerId: string;
  name: string;
  photoUrl: string | null;
  position: number;
  compatibility: number;
  localityLevel: NivelLocalidadeApi;
  isAvailable: boolean;
  averageRating: number | null;
  totalReviews: number | null;
  neighborhood?: string | null;
  city?: string | null;
  practice?: { code: string; name: string } | null;
};
