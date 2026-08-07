/** Wire / domain types for connections (`/conexoes`). */

export type StatusConexaoApi =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'CANCELADA';

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
  telefone: string | null;
  email: string | null;
  nomeAdvogado: string | null;
  nomeCliente: string | null;
  tituloSolicitacao: string | null;
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
  telefone: string | null;
  email: string | null;
  nomeAdvogado: string | null;
  nomeCliente: string | null;
  tituloSolicitacao: string | null;
};

export type ListConnectionsParams = {
  status?: StatusConexaoApi;
};
