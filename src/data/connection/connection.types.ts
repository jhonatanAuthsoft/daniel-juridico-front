/** Wire / domain types for connections (`/conexoes`). */

export type StatusConexaoApi =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'CANCELADA';

/** Urgency of the underlying solicitation (`UrgenciaSolicitacaoEnum`). */
export type UrgenciaConexaoApi =
  | 'EMERGENCIA'
  | 'URGENTE'
  | 'MEDIO'
  | 'TENHO_TEMPO';

/** UI card status used by `ClientConnectionStatus`. */
export type ClientConnectionUiStatus =
  | 'idle'
  | 'pending'
  | 'accepted'
  | 'rejected';

export type ConexaoWire = {
  id: string;
  solicitacaoId: string;
  clienteId: string;
  advogadoId: string;
  status: StatusConexaoApi;
  criadoEm: string;
  decididoEm: string | null;
  canceladoEm: string | null;
  /** First time the lawyer opened the solicitation; null = never opened. */
  visualizadaEm: string | null;
  telefone: string | null;
  email: string | null;
  nomeAdvogado: string | null;
  nomeCliente: string | null;
  tituloSolicitacao: string | null;
  descricaoSolicitacao: string | null;
  urgencia: string | null;
  modalidade: string | null;
  especialidadeCodigo: string | null;
  subespecialidadeCodigo: string | null;
  experienciaMinimaMeses: number | null;
  uf: string | null;
  cidade: string | null;
  formaCobranca: string | null;
  clienteProfissao: string | null;
  clientePronomes: string | null;
  clienteEstadoCivil: string | null;
  clienteFaixaRenda: string | null;
  clienteFotoUrl: string | null;
  clienteCidade: string | null;
  clienteUf: string | null;
  clienteTelefone: string | null;
  clienteEmail: string | null;
  avaliacaoClienteNota: number | string | null;
  avaliacaoClienteComentario: string | null;
};

export type CreateConnectionParams = {
  solicitacaoId: string;
  advogadoId: string;
};

export type ConnectionResult = {
  id: string;
  solicitacaoId: string;
  clienteId: string;
  advogadoId: string;
  status: StatusConexaoApi;
  uiStatus: ClientConnectionUiStatus;
  criadoEm: string;
  decididoEm: string | null;
  canceladoEm: string | null;
  /** First time the lawyer opened the solicitation; null = never opened. */
  visualizadaEm: string | null;
  telefone: string | null;
  email: string | null;
  nomeAdvogado: string | null;
  nomeCliente: string | null;
  tituloSolicitacao: string | null;
  descricaoSolicitacao: string | null;
  urgencia: string | null;
  modalidade: string | null;
  especialidadeCodigo: string | null;
  subespecialidadeCodigo: string | null;
  experienciaMinimaMeses: number | null;
  uf: string | null;
  cidade: string | null;
  formaCobranca: string | null;
  clienteProfissao: string | null;
  clientePronomes: string | null;
  clienteEstadoCivil: string | null;
  clienteFaixaRenda: string | null;
  clienteFotoUrl: string | null;
  clienteCidade: string | null;
  clienteUf: string | null;
  clienteTelefone: string | null;
  clienteEmail: string | null;
  avaliacaoClienteNota: number | null;
  avaliacaoClienteComentario: string | null;
};

export type ConexaoListagemWire = {
  items: ConexaoWire[];
  contagemPorUrgencia: Partial<Record<UrgenciaConexaoApi, number>>;
  contagemPorStatus?: Partial<Record<StatusConexaoApi, number>>;
};

export type ListConnectionsParams = {
  status?: StatusConexaoApi | StatusConexaoApi[];
  /** Omit to fetch the whole list unpaged. */
  limit?: number;
  offset?: number;
  /** Server-side urgency filter (`?urgencia=`). */
  urgencia?: UrgenciaConexaoApi;
  /** Server-side search on counterpart name, title, description and city. */
  busca?: string;
};

export type ConnectionUrgencyCounts = Record<UrgenciaConexaoApi, number>;

export type ConnectionStatusCounts = Record<StatusConexaoApi, number>;

export type ListConnectionsResult = {
  items: ConnectionResult[];
  totalElements: number;
  /** Global per-urgency totals, unaffected by the urgency filter and search. */
  countsByUrgency: ConnectionUrgencyCounts;
  /** Global per-status totals, unaffected by status, urgency and search. */
  countsByStatus: ConnectionStatusCounts;
};
